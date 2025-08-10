# MCP Data Bridge - Usage Guide

## 🎯 **What We Built:**
A bridge between Cursor's MCP functions and your localhost web app using file-based data transfer.

## 🚀 **How It Works:**

### **1. Fetch MCP Data (Cursor Context)**
```bash
# Fetch data for specific component
npm run mcp:fetch 28:1289

# Or fetch by URL
npm run mcp:fetch-url "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289"

# Quick commands for known components
npm run mcp:button    # Fetches button data
npm run mcp:input     # Fetches input data
```

### **2. View Data via Web App**
- Open http://localhost:4000
- Paste Figma URL in the input field
- App will show:
  - ✅ Real MCP data (if available)
  - ✅ Local React component source
  - ✅ Combined display

### **3. Auto-Fetch (Optional)**
```bash
# Start request watcher (in Cursor)
npm run mcp:watch
```

## 📁 **File Structure:**
```
apps/v4/
├── mcp-data/                    # MCP-fetched data
│   ├── components/
│   │   ├── 28-1289.json        # Button MCP data
│   │   └── 12-272.json         # Input MCP data
│   └── requests/               # Auto-fetch requests
├── scripts/
│   ├── mcp-fetch.ts            # Main MCP fetcher
│   ├── mcp-cli.ts              # CLI commands
│   └── mcp-watcher.ts          # Auto request processor
└── app/api/mcp-data/           # Web app API
```

## 🔧 **Commands:**

### **Manual Fetch (Run in Cursor):**
```bash
# Fetch specific component
npx tsx scripts/mcp-fetch.ts 28:1289

# Using CLI helper
npx tsx scripts/mcp-cli.ts fetch 28:1289
npx tsx scripts/mcp-cli.ts fetch-url "https://figma.com/..."
npx tsx scripts/mcp-cli.ts list
```

### **Web App Workflow:**
1. **Paste Figma URL** in localhost app
2. **App checks** for existing MCP data
3. **If not found:** Shows command to run in Cursor
4. **Run command** in Cursor context
5. **Refresh page** - app shows combined data

## 🎯 **Expected Output:**

### **When MCP Data Available:**
- ✅ **Published Code:** Real Code Connect code  
- ✅ **React Source:** Local component file
- ✅ **Metadata:** Version, published status, etc.
- ❌ **Images:** Removed from MCP fetching (only code and metadata)

### **When MCP Data Missing:**
- ❌ **Clear Message:** "MCP data not available"
- 📋 **Instructions:** Exact command to run in Cursor
- 🔗 **File Bridge:** No mock data, only real data or honest errors

## 🧪 **Testing:**

### **Test Button Component:**
```bash
# 1. Fetch MCP data (in Cursor)
npm run mcp:button

# 2. Open localhost:4000
# 3. Paste: https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289
# 4. Should show real data
```

### **Test Unpublished Component:**
```bash
# 1. Paste URL for unpublished component
# 2. Should show "MCP data not available"
# 3. Should show exact command to fetch
```

## ✅ **Success Criteria:**
- [ ] No mock data shown [[memory:5572201]]
- [ ] Real MCP data when available
- [ ] Local React files displayed
- [ ] Clear instructions when data missing
- [ ] Combined Figma + local view working

## 🎉 **Architecture Achievement:**
**MCP Bridge:** Cursor ← MCP → Files ← API → Localhost App [[memory:5579714]]