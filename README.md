# Desktop HTTP Client

A modern desktop HTTP client tool like Postman, built with Electron, React, and TypeScript.

## Features

- 🚀 **Modern UI**: Clean and intuitive interface built with React and Tailwind CSS
- 🔥 **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- 📝 **Request Builder**: Easy-to-use request builder with headers and body editors
- 📊 **Response Viewer**: Beautiful JSON viewer with syntax highlighting and collapsible sections
- 💾 **Request History**: Automatic request history with timestamps and response status
- 🔖 **Save Requests**: Save and organize your frequently used requests
- ⚡ **Fast**: Native desktop performance with Electron
- 🎨 **Cross-Platform**: Works on Windows, macOS, and Linux

## Screenshots

*Coming soon*

## Installation

### Development

1. Clone the repository:
```bash
git clone https://github.com/wizardleeen/httpclient.git
cd httpclient
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Package for your platform:
```bash
npm run electron:pack
```

## Usage

1. **Making Requests**:
   - Select HTTP method from the dropdown
   - Enter your request URL
   - Add headers in the Headers tab
   - Add request body in the Body tab (for POST/PUT/PATCH requests)
   - Click Send or press Cmd/Ctrl+Enter

2. **Viewing Responses**:
   - Response body is displayed with syntax highlighting for JSON
   - View response headers in the Headers tab
   - See response time, status, and size in the header

3. **Managing Requests**:
   - Save frequently used requests by clicking "Save Current" in the sidebar
   - View request history in the History tab
   - Reload previous requests by clicking on them

4. **Keyboard Shortcuts**:
   - `Cmd/Ctrl+N`: New request
   - `Cmd/Ctrl+Enter`: Send request

## Tech Stack

- **Electron**: Desktop app framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Heroicons**: Beautiful icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Environment variables
- [ ] Collections and folders
- [ ] Import/Export (Postman format)
- [ ] Authentication helpers (Bearer, Basic, etc.)
- [ ] Request/Response templating
- [ ] Dark theme
- [ ] Plugin system