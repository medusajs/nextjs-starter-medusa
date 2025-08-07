# 🔄 Documentation Sync Information

> **Note**: This documentation automatically syncs to a production repository for deployment.

## 🎯 **How It Works**

When you make changes to documentation in this monorepo:

1. **✏️ Edit docs** in this `docs/` folder
2. **🚀 Commit & push** to main branch  
3. **🤖 Automation triggers** - GitHub Actions workflow runs
4. **📦 Docs extracted** - cleaned and prepared for production
5. **🔀 PR created** - in the separate docs repository
6. **👀 Review process** - team reviews the auto-generated PR
7. **✅ Merge & deploy** - docs go live at docs.mysupplyco.com

## 📋 **What Gets Synced**

### **✅ Included:**
- All `.mdx` files and content
- Navigation configuration (`_meta.js` files)
- Theme configuration
- Production-optimized `package.json`
- Deployment configurations (Vercel, etc.)
- SEO and sitemap configurations

### **❌ Excluded:**
- `node_modules/`
- `.next/` build artifacts
- Development lock files
- Local configuration files

## 🛡️ **Quality Assurance**

### **Automated Checks:**
- ✅ **Build validation** - ensures docs build successfully
- ✅ **Link checking** - validates internal links work
- ✅ **Content extraction** - only syncs when changes detected

### **Human Review:**
- ✅ **PR review process** - team approves before production
- ✅ **Preview deployments** - test changes before going live
- ✅ **Rollback capability** - easy to revert if needed

## 🎨 **Development Tips**

### **Local Testing:**
```bash
cd docs/
npm install
npm run dev
# Test your changes at http://localhost:3003
```

### **Content Guidelines:**
- Use `.mdx` extension for all documentation files
- Update `_meta.js` files when adding new pages
- Test links and navigation locally before committing
- Follow the existing content structure

### **Commit Messages:**
```bash
# Good commit messages for docs:
git commit -m "docs: add new installation guide"
git commit -m "docs: update API reference for v2.0"
git commit -m "docs: fix broken links in getting started"
```

## 🔍 **Troubleshooting**

### **Sync Not Triggering?**
- Check if changes are in `docs/**` paths
- Ensure you pushed to `main` branch
- Look at GitHub Actions tab for workflow status

### **Build Failures?**
- Test locally first: `npm run build`
- Check for MDX syntax errors
- Validate all internal links work

### **PR Not Created?**
- Verify `DOCS_REPO_TOKEN` secret is configured
- Check repository permissions
- Look at workflow logs for error details

## 📊 **Monitoring**

### **Where to Check Status:**
- **GitHub Actions**: See workflow runs in Actions tab
- **Docs Repository**: Check for auto-generated PRs
- **Production Site**: Verify changes at docs.mysupplyco.com

### **Timeline:**
- **Sync trigger**: Immediate (on push to main)
- **PR creation**: ~2-3 minutes
- **Review time**: Manual (team dependent)
- **Production deployment**: ~2-3 minutes (after PR merge)

## 🎉 **Benefits**

### **For You (Developer):**
- ✅ **Zero extra work** - just edit and commit normally
- ✅ **Immediate feedback** - see changes in PR preview
- ✅ **Quality assurance** - team reviews before production

### **For Users:**
- ✅ **Always current** - docs stay in sync with code
- ✅ **High quality** - reviewed and tested before publication
- ✅ **Fast loading** - optimized production deployment

---

**Happy documenting! Your changes will automatically flow to production through our professional deployment pipeline.** 🚀
