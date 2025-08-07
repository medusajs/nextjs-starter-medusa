# 🚀 Deployment Setup Guide

## 🎯 **Dual Deployment Architecture**

Your monorepo now has **two independent deployment pipelines**:

- **📱 Storefront** (`deploy-storefront.yml`) → Main e-commerce application
- **📚 Documentation** (`deploy-docs.yml`) → Automated docs sync to separate repo

## ⚙️ **Required Setup**

### **1. GitHub Secrets Configuration**

#### **For Storefront Deployment:**
```bash
# In GitHub: Settings → Secrets and variables → Actions
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_storefront_project_id
```

#### **For Documentation Sync:**
```bash
# In GitHub: Settings → Secrets and variables → Actions
DOCS_REPO_TOKEN=your_github_personal_access_token
```

### **2. GitHub Token Permissions**

Create a **Personal Access Token** with these permissions:
- ✅ **repo** (Full control of private repositories)
- ✅ **workflow** (Update GitHub Action workflows)
- ✅ **pull_requests** (Create and manage pull requests)

### **3. Update Repository URLs**

Edit `.github/workflows/deploy-docs.yml`:
```yaml
env:
  DOCS_REPO: 'your-org/msc-docs'  # ← Update this to your actual docs repo
```

## 🔄 **How Deployments Work**

### **📱 Storefront Deployment Triggers:**
```yaml
# Deploys when these files change:
✅ src/**
✅ public/**  
✅ package.json
✅ next.config.js
✅ tailwind.config.js
✅ tsconfig.json
✅ store.config.js

# Ignores these files:
❌ docs/**     # Documentation changes
❌ website/**  # Old Docusaurus files
❌ *.md        # Markdown files
```

### **📚 Documentation Deployment Triggers:**
```yaml
# Deploys when these files change:
✅ docs/**     # Any documentation changes

# Process:
1. Extract docs from monorepo
2. Create branch in docs repository  
3. Generate pull request
4. Team reviews and merges
5. Docs deploy automatically
```

## 🛡️ **Security & Quality Gates**

### **Storefront Protection:**
- ✅ **Fast deployments** - Only builds when app code changes
- ✅ **Isolated builds** - Docs changes don't trigger app rebuilds
- ✅ **Production focus** - No documentation bloat in app deployment

### **Documentation Protection:**
- ✅ **Review process** - All docs changes reviewed via PR
- ✅ **Preview deployments** - Test changes before production
- ✅ **Quality validation** - Build checks before merge
- ✅ **Rollback capability** - Easy to revert problematic changes

## 📊 **Deployment Matrix**

| Change Type | Storefront Deploys | Docs Sync | Result |
|-------------|-------------------|-----------|---------|
| `src/` code | ✅ Yes | ❌ No | App updates only |
| `docs/` content | ❌ No | ✅ Yes | Docs PR created |
| `package.json` | ✅ Yes | ❌ No | App updates only |
| `README.md` | ❌ No | ❌ No | No deployments |
| Both `src/` + `docs/` | ✅ Yes | ✅ Yes | Both deploy independently |

## 🎨 **Workflow Benefits**

### **⚡ Performance:**
- **Faster builds** - Each pipeline optimized for its purpose
- **Parallel processing** - App and docs deploy simultaneously
- **Resource efficiency** - No wasted builds

### **🛡️ Safety:**
- **Isolated deployments** - Issues in one don't affect the other
- **Independent rollbacks** - Revert app or docs separately
- **Quality gates** - Different validation for different content types

### **👥 Team Collaboration:**
- **Separate review processes** - App team vs docs team
- **Different approval workflows** - Code review vs content review
- **Independent release cycles** - Deploy app and docs on different schedules

## 🚀 **Getting Started**

### **1. Set up Vercel projects:**
```bash
# Create storefront project
vercel --name mysupplyco-storefront

# Create docs project (in separate repo)
vercel --name mysupplyco-docs
```

### **2. Configure GitHub secrets:**
```bash
# Add all required tokens and IDs
# See "Required Setup" section above
```

### **3. Create docs repository:**
```bash
# Create new repository: msc-docs
# Enable branch protection on main branch
# Set up Vercel deployment
```

### **4. Test the workflows:**
```bash
# Test storefront deployment
echo "console.log('test')" >> src/app/test.js
git add . && git commit -m "test: storefront deployment"
git push origin main

# Test docs sync  
echo "# Test" >> docs/test.md
git add . && git commit -m "docs: test sync"
git push origin main
```

## 🔍 **Troubleshooting**

### **Storefront Not Deploying?**
- ✅ Check if changes are in monitored paths
- ✅ Verify Vercel secrets are configured
- ✅ Look at GitHub Actions logs

### **Docs Sync Not Working?**
- ✅ Verify `DOCS_REPO_TOKEN` secret exists
- ✅ Check token permissions (repo, workflow, pull_requests)
- ✅ Ensure docs repository exists and is accessible
- ✅ Update `DOCS_REPO` environment variable

### **Both Deploying When They Shouldn't?**
- ✅ Check `paths` and `paths-ignore` configurations
- ✅ Verify file changes are in correct directories
- ✅ Look for overlapping path patterns

## 🎉 **Success Indicators**

### **✅ Working Correctly When:**
- App changes only trigger storefront deployment
- Docs changes only trigger docs sync PR
- Each deployment completes independently
- Preview deployments work for both
- Team can review docs changes before production

### **🚨 Needs Attention When:**
- Both workflows trigger on single file changes
- Deployments fail due to missing secrets
- PRs aren't created in docs repository
- Build times are longer than expected

---

**Your deployment architecture is now production-ready with professional separation of concerns!** 🚀
