using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Azure;
using Azure.Communication.Email;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Trip2Vegas.Api;

/// <summary>
/// POST /api/contact - receives the website contact form and emails it
/// through Azure Communication Services (same service as the other projects).
///
/// App settings (Azure Portal, Static Web App, Environment variables):
///   ACS_CONNECTION_STRING  connection string of the Communication Services resource
///   CONTACT_TO             recipient           (default pa@trip2vegas.com)
///   CONTACT_FROM           verified sender     (default DoNotReply@trip2vegas.com)
/// </summary>
public class ContactFunction
{
    private const int MinFillMs = 3000; // humans need longer than this to fill the form
    private static readonly Regex EmailRegex = new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);
    private static readonly Regex LineBreaks = new(@"[\r\n]+", RegexOptions.Compiled);
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly ILogger<ContactFunction> _logger;

    public ContactFunction(ILogger<ContactFunction> logger) => _logger = logger;

    public class ContactRequest
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        [JsonPropertyName("tour_interest")] public string? TourInterest { get; set; }
        public string? Message { get; set; }
        public string? Lang { get; set; }
        /// <summary>Honeypot: hidden field real visitors never fill in.</summary>
        public string? Website { get; set; }
        /// <summary>Milliseconds between page load and submit.</summary>
        public long ElapsedMs { get; set; }
    }

    [Function("contact")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequestData req)
    {
        ContactRequest? form;
        try
        {
            form = await JsonSerializer.DeserializeAsync<ContactRequest>(req.Body, JsonOptions);
        }
        catch (JsonException)
        {
            return await Json(req, HttpStatusCode.BadRequest, "Invalid request.");
        }
        if (form is null) return await Json(req, HttpStatusCode.BadRequest, "Invalid request.");

        // --- Spam protection: bots get a fake "ok" so they do not adapt ---
        if (!string.IsNullOrEmpty(form.Website) || form.ElapsedMs < MinFillMs)
        {
            _logger.LogWarning("Contact form blocked as spam (honeypot={Honeypot}, elapsedMs={Elapsed})",
                !string.IsNullOrEmpty(form.Website), form.ElapsedMs);
            return await Json(req, HttpStatusCode.OK, "ok");
        }

        // --- Validation ---
        var name = (form.Name ?? "").Trim();
        var email = (form.Email ?? "").Trim();
        var phone = (form.Phone ?? "").Trim();
        var tour = (form.TourInterest ?? "").Trim();
        var message = (form.Message ?? "").Trim();
        var lang = (form.Lang ?? "").Trim();
        if (lang.Length is 0 or > 5) lang = "-";

        if (name.Length is 0 or > 100 ||
            email.Length > 200 || !EmailRegex.IsMatch(email) ||
            phone.Length > 40 || tour.Length > 150 ||
            message.Length is 0 or > 5000)
        {
            return await Json(req, HttpStatusCode.BadRequest, "Please check the form fields.");
        }

        var connectionString = Environment.GetEnvironmentVariable("ACS_CONNECTION_STRING");
        if (string.IsNullOrEmpty(connectionString))
        {
            _logger.LogError("ACS_CONNECTION_STRING is not configured");
            return await Json(req, HttpStatusCode.InternalServerError, "Email is not configured.");
        }
        var to = Environment.GetEnvironmentVariable("CONTACT_TO") ?? "pa@trip2vegas.com";
        var from = Environment.GetEnvironmentVariable("CONTACT_FROM") ?? "DoNotReply@trip2vegas.com";

        // Header fields must be single-line; body values are HTML-encoded.
        var subject = "Trip2Vegas inquiry - " + LineBreaks.Replace(name, " ");
        if (tour.Length > 0) subject += " (" + LineBreaks.Replace(tour, " ") + ")";

        static string E(string s) => WebUtility.HtmlEncode(s);
        static string Row(string label, string value) =>
            "<tr><td style=\"padding:6px 0;color:#666;width:130px;\">" + label +
            "</td><td style=\"padding:6px 0;\">" + (value.Length > 0 ? E(value) : "-") + "</td></tr>";

        var html =
            "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;\">" +
            "<div style=\"background:#0A0A0A;padding:20px;text-align:center;\">" +
            "<h1 style=\"color:#FFD700;margin:0;font-size:22px;\">New Website Inquiry</h1></div>" +
            "<div style=\"padding:20px;background:#f8f8f8;\">" +
            "<table style=\"width:100%;border-collapse:collapse;\">" +
            Row("Name", name) + Row("Email", email) + Row("Phone", phone) +
            Row("Tour interest", tour) + Row("Site language", lang) +
            "</table>" +
            "<h2 style=\"color:#0A0A0A;font-size:16px;border-bottom:2px solid #FFD700;padding-bottom:6px;margin-top:20px;\">Message</h2>" +
            "<p style=\"background:#fff;padding:12px;border:1px solid #e5e5e5;border-radius:6px;white-space:pre-wrap;\">" + E(message) + "</p>" +
            "<p style=\"color:#888;font-size:12px;\">Reply to this email to answer the customer directly.</p>" +
            "</div></div>";

        var plain = $"Name: {name}\nEmail: {email}\nPhone: {phone}\nTour interest: {tour}\n\n{message}";

        try
        {
            var emailMessage = new EmailMessage(
                senderAddress: from,
                content: new EmailContent(subject) { Html = html, PlainText = plain },
                recipients: new EmailRecipients(new[] { new EmailAddress(to) }));
            emailMessage.ReplyTo.Add(new EmailAddress(email, LineBreaks.Replace(name, " ")));

            var operation = await new EmailClient(connectionString).SendAsync(WaitUntil.Started, emailMessage);
            _logger.LogInformation("Contact email queued, operation {OperationId}", operation.Id);
        }
        catch (RequestFailedException ex)
        {
            _logger.LogError(ex, "Failed to send contact email");
            return await Json(req, HttpStatusCode.BadGateway, "Could not send the message.");
        }

        return await Json(req, HttpStatusCode.OK, "ok");
    }

    private static async Task<HttpResponseData> Json(HttpRequestData req, HttpStatusCode status, string message)
    {
        var resp = req.CreateResponse(status);
        resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await resp.WriteStringAsync(JsonSerializer.Serialize(new { ok = status == HttpStatusCode.OK, message }));
        return resp;
    }
}
