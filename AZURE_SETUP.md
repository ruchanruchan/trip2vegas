# Azure Static Web App Configuration Guide

**Project**: Trip2Vegas
**Date**: January 6, 2026
**Hosting**: Azure Static Web Apps (FREE Tier)

---

## 🚀 Azure Static Web App Setup Steps

### **Step 1: Create Azure Static Web App**

1. **Login to Azure Portal**
   - Go to: https://portal.azure.com
   - Login with your Azure account

2. **Create Static Web App**
   - Click **"Create a resource"**
   - Search for **"Static Web App"**
   - Click **"Create"**

3. **Basic Configuration:**
   ```
   Subscription: [Your Azure Subscription]
   Resource Group: CoffeeFortuneAI-RG (use existing - shared with other projects)
   Name: trip2vegas
   Plan type: Free
   Region: East US 2 (or closest to your location)
   ```

4. **Deployment Details:**
   ```
   Source: GitHub
   GitHub Account: [Your GitHub username]
   Organization: [Your GitHub username]
   Repository: trip2vegas
   Branch: master
   ```

5. **Build Details:**
   ```
   Build Presets: Custom
   App location: /
   Api location: (leave empty)
   Output location: (leave empty)
   ```

6. Click **"Review + Create"** → **"Create"**

---

### **Step 2: GitHub Integration (Automatic)**

After creation, Azure will:
- ✅ Connect to your GitHub repository
- ✅ Add a deployment token to GitHub Secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN`)
- ✅ Create a GitHub Actions workflow (already done in `.github/workflows/azure-static-web-apps.yml`)
- ✅ Trigger first deployment automatically

**Check Deployment:**
- Go to GitHub repository → **Actions** tab
- You should see a workflow running: "Deploy to Azure Static Web Apps"

---

### **Step 3: Configure Custom Domain (trip2vegas.com)**

#### **Prerequisites:**
- You own the domain **trip2vegas.com**
- You have access to domain DNS settings (GoDaddy, Namecheap, etc.)

#### **Add Custom Domain in Azure:**

1. **In Azure Portal:**
   - Navigate to your Static Web App: **trip2vegas**
   - Click **"Custom domains"** in the left menu
   - Click **"+ Add"**

2. **Domain Configuration:**
   ```
   Domain type: Custom domain on other DNS
   Domain name: trip2vegas.com
   ```

3. **Azure will provide DNS records:**
   ```
   Type: TXT
   Name: _dnsauth.trip2vegas.com
   Value: [Azure-provided token]
   TTL: 3600
   ```

   ```
   Type: CNAME
   Name: www
   Value: [your-static-app].azurestaticapps.net
   TTL: 3600
   ```

   **OR (for root domain):**
   ```
   Type: ALIAS or ANAME (if supported)
   Name: @
   Value: [your-static-app].azurestaticapps.net
   TTL: 3600
   ```

4. **Add DNS Records at Domain Registrar:**
   - Login to your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to DNS Management
   - Add the TXT record for verification
   - Add CNAME or ALIAS record for the domain

5. **Validate in Azure:**
   - Click **"Validate"** in Azure Portal
   - Wait for DNS propagation (5-60 minutes)
   - SSL certificate will be auto-issued (Let's Encrypt)

---

## 📊 Azure Static Web App Details

### **URLs:**
- **Azure Default**: https://[your-app-name].azurestaticapps.net
- **Custom Domain**: https://trip2vegas.com (after DNS setup)

### **Features Included (FREE Tier):**
- ✅ **100 GB bandwidth/month** (more than enough for startup)
- ✅ **0.5 GB storage** (plenty for static website)
- ✅ **Free SSL certificate** (auto-renewed)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Custom domains** (trip2vegas.com)
- ✅ **Staging environments** (preview PRs before merging)
- ✅ **GitHub Actions integration** (auto-deploy on push)

### **Cost:**
- **Monthly**: $0.00 (FREE tier)
- **Bandwidth overage**: $0.20/GB (only if you exceed 100GB/month)

---

## 🔧 Deployment Workflow

### **How Auto-Deployment Works:**

```
Developer pushes to GitHub (master branch)
    ↓
GitHub Actions workflow triggered (.github/workflows/azure-static-web-apps.yml)
    ↓
Azure builds and deploys the site
    ↓
Site goes live at trip2vegas.com (1-2 minutes)
```

### **Manual Deployment:**
If you need to manually trigger deployment:
1. Go to GitHub repository
2. Click **"Actions"** tab
3. Select **"Deploy to Azure Static Web Apps"** workflow
4. Click **"Run workflow"** → **"Run workflow"**

---

## 🗂️ Resource Group Structure

```
Azure Resource Group: CoffeeFortuneAI-RG
│
├── 🍵 coffeefortune (App Service - CupReading)
├── 🏀 raqballusa (App Service - RaqballUSA)
├── 🏀 raqballusa-api (App Service - RaqballUSA API)
├── 🎰 trip2vegas (Static Web App - NEW)
│
├── 📦 Shared Resources
│   ├── PostgreSQL: coffeefortune.postgres.database.azure.com
│   ├── Key Vault: radiaura-keyvault
│   ├── Storage: coffeefortunestorage
│   └── Email: comservice1 (Azure Communication Services)
```

**Note**: Trip2Vegas uses shared infrastructure (PostgreSQL, Storage, Key Vault) but has its own independent web hosting.

---

## 🔐 GitHub Secrets

After Azure creates the Static Web App, check that this secret exists:

**GitHub Repository → Settings → Secrets and variables → Actions:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (auto-added by Azure)

This token allows GitHub Actions to deploy to Azure.

---

## 🧪 Testing Deployment

### **After first deployment:**

1. **Check Azure Portal:**
   - Go to Static Web App: **trip2vegas**
   - Click **"Overview"**
   - Click the **URL** (e.g., https://nice-ocean-123abc.azurestaticapps.net)

2. **Verify Features:**
   - ✅ Page loads with Vegas Luxury theme (Gold/Black/Red)
   - ✅ Language toggle works (EN ↔ TR)
   - ✅ Responsive design (test on mobile)
   - ✅ Contact email link works (mailto:pa@trip2vegas.com)

3. **Check GitHub Actions:**
   - Go to **Actions** tab
   - Latest workflow should show **✅ Success**
   - Deployment time: ~1-2 minutes

---

## 🚨 Troubleshooting

### **Issue: Deployment Fails**
**Solution:**
1. Check GitHub Actions logs (Actions → Latest run → Click job)
2. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` exists in GitHub Secrets
3. Check that workflow file is correct (`.github/workflows/azure-static-web-apps.yml`)

### **Issue: Custom Domain Not Working**
**Solution:**
1. Verify DNS records are correct (use `nslookup trip2vegas.com` or dig)
2. Wait 5-60 minutes for DNS propagation
3. Check Azure Portal → Custom domains → Status should be "Validated"
4. SSL certificate takes 5-10 minutes after validation

### **Issue: 404 Error**
**Solution:**
1. Ensure `index.html` is in the **root directory** (not in subfolder)
2. Check `app_location: "/"` in GitHub Actions workflow
3. Redeploy from GitHub Actions

---

## 📝 Next Steps (After Deployment)

Once the under construction page is live:

1. ✅ **Test on mobile devices** (iPhone, Android)
2. ✅ **Share URL with stakeholders** (get feedback)
3. ✅ **Set up Google Analytics** (optional, for traffic tracking)
4. ✅ **Plan content structure** (tours, about us, contact form)
5. ✅ **Design full website** (homepage, tours catalog, etc.)

---

## 💰 Cost Summary

| **Resource** | **Service** | **Monthly Cost** |
|--------------|-------------|------------------|
| Static Web App | Azure Static Web Apps (Free) | **$0.00** |
| Storage (images) | Azure Storage (existing account) | **~$0.50** |
| Bandwidth | Included (100GB/month) | **$0.00** |
| SSL Certificate | Auto (Let's Encrypt) | **$0.00** |
| **TOTAL** | | **~$0.50/month** |

**Shared Infrastructure (already exists):**
- PostgreSQL Server: ~$15-30/month (shared with CupReading, RaqballUSA)
- Key Vault: ~$1/month (shared)
- Storage Account: ~$1-5/month (shared)

**Impact of adding Trip2Vegas: +$0.50/month** (negligible!)

---

## 🎯 Summary

**What We Built:**
- ✅ Under construction page (index.html)
- ✅ Vegas Luxury theme (Gold/Black/Red)
- ✅ Turkish/English language toggle
- ✅ Responsive design (mobile-first)
- ✅ Azure Static Web Apps deployment workflow
- ✅ GitHub Actions auto-deployment

**What's Live:**
- 🌐 Under construction page at Azure URL
- 🚀 Auto-deployment from GitHub (push to master = instant deploy)

**What's Next:**
- ⏳ Configure custom domain (trip2vegas.com)
- ⏳ Build full website (homepage, tours, contact)
- ⏳ Add tour content (40+ tours with TR/EN)

---

**Need Help?** Check Azure documentation: https://docs.microsoft.com/azure/static-web-apps/
