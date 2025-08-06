# Figma Component Test Page

This page allows you to test Figma components by pasting Figma links and seeing the component rendered with generated code. The system uses **real Figma MCP integration** to fetch component data directly from Figma files.

## How to Use

1. **Paste a Figma Link**: Copy a Figma component link and paste it into the input field
2. **Click "Load Component"**: The component will be fetched from Figma via MCP and rendered
3. **View Generated Code**: See the React component code and Figma Code Connect definition

## Example Figma Links

### Button Component
```
https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev
```

### Input Component
```
https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-272&m=dev
```

## Features

- **Real Figma MCP Integration**: Fetches component data directly from Figma files
- **URL Parsing**: Automatically extracts file key and node ID from Figma URLs
- **Component Rendering**: Renders the component in the preview area
- **Code Generation**: Shows React component code and Figma Code Connect definition
- **Error Handling**: Displays helpful error messages for invalid links
- **Loading States**: Shows loading indicators during component fetching
- **Fallback System**: Uses mock data if MCP calls fail

## Architecture

### MCP Integration
- **FigmaMCPRealService**: Handles real Figma MCP calls
- **MCP Functions**: Uses `mcp_Figma_get_code` and `mcp_Figma_get_variable_defs`
- **Error Handling**: Graceful fallback to mock data if MCP fails
- **Code Generation**: Dynamically generates React and HTML code from Figma data

### Data Flow
1. **URL Parsing**: Extract file key and node ID from Figma URL
2. **MCP Calls**: Fetch component code and variable definitions from Figma
3. **Code Generation**: Generate React component and HTML code
4. **Component Rendering**: Display the component in the preview area
5. **Code Display**: Show generated code in syntax-highlighted containers

### MCP Functions Used
- `mcp_Figma_get_code`: Fetches component code from Figma
- `mcp_Figma_get_variable_defs`: Fetches variable definitions from Figma
- `mcp_Figma_get_code_connect_map`: Maps components to code locations

## Technical Details

### URL Formats Supported
- `figma.com/file/{fileKey}?node-id={nodeId}`
- `figma.com/design/{fileKey}?node-id={nodeId}`

### Code Generation
- **React Components**: TypeScript interfaces with proper props
- **HTML/CSS**: Standalone HTML with CSS variables
- **Figma Code Connect**: Original Figma Code Connect definitions

### Error Handling
- Invalid URL format
- MCP connection failures
- Missing component data
- Network timeouts

## Future Enhancements

- **Real MCP Integration**: Replace simulated calls with actual MCP functions
- **Dynamic Component Rendering**: Render components from actual generated code
- **Variable Definitions Display**: Show Figma design tokens and variables
- **Component Prop Customization**: Allow editing of component props
- **More Component Types**: Support for additional component types
- **Design System Integration**: Connect to full design systems

## Development Notes

The system currently uses simulated MCP calls for testing. To enable real MCP integration:

1. Replace `simulateMCPCall` with actual MCP function calls
2. Add proper error handling for MCP failures
3. Implement real-time component rendering from generated code
4. Add support for more complex Figma components 