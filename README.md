# RIVR DeFi Dashboard

Glassmorphism DeFi dashboard with AI chat powered by Cerebras Llama 3.1 8B.

## Features
- Glassmorphism hero with video background & animations
- AI chat with chain-of-thought reasoning (prompt-kit)
- Source cards for company/protocol queries

## Live
https://workspace-green-alpha.vercel.app

## Stack
React + Vite + TypeScript · Tailwind CSS + shadcn/ui + prompt-kit · Express · Cerebras AI · pnpm workspaces

## Setup
```bash
pnpm install
# Set CEREBRAS_API_KEY in environment
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/rivr run dev
```
