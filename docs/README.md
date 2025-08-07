# 📚 MySupplyCo Documentation (Development)

> **Note**: This is the **development version** of the docs within the monorepo.
> 
> For **production deployment**, docs are extracted to a separate repository using the polyrepo architecture.

## 🎯 **Development vs Production Architecture**

### **Development (This Repo)**
- ✅ **Monorepo**: Docs live alongside the main app
- ✅ **Great DX**: Easy to update docs while coding
- ✅ **Local Testing**: Test docs changes immediately
- ✅ **Version Sync**: Docs stay in sync with code changes

### **Production (Separate Repo)**
- ✅ **Clean Distribution**: Users get starter kit without docs bloat
- ✅ **Independent Deployment**: Docs have their own CI/CD
- ✅ **Better Performance**: Optimized for documentation only
- ✅ **Team Separation**: Docs team can work independently

## 🚀 **Local Development**

```bash
# Start docs development server
cd docs
npm install
npm run dev
```

Visit [http://localhost:3003](http://localhost:3003)

## 📦 **Creating a Release**

When ready to deploy docs to production:

```bash
# Extract docs for polyrepo deployment
./scripts/extract-docs-for-release.sh
```

This will:
1. ✅ Create a standalone docs package
2. ✅ Remove development dependencies
3. ✅ Add production configurations
4. ✅ Generate deployment scripts
5. ✅ Prepare for separate repository

## 🏗️ **Architecture Benefits**

### **For Developers Using the Starter:**
- ✅ **Clean codebase** without documentation bloat
- ✅ **Faster installs** and builds
- ✅ **Focus on business logic** not docs infrastructure

### **For Documentation Maintainers:**
- ✅ **Independent deployment** pipeline
- ✅ **Separate analytics** and performance monitoring
- ✅ **Custom domain** management
- ✅ **Team-specific** access controls

### **For End Users:**
- ✅ **Fast documentation** site
- ✅ **Always up-to-date** with latest features
- ✅ **Professional appearance** 
- ✅ **SEO optimized**

## 🔄 **Workflow**

1. **Development**: Make changes in `./docs/` 
2. **Test Locally**: `npm run dev` in docs folder
3. **Commit Changes**: Normal git workflow in monorepo
4. **Release**: Run extraction script when ready
5. **Deploy**: Push extracted docs to production repo

## 🎉 **Best of Both Worlds**

This approach gives you:
- **Development Speed** ⚡ (monorepo convenience)
- **Production Clean** 🧹 (polyrepo distribution)
- **Team Efficiency** 👥 (separate deployment pipelines)
- **User Experience** ✨ (optimized for each use case)

---

**Ready to develop?** Start the docs server and begin editing! 🚀