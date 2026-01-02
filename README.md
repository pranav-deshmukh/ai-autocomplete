# AI Autocomplete for VS Code

A free, self-hosted AI-powered code completion extension using DeepSeek-Coder running on Google Colab.

![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-brightgreen.svg)

## Features

- **Free & Open Source** - No API keys or subscriptions required
- **Self-Hosted** - Runs on Google Colab's free tier
- **Smart Caching** - Instant completions for incremental typing
- **Debounced Requests** - Efficient API usage with 500ms debounce
- **Multi-Language Support** - Works with JavaScript, Python, TypeScript, and more
- **Context-Aware** - Uses code before and after cursor for better suggestions

---

## 💡 Why Use This?

### **Completely Free Alternative to Paid Services**

Commercial AI coding assistants cost money:

- **GitHub Copilot**: $10-19/month
- **Cursor**: $20/month
- **Tabnine**: $12-39/month

**This project? $0 forever** ✨

### **How It Stays Free**

- **Google Colab** provides free GPU (T4) with generous limits
- **ngrok** offers free tunneling for development
- **DeepSeek-Coder** is open-source and high-quality
- No hidden costs or API keys needed

### **Perfect For**

- Students learning to code
- Developers experimenting with AI
- Open-source contributors
- Anyone wanting to understand how AI autocomplete works under the hood

### **Trade-offs**

While paid services like GitHub Copilot or Cursor are faster and more polished, this gives you:

- Complete control over your code and data
- Understanding of the technology
- No vendor lock-in
- Ability to customize and improve
- **Zero cost forever**

**Bottom line:** Slightly slower (2-5s vs 0.5s), but free and educational!

---

## 🆚 Comparison

| Feature            | This Project | GitHub Copilot | Cursor       |
| ------------------ | ------------ | -------------- | ------------ |
| **Cost**           | Free forever | $10-19/month   | $20/month    |
| **Speed**          | 2-5 seconds  | <0.5 seconds   | <0.5 seconds |
| **Privacy**        | Self-hosted  | Cloud          | Cloud        |
| **Customizable**   | Yes          | No             | Limited      |
| **Setup Time**     | 15 minutes   | 2 minutes      | 2 minutes    |
| **Learning Value** | High         | None           | None         |

---

## Prerequisites

- **VS Code** 1.80 or higher
- **Google Account** (for Colab)
- **ngrok Account** (free tier) - [Sign up here](https://dashboard.ngrok.com/signup) - **Required for tunneling**
- **Node.js** 16+ and npm/pnpm

---

## What's Included

```
ai-autocomplete/
├── ai_autocomplete_server.ipynb  # Colab notebook (backend)
├── src/
│   ├── extension.ts              # VS Code extension entry
│   ├── completionProvider.ts     # Completion logic + caching
│   └── apiClient.ts             # API communication
├── package.json                 # Extension config
├── tsconfig.json                # TypeScript config
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Part 1: Setup the Backend (Google Colab)

#### Step 1: Open the Notebook

1. Download `ai_autocomplete_server.ipynb` from this repo
2. Upload to [Google Colab](https://colab.research.google.com)
3. **Set runtime to GPU**: Runtime → Change runtime type → **T4 GPU** → Save

#### Step 2: Configure ngrok Token

**⚠️ IMPORTANT: Never hardcode tokens in the notebook!**

1. Get your token from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. In Colab: Click 🔑 **Secrets** icon in left sidebar
3. Add secret:
   - Name: `NGROK_AUTH_TOKEN`
   - Value: `your_token_here`
4. Toggle **"Notebook access"** ON

#### Step 3: Run All Cells

1. Click **Runtime** → **Run all**
2. Wait 2-3 minutes for model to load
3. **Copy the ngrok URL** from the output (looks like: `https://xxxx-xxx.ngrok-free.dev`)

**✅ Backend is ready!** Keep this Colab tab open.

> **Note:** Colab sessions disconnect after ~1 hour of inactivity. Just re-run all cells to restart (takes 2-3 min).

---

### Part 2: Setup VS Code Extension

#### Step 1: Clone & Install

```bash
git clone https://github.com/pranav-deshmukh/ai-autocomplete.git
cd ai-autocomplete
npm install  # or pnpm install
```

#### Step 2: Configure API URL

1. Open `src/apiClient.ts`
2. Replace the URL with your ngrok URL from Colab:

```typescript
const API_URL = "https://your-actual-ngrok-url.ngrok-free.dev/complete";
```

**Example:** If Colab showed `https://abc-123-def.ngrok-free.dev`, use:

```typescript
const API_URL = "https://abc-123-def.ngrok-free.dev/complete";
```

#### Step 3: Build Extension

```bash
npm run compile
```

#### Step 4: Test in Debug Mode

1. Open project in VS Code
2. Press **F5** to launch Extension Development Host
3. Create a test file (`test.js`)
4. Start typing code
5. Wait 500ms - you should see gray inline suggestions!

#### Step 5: Package & Install (Optional)

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension ai-autocomplete-0.0.1.vsix
```

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│   VS Code       │  HTTPS  │    ngrok     │  HTTP   │  Google Colab   │
│   Extension     │────────▶│    Tunnel    │────────▶│   Flask API     │
│  (TypeScript)   │◀────────│  (Temporary) │◀────────│  DeepSeek Model │
└─────────────────┘         └──────────────┘         └─────────────────┘
```

### How It Works

1. **User types code** in VS Code
2. **Extension waits 500ms** (debounce)
3. **Checks cache** - if similar code was just completed, returns instantly
4. **Sends request** to ngrok URL with code prefix
5. **Flask receives request** on Colab
6. **DeepSeek model generates** completion (1-3 seconds)
7. **Response sent back** through ngrok
8. **VS Code displays** gray inline suggestion
9. **User presses Tab** to accept

---

## ⚙️ Configuration

### Completion Provider (`src/completionProvider.ts`)

- **Debounce:** `500ms` - wait time after typing stops
- **Context Window:** `1000 chars` - code sent before cursor
- **Cache:** Enabled - reuses completions for similar contexts

### Flask Server

- **Max Tokens:** `30` - maximum completion length
- **Temperature:** `0.2` - balance between creative/deterministic
- **Sampling:** `True` - allows variety in completions

---

## 🔧 Troubleshooting

### Extension Not Showing Completions

1. **Check Debug Console** (Ctrl+Shift+Y) for errors
2. **Verify API URL** is correct in `apiClient.ts`
3. **Test backend** with curl:
   ```bash
   curl -X POST https://your-url.ngrok-free.dev/complete \
     -H "Content-Type: application/json" \
     -d '{"prefix": "function test() {"}'
   ```

### Colab Session Disconnected

- Free Colab disconnects after ~1 hour of inactivity
- **Solution:** Re-run all cells (takes 2-3 min)
- Your ngrok URL will change - update `apiClient.ts`

### Slow Completions

- **Expected:** 2-5 seconds on free T4 GPU
- **Reduce context:** Lower `1000` to `500` in completionProvider
- **Use smaller model:** Switch to `deepseek-coder-1.3b-instruct` (3x faster)

### Model Generating Garbage

- **Increase temperature:** Try `0.3` or `0.4`
- **Adjust max_tokens:** Try `50` instead of `30`
- **Check prefix length:** Ensure enough context is sent

---

## Performance

| Metric                | Value                  |
| --------------------- | ---------------------- |
| **First Completion**  | 2-5 seconds            |
| **Cached Completion** | <10ms (instant)        |
| **Model Loading**     | 2-3 minutes (one-time) |
| **Context Window**    | ~8k tokens             |
| **GPU Memory**        | ~4GB (quantized)       |

---

## 🛠️ Development

### Project Structure

```
ai-autocomplete/
├── src/
│   ├── extension.ts           # Main entry point
│   ├── completionProvider.ts  # Completion logic + caching
│   └── apiClient.ts          # API communication
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript config
└── README.md               # This file
```

### Building

```bash
npm run compile        # Compile TypeScript
npm run watch         # Watch mode for development
```

### Testing

```bash
npm test              # Run tests (if any)
```

---

## 🔐 Security Notes

- ⚠️ **Never commit ngrok tokens** to git
- ✅ Use environment variables or VS Code secrets
- ✅ Add `.env` and tokens to `.gitignore`
- ⚠️ ngrok URLs are public - anyone can access them
- ✅ For production, use proper authentication

---

## 🚧 Limitations

- ❌ Slower than commercial products (Copilot, Cursor)
- ❌ Colab sessions timeout after inactivity
- ❌ ngrok URL changes on restart
- ❌ Free tier rate limits
- ✅ Great for learning and personal use

---

## 🎯 Future Improvements

- [ ] Deploy to HuggingFace Spaces (persistent URL)
- [ ] Add streaming completions
- [ ] Multi-line completions
- [ ] Configuration UI in VS Code
- [ ] Support more models (Qwen, CodeLlama)
- [ ] Local model support

---

## 📄 License

No license yet - all rights reserved. Feel free to use for personal/educational purposes.

---

## 🙏 Acknowledgments

- **DeepSeek** - For the excellent open-source code model
- **Google Colab** - For providing free GPU access
- **ngrok** - For easy and free tunneling
- **VS Code Team** - For the powerful extension API

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Support

- **Issues:** [GitHub Issues](https://github.com/pranav-deshmukh/ai-autocomplete/issues)

---

## Disclaimer

This project is intended for learning and experimentation.
It is not production-ready and lacks authentication, rate limiting,
and persistent infrastructure.

**⭐ Star this repo if you find it useful!**
