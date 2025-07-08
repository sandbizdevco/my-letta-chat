# 🤖 Letta Chat Interface

A modern Next.js chat application for interacting with self-hosted Letta agents.

## Features

- 🔐 **Secure Environment Variable Management**
- 💬 **Real-time Chat with Letta Agent**
- 🧠 **Persistent Memory** - Agent remembers across sessions
- 🎨 **Modern UI** with Tailwind CSS
- 📱 **Responsive Design**
- ⚡ **Streaming Responses**
- 🔄 **Auto-scroll Messages**
- 📊 **Session Statistics**

## Prerequisites

- Node.js 18+ 
- A running Letta server (self-hosted or Letta Cloud)
- Letta agent ID

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd my-letta-chat
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Required Environment Variables
LETTA_BASE_URL=https://your-letta-server.com
LETTA_SERVER_PASSWORD=your_server_password
LETTA_AGENT_ID=agent-your-agent-id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `LETTA_BASE_URL` | Your Letta server URL | `https://your-server.railway.app` |
| `LETTA_SERVER_PASSWORD` | Server authentication token | `your_password_token` |
| `LETTA_AGENT_ID` | Your Letta agent identifier | `agent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **AI Integration:** Vercel AI SDK + Letta Provider
- **Type Safety:** TypeScript

## Security Notes

- ✅ Environment variables are never committed to git
- ✅ All sensitive data is in `.env.local`
- ✅ `.env*` files are ignored by git
- ✅ No hardcoded secrets in code

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
