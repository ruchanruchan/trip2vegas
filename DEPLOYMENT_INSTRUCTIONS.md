# 🚀 Trip2Vegas - Deployment Instructions

**Status**: Ready to Deploy to Azure Static Web Apps
**Date**: January 6, 2026
**Next Steps**: Create Azure Static Web App and configure DNS

---

## ✅ What's Ready

### **1. Under Construction Page**
- ✅ File: `index.html`
- ✅ Vegas Luxury theme (Gold #FFD700, Black #0A0A0A, Red #DC143C)
- ✅ Turkish/English language toggle
- ✅ Responsive design (mobile-first)
- ✅ Features showcase (Adventure, Entertainment, Sightseeing, Dining)
- ✅ Contact info: pa@trip2vegas.com
- ✅ Animated loading spinner
- ✅ Smooth hover effects

### **2. GitHub Repository**
- ✅ Repository: trip2vegas
- ✅ Branch: master
- ✅ Commits: 3 commits total
- ✅ GitHub Actions workflow: `.github/workflows/azure-static-web-apps.yml`

### **3. Documentation**
- ✅ CLAUDE.md (project context & guidelines)
- ✅ README.md (project overview)
- ✅ AZURE_SETUP.md (detailed Azure configuration guide)
- ✅ This file (deployment instructions)

---

## 🔧 Deploy to Azure (Follow These Steps)

### **STEP 1: Create Azure Static Web App**

1. **Open Azure Portal**: https://portal.azure.com

2. **Create Resource**:
   - Click **"+ Create a resource"**
   - Search: **"Static Web App"**
   - Click **"Create"**

3. **Fill in Details**:
   ```
   Basics:
   ├── Subscription: [Your Azure Subscription]
   ├── Resource Group: CoffeeFortuneAI-RG (use existing)
   ├── Name: trip2vegas
   ├── Plan type: Free
   ├── Region: East US 2
   └── Source: GitHub

   GitHub Details:
   ├── Organization: [Your GitHub username]
   ├── Repository: trip2vegas
   └── Branch: master

   Build Details:
   ├── Build Presets: Custom
   ├── App location: /
   ├── Api location: (leave empty)
   └── Output location: (leave empty)
   ```

4. **Review + Create**:
   - Click **"Review + create"**
   - Click **"Create"**
   - Wait 2-3 minutes for deployment

5. **Automatic GitHub Integration**:
   - Azure will automatically:
     - ✅ Connect to your GitHub repo
     - ✅ Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to GitHub Secrets
     - ✅ Trigger first deployment

---

### **STEP 2: Verify Deployment**

1. **Check Azure Portal**:
   - Go to: Resource Groups → CoffeeFortuneAI-RG → trip2vegas
   - Click **"Overview"**
   - Note the **URL**: https://[random-name].azurestaticapps.net
   - Click the URL to view your site

2. **Check GitHub Actions**:
   - Go to: https://github.com/[your-username]/trip2vegas
   - Click **"Actions"** tab
   - You should see: **"Deploy to Azure Static Web Apps"** ✅
   - Deployment takes ~1-2 minutes

3. **Test the Site**:
   - ✅ Page loads with gold/black/red theme
   - ✅ Language toggle works (🇬🇧 EN ↔ 🇹🇷 TR)
   - ✅ Responsive on mobile (test browser DevTools)
   - ✅ Email link works: pa@trip2vegas.com

---

### **STEP 3: Configure Custom Domain (trip2vegas.com)**

**Prerequisites:**
- ✅ You own trip2vegas.com domain
- ✅ You have access to DNS settings (GoDaddy, Namecheap, etc.)

**Steps:**

1. **In Azure Portal** (trip2vegas Static Web App):
   - Click **"Custom domains"** (left sidebar)
   - Click **"+ Add"**
   - Select: **"Custom domain on other DNS"**
   - Enter: **trip2vegas.com**
   - Click **"Next"**

2. **Azure Provides DNS Records**:
   Azure will show you 2 records to add:

   **Record 1 (Verification):**
   ```
   Type: TXT
   Name: _dnsauth.trip2vegas.com
   Value: [long random string from Azure]
   TTL: 3600
   ```

   **Record 2 (Domain Routing):**
   ```
   Option A - CNAME (subdomain www):
   Type: CNAME
   Name: www
   Value: [your-app].azurestaticapps.net
   TTL: 3600

   Option B - ALIAS/ANAME (root domain @):
   Type: ALIAS or ANAME
   Name: @
   Value: [your-app].azurestaticapps.net
   TTL: 3600
   ```

3. **Add Records to Domain Registrar**:
   - Login to your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to: **DNS Management** or **DNS Settings**
   - Add the **TXT record** (for verification)
   - Add the **CNAME** or **ALIAS** record (for routing)
   - Save changes

4. **Validate in Azure**:
   - Go back to Azure Portal
   - Click **"Validate"**
   - Wait 5-60 minutes for DNS propagation
   - Once validated, Azure will issue **free SSL certificate** (Let's Encrypt)

5. **Verify Custom Domain**:
   - Visit: https://trip2vegas.com
   - Should show your under construction page
   - ✅ HTTPS (SSL) should work automatically

---

## 🎯 Expected Results

### **After Deployment:**

**Azure URL**: https://[random].azurestaticapps.net
- ✅ Under construction page visible
- ✅ Language toggle functional
- ✅ Mobile responsive
- ✅ Fast loading (global CDN)

**Custom Domain** (after DNS setup): https://trip2vegas.com
- ✅ Same content as Azure URL
- ✅ Free SSL certificate (HTTPS)
- ✅ Auto-renewing SSL (no maintenance)

**Auto-Deployment**:
- Any push to `master` branch triggers deployment
- Changes go live in ~1-2 minutes
- No manual deployment needed

---

## 📊 Resource Summary

### **What You're Creating:**

```
Azure Resource Group: CoffeeFortuneAI-RG
│
└── 🎰 trip2vegas (NEW - Static Web App)
    ├── Type: Azure Static Web Apps
    ├── Tier: Free
    ├── URL: https://trip2vegas.com
    ├── Region: East US 2
    ├── Deployment: GitHub Actions (auto)
    └── Cost: $0/month
```

### **Shared Resources (Already Exist):**
- ✅ PostgreSQL: coffeefortune.postgres.database.azure.com
- ✅ Storage: coffeefortunestorage (for images later)
- ✅ Key Vault: radiaura-keyvault (for secrets later)
- ✅ Email: comservice1 (for contact form later)

---

## 💰 Cost Impact

| **Item** | **Before Trip2Vegas** | **After Trip2Vegas** | **Increase** |
|----------|----------------------|---------------------|--------------|
| Total Monthly Cost | ~$56-203 | ~$56.50-203.50 | **+$0.50** |

**New Costs:**
- Azure Static Web App: **$0.00** (free tier)
- Storage (images): **~$0.50/month** (10GB, using existing storage account)

**No increase to:**
- PostgreSQL (shared, no new database yet)
- Key Vault (shared, no new secrets yet)
- Email (shared, no contact form yet)

---

## 🚨 Troubleshooting

### **Problem: Deployment fails in GitHub Actions**

**Solution:**
1. Check GitHub Actions logs (Actions → Latest run → Click job)
2. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` exists in:
   - GitHub → Settings → Secrets and variables → Actions
3. Re-run the workflow manually (Actions → Re-run jobs)

### **Problem: Custom domain not working**

**Solution:**
1. Check DNS propagation: https://dnschecker.org (enter trip2vegas.com)
2. Verify TXT and CNAME/ALIAS records are correct
3. Wait up to 60 minutes for full DNS propagation
4. Check Azure Portal → Custom domains → Status should be "Validated"

### **Problem: SSL certificate not issued**

**Solution:**
1. SSL takes 5-10 minutes after domain validation
2. Ensure DNS records are correct
3. Wait and refresh browser cache (Ctrl+Shift+R)

---

## 📝 Next Steps (After Site is Live)

1. ✅ **Test under construction page** on mobile devices
2. ✅ **Share URL** with stakeholders for feedback
3. ⏳ **Discuss content structure** (tours, about, contact)
4. ⏳ **Gather tour data** (40+ tours with TR/EN content)
5. ⏳ **Collect images** (logo, hero images, tour photos)
6. ⏳ **Build full website** (homepage, tours catalog, contact form)

---

## 🆘 Need Help?

**Documentation:**
- Azure Static Web Apps: https://docs.microsoft.com/azure/static-web-apps/
- Custom domains: https://docs.microsoft.com/azure/static-web-apps/custom-domain

**Project Files:**
- Detailed setup: `AZURE_SETUP.md`
- Project context: `CLAUDE.md`
- Overview: `README.md`

**Contact:**
- Email: pa@trip2vegas.com
- Developer: richard@raqballusa.com

---

**Ready to deploy! Follow STEP 1 above to create the Azure Static Web App.** 🎰🚀
