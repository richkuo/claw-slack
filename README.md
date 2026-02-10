# claw-slack 🦞

> A modern, multi-tab chat interface for OpenClaw Gateway sessions

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

## What is claw-slack?

claw-slack is a Slack-inspired web UI that connects to your OpenClaw Gateway, turning your sessions into organized chat channels. Each session becomes a "channel" in the sidebar, allowing you to seamlessly switch between conversations with different AI agents, contexts, or workflows.

![Screenshot placeholder](docs/screenshot-main.png)

## ✨ Features

- **🔗 Direct Gateway Integration** - Connects to OpenClaw Gateway REST API
- **📱 Multi-Session Management** - All your sessions organized by type (main, isolated, agents, etc.)
- **💬 Real-time Messaging** - Send messages and see responses in real-time
- **🎨 Slack-like Dark UI** - Familiar interface with modern dark theme
- **📱 Fully Responsive** - Works seamlessly on desktop and mobile
- **✨ Markdown Support** - Rich message formatting with syntax highlighting
- **⚡ Auto-refresh** - Sessions and messages update automatically
- **🔧 Easy Setup** - Just add your gateway URL and token

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- An running OpenClaw Gateway instance

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/richkuo/claw-slack.git
cd claw-slack/web
bun install
```

2. **Start the development server:**
```bash
bun run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

4. **Configure your gateway:**
- Click the settings (⚙️) button
- Enter your OpenClaw Gateway URL (e.g., `http://localhost:3000`)
- Enter your gateway token
- Click "Save"

### Production Build

```bash
bun run build
bun run start
```

## 🔧 Configuration

claw-slack stores your gateway configuration in browser localStorage:

- **Gateway URL**: The base URL of your OpenClaw Gateway
- **Token**: Your authentication token for the gateway

All settings are managed through the in-app settings modal.

## 📡 OpenClaw Gateway API

claw-slack uses these OpenClaw Gateway endpoints:

- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{sessionKey}/history` - Get message history
- `POST /api/sessions/{sessionKey}/message` - Send a message
- `GET /api/status` - Check gateway status

## 🏗️ Architecture

### Tech Stack

- **Next.js 16** with App Router
- **React 19** with hooks-based state management
- **TypeScript** for type safety
- **Tailwind CSS 4** with CSS-first approach
- **Bun** for fast package management and builds

### Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── Sidebar.tsx      # Session list sidebar
│   │   ├── ChatArea.tsx     # Main chat display
│   │   ├── MessageInput.tsx # Message composition
│   │   ├── MessageBubble.tsx# Individual message display
│   │   ├── SettingsModal.tsx# Gateway configuration
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useGateway.ts   # Gateway connection management
│   │   ├── useSessions.ts  # Session list management
│   │   └── useMessages.ts  # Message handling
│   └── lib/                # Utilities and types
│       ├── gateway.ts      # API client
│       ├── types.ts        # TypeScript interfaces
│       └── storage.ts      # localStorage helpers
```

### Key Components

- **Sidebar**: Displays sessions grouped by kind (main, isolated, agents, etc.)
- **ChatArea**: Shows messages for the active session with rich formatting
- **MessageInput**: Handles message composition with auto-resize
- **SettingsModal**: Manages gateway configuration

## 🎨 UI Design

claw-slack uses a carefully crafted dark theme inspired by Slack:

- **Color Palette**: Slate/zinc based with blue accents
- **Typography**: System fonts with monospace for code
- **Layout**: Responsive sidebar + main content area
- **Interactions**: Smooth transitions and hover effects

## 🔄 Auto-refresh Behavior

- **Sessions**: Refreshed every 30 seconds
- **Messages**: Polled every 5 seconds when a session is active
- **Connection Status**: Checked when gateway configuration changes

## 📱 Mobile Support

- Collapsible sidebar with mobile-friendly navigation
- Touch-optimized message input
- Responsive design that works on all screen sizes

## 🛠️ Development

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Environment Variables

No environment variables required - all configuration is done through the UI.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the [OpenClaw](https://openclaw.ai) ecosystem
- Inspired by Slack's excellent UX
- Powered by the amazing React and Next.js communities

---

**Made with ❤️ for the OpenClaw community**