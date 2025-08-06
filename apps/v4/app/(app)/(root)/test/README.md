# Figma Component Test Page

This page allows you to test Figma components by pasting Figma links and seeing the component rendered with generated code.

## How to Use

1. **Paste a Figma Link**: Copy a Figma component link and paste it into the input field
2. **Click "Load Component"**: The component will be fetched and rendered
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

- **URL Parsing**: Automatically extracts file key and node ID from Figma URLs
- **Component Rendering**: Renders the component in the preview area
- **Code Generation**: Shows React component code and Figma Code Connect definition
- **Error Handling**: Displays helpful error messages for invalid links
- **Loading States**: Shows loading indicators during component fetching

## Architecture

- **FigmaMCPService**: Handles Figma URL parsing and component data fetching
- **Mock Data**: Currently uses mock data for testing (can be replaced with real MCP calls)
- **Dynamic Rendering**: Renders components based on node ID
- **Code Display**: Shows formatted code in syntax-highlighted containers

## Future Enhancements

- Integrate with real Figma MCP server
- Support for more component types
- Dynamic component rendering from actual code
- Variable definitions display
- Component prop customization 