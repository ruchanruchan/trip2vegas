# 🤖 Claude Code Setup Instructions

**Project**: Trip2Vegas
**Last Updated**: January 7, 2026

---

## 🎯 Quick Setup for Developers

If you're working on this project with Claude Code, follow these steps to enable full permissions (no prompts):

---

## 📋 Step 1: Configure Permissions

Create the file `.claude/settings.local.json` in the project root with the following content:

```json
{
  "permissions": {
    "allow": [
      "Bash",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "TodoWrite",
      "Task",
      "NotebookEdit"
    ],
    "deny": [],
    "ask": []
  }
}
```

**Quick Command (Windows PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path .claude
Set-Content -Path .claude\settings.local.json -Value @'
{
  "permissions": {
    "allow": [
      "Bash",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "TodoWrite",
      "Task",
      "NotebookEdit"
    ],
    "deny": [],
    "ask": []
  }
}
'@
```

**Quick Command (Mac/Linux):**
```bash
mkdir -p .claude
cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "TodoWrite",
      "Task",
      "NotebookEdit"
    ],
    "deny": [],
    "ask": []
  }
}
EOF
```

---

## ✅ What This Enables

With these permissions, Claude Code can:

### **File Operations** (No Prompts):
- ✅ Read any project file
- ✅ Create new files
- ✅ Edit existing files
- ✅ Search files (Glob, Grep)

### **Command Line** (No Prompts):
- ✅ Git operations (add, commit, push, pull)
- ✅ Azure CLI (`az` commands)
- ✅ GitHub CLI (`gh` commands)
- ✅ Package managers (npm, dotnet, pip)
- ✅ Database operations (psql, SQL scripts)

### **Web & Research** (No Prompts):
- ✅ Fetch documentation from URLs
- ✅ Search the web for information

### **Development Tools** (No Prompts):
- ✅ Todo list management
- ✅ Launch specialized agents
- ✅ Edit Jupyter notebooks (if needed)

---

## 🔒 Security Notes

### **Safe Configuration:**
1. **Local Only**: `.claude/` is in `.gitignore` (not committed to repo)
2. **Per-Developer**: Each developer configures their own permissions
3. **Reversible**: All operations are logged and can be undone
4. **Secrets Protected**: API keys, passwords stored in Azure Key Vault (not in code)

### **What's NOT Committed:**
- `.claude/settings.local.json` ❌ (local configuration)
- Secrets, API keys, passwords ❌ (in Azure Key Vault)
- `.env` files ❌ (in .gitignore)

### **What IS Committed:**
- Project code (HTML, CSS, JS) ✅
- Documentation ✅
- GitHub Actions workflows ✅
- .gitignore configuration ✅

---

## 🚀 Why Pre-Approve?

**Without permissions**: Claude asks for approval on every action
```
❓ Can I read index.html?
❓ Can I edit index.html?
❓ Can I commit changes?
❓ Can I push to GitHub?
```

**With permissions**: Claude works seamlessly
```
✅ Reading index.html...
✅ Editing index.html...
✅ Committing changes...
✅ Pushing to GitHub...
```

**Result**: Faster development, no interruptions! 🚀

---

## 🔄 Consistency Across Projects

This configuration matches other projects in the organization:
- **CupReading**: Full permissions ✅
- **RaqballUSA**: Full permissions ✅
- **Trip2Vegas**: Full permissions ✅

All developers experience the same workflow across all projects.

---

## 🛠️ Troubleshooting

### **Issue: Claude still asks for permission**

**Solution:**
1. Verify `.claude/settings.local.json` exists
2. Check JSON syntax (must be valid)
3. Restart VS Code or Claude Code session
4. Ensure tool names are exact (e.g., `"Bash"` not `"bash"`)

### **Issue: File not found**

**Solution:**
```bash
# Check if file exists
ls -la .claude/settings.local.json

# If missing, create it (see Step 1 above)
```

### **Issue: Permission denied**

**Solution:**
- Check file permissions: `chmod 644 .claude/settings.local.json`
- Ensure you own the file: `chown $USER .claude/settings.local.json`

---

## 📝 Modifying Permissions

If you need to restrict specific operations:

### **Example: Block database operations**
```json
{
  "permissions": {
    "allow": ["Bash", "Read", "Write", "Edit"],
    "deny": ["Bash(psql:*)"],
    "ask": []
  }
}
```

### **Example: Ask before git push**
```json
{
  "permissions": {
    "allow": ["Bash", "Read", "Write", "Edit"],
    "deny": [],
    "ask": ["Bash(git push:*)"]
  }
}
```

### **Example: Full permissions (current)**
```json
{
  "permissions": {
    "allow": [
      "Bash",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "TodoWrite",
      "Task",
      "NotebookEdit"
    ],
    "deny": [],
    "ask": []
  }
}
```

---

## 🎓 For New Developers

When onboarding new developers to Trip2Vegas:

1. **Clone repo**: `git clone https://github.com/ruchanruchan/trip2vegas.git`
2. **Install Claude Code**: (VS Code extension or CLI)
3. **Configure permissions**: Run command from Step 1 above
4. **Verify setup**: Open project in Claude Code
5. **Test**: Ask Claude to read a file (should work without prompt)

---

## 📚 Additional Documentation

- **Project Setup**: See `README.md`
- **Azure Deployment**: See `AZURE_SETUP.md` and `DEPLOYMENT_INSTRUCTIONS.md`
- **Live Site**: See `LIVE_SITE_INFO.md`
- **Project Guidelines**: See `CLAUDE.md`

---

## ✅ Summary

**Current Status**: Full permissions configured ✅

Claude Code can now:
- Read, write, edit files freely
- Execute git, Azure CLI, GitHub CLI commands
- Deploy to Azure without prompts
- Search web and fetch documentation
- Manage tasks and todos

**No permission prompts required!** 🎉

---

**Questions?** See `CLAUDE.md` or contact project maintainers.
