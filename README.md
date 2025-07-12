# 📦 Pet_feeder

A simple **Progressive Web App (PWA)** that allows users to mark the days they fed their pets and receive notifications if they forget.

The app works on your mobile device when built and served over your local network (see guide below).  
All data is stored locally in the browser, so as long as the server runs and you don’t delete the data manually, it will remain available.

---

## 🚀 Getting Started

1. Navigate to the project directory:

```bash
cd petfeeder-vite
```

2. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

> ✅ Open your browser at http://localhost:5173 (or the port displayed in the console).

## 🌐 Build & Run on Local Network

To build the app and run it on your local network:

```bash
npm run build
npx serve dist
```

> 📱This allows you to access the app from your phone or other devices connected to the same Wi-Fi.

## 🛠️ Technologies

- React
- TypeScript
- Vite
- PWA (Service Workers, Manifest)

## ✨ Features

- Mark days your pet was fed
- Local notifications if you forget
- Works offline as a PWA
- Data persists locally in the browser

## License

Copyright (c) 2025 Artur Charyło. All rights reserved.

> This code is published publicly for demonstration and portfolio purposes only.
> You are NOT permitted to copy, modify, distribute, or use this code in any software or product.
