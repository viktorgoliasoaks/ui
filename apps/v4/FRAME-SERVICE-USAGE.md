# Frame Service - Usage Guide

## 🎯 **What We Built:**
A separate service that fetches Figma frame data via MCP, extracts child components with Code Connect code, and generates a layout test page.

## 🚀 **How It Works:**

### **1. Fetch Frame Data (Cursor Context)**
```bash
# Fetch data for specific frame
npm run frame:fetch 22:1167

# Or fetch by URL
npm run frame:cli fetch-url "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=22-1167"

# Quick test command
npm run frame:test    # Fetches frame 22:1167
```

### **2. View Layout Test Page**
- Open http://localhost:4000/layout-test
- Page loads frame data from `current-frame.json`
- Shows only components with valid Code Connect React code
- Displays clean layout with real Figma components

### **3. CLI Management**
```bash
# List cached frame data
npm run frame:list

# Show CLI help
npm run frame:cli help
```

## 📁 **File Structure:**
```
apps/v4/
├── scripts/
│   ├── frame-fetch.ts            # Main frame fetcher
│   └── frame-cli.ts              # CLI commands
├── lib/
│   ├── frame-types.ts            # Frame type definitions
│   ├── frame-utils.ts            # Frame utilities
│   └── frame-data-manager.ts     # Frame data management
├── mcp-data/
│   ├── components/               # Single components (existing)
│   └── frames/                   # Frame data (new)
│       └── current-frame.json    # Current frame data
├── app/(app)/
│   └── layout-test/              # Layout test page
│       └── page.tsx
├── app/api/
│   └── frame-data/               # Frame data API
│       └── route.ts
└── components/
    └── frame-layout.tsx          # Frame layout component
```

## 🔧 **Commands:**

### **Manual Fetch (Run in Cursor):**
```bash
# Fetch specific frame
npx tsx scripts/frame-fetch.ts 22:1167

# Using CLI helper
npx tsx scripts/frame-cli.ts fetch 22:1167
npx tsx scripts/frame-cli.ts fetch-url "https://figma.com/..."
npx tsx scripts/frame-cli.ts list
```

### **Web App Workflow:**
1. **Run frame fetch** in Cursor context
2. **Open layout-test** page at localhost:4000/layout-test
3. **View rendered components** with Code Connect code

## 🎯 **Key Features:**

### **✅ Code Connect Only Rendering**
- Only renders components with valid Code Connect React code
- Skips components without published code
- Clean, minimal output

### **✅ Reuses Existing Infrastructure**
- Uses existing MCP fetch patterns
- Follows existing file structure
- No breaking changes to current workflow

### **✅ Separate Service**
- Independent from single-component workflow
- Own data storage (`mcp-data/frames/`)
- Isolated page (`/layout-test`)

### **✅ Generic File Names**
- Always saves to `current-frame.json`
- Easy to switch between frames
- Consistent workflow

## 🚨 **Important Notes:**

### **MCP Access Required**
- Frame fetch commands must run in Cursor with MCP enabled
- Terminal commands will fail with "MCP functions not available"
- Only Cursor AI can access Figma MCP functions

### **Code Connect Dependencies**
- Only components published via Code Connect will be rendered
- Components without Code Connect code are skipped
- No fallback to local codebase components

### **Frame vs Component**
- This service works with frames (containers with multiple components)
- Different from single-component workflow
- Extracts children from frame mapping

## 🔄 **Workflow Example:**

1. **Select frame in Figma** (e.g., frame 22:1167)
2. **Run in Cursor**: `npm run frame:test`
3. **Open browser**: http://localhost:4000/layout-test
4. **View rendered layout** with Code Connect components

**That's it! Clean, simple, and focused on Code Connect components only.**
