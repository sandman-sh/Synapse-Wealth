<div align="center">

# ⚡ SYNAPSE WEALTH
### *Official Agentic Service Provider (ASP) for OKX.AI Genesis Hackathon*

[![OKX.AI Genesis Hackathon](https://img.shields.io/badge/OKX.AI-Genesis_Hackathon-00F0FF?style=for-the-badge&logo=okx&logoColor=white)](https://okx.ai)
[![Service Type](https://img.shields.io/badge/Service_Type-A2MCP_%26_A2A_ASP-7C3AED?style=for-the-badge)](http://localhost:3000/agent-card.json)
[![ERC-8004 Identity](https://img.shields.io/badge/ERC--8004-OKX_Agent_Identity-10B981?style=for-the-badge)](https://rpc.xlayer.tech)
[![x402 Micropayments](https://img.shields.io/badge/x402-Micropayments_Engine-F59E0B?style=for-the-badge)](http://localhost:3000/api/wealth-report)
[![AI Engine](https://img.shields.io/badge/AI_Engine-AURA_AI_(OpenRouter)-3B82F6?style=for-the-badge)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

<br />

```
   ████████  ██    ██ ███    ██  █████  ██████  ███████ ███████     █████  ██ 
   ██        ██    ██ ████   ██ ██   ██ ██   ██ ██      ██         ██   ██ ██ 
   ███████   ██    ██ ██ ██  ██ ███████ ██████  ███████ █████      ███████ ██ 
        ██    ██  ██  ██  ██ ██ ██   ██ ██           ██ ██         ██   ██ ██ 
   ███████     ████   ██   ████ ██   ██ ██      ███████ ███████    ██   ██ ██ 
```

**Next-Generation On-Chain Knowledge Graph Wealth Planner & AI Concierge**  
*Powered by OKX OnchainOS Skills, ERC-8004 Identity, x402 Payment Challenges & OpenRouter AI*

---

</div>

## 📖 Executive Summary

**Synapse Wealth** is a production-ready, fully compliant **Agentic Service Provider (ASP)** engineered for the **OKX.AI Ecosystem**. It dynamically transforms raw multi-chain wallet balances, staking positions, and yield opportunities into an **interactive living knowledge graph workspace**.

Autonomous AI agents and users can discover high-APY yield routes, conduct smart contract risk audits, execute portfolio rebalances via OKX DEX, and unlock pay-per-call AI financial reports protected by **x402 HTTP 402 micropayment challenges**.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       SYNAPSE WEALTH WEB WORKSPACE                             │
│       (React 18 + Vite + TypeScript + Glassmorphism Dark Void Workspace)        │
├─────────────────┬───────────────────────────────┬───────────────────────────────┤
│  Living Graph   │  AURA AI Concierge            │  OKX ASP Inspector &          │
│  Canvas (Nodes) │  (OpenRouter AI Engine)       │  x402 Payment Challenge       │
└─────────────────┴───────────────────────────────┴───────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    EXPRESS WEB & OKX ASP API SERVER (:3000)                     │
├─────────────────┬───────────────────────────────┬───────────────────────────────┤
│  GET / &        │  x402 Micropayment Engine     │  MCP Server (JSON-RPC 2.0 &   │
│  agent-card.json│  (0.25 USDT HTTP 402 Proof)   │  Stdio Interface)             │
└─────────────────┴───────────────────────────────┴───────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       OKX ONCHAINOS SKILLS INTEGRATION                          │
│   (okx-agentic-wallet, okx-dex-market, okx-defi, okx-agent-payments-protocol)   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 OKX ASP Registration & Manifest

Synapse Wealth exposes a machine-readable ASP manifest compliant with the OKX.AI protocol standard at `GET /` and `GET /agent-card.json`.

### How to Register Synapse Wealth on OKX.AI

1. **Install OKX Onchain OS Skills**:
   ```bash
   npx skills add okx/onchainos-skills --yes
   ```

2. **Authenticate Agent Wallet**:
   Prompt your agent on Onchain OS:
   > *"Log in to Agentic Wallet on Onchain OS with my email."*

3. **Submit ASP Registration**:
   Prompt your agent on Onchain OS:
   > **"Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS"**  
   > *Manifest Endpoint*: `http://localhost:3000/agent-card.json`

---

## 🔧 Model Context Protocol (MCP) Tools Registry

Synapse Wealth exposes **5 standardized MCP tools** via HTTP JSON-RPC 2.0 (`POST /api/mcp`) and stdio transport (`npm run mcp:start`):

| Tool Name | Description | Price (USDT) | Access Tier |
| :--- | :--- | :---: | :---: |
| `get_portfolio_graph` | Fetch knowledge graph payload for multi-chain wallet balances & protocols | **Free** | Public |
| `analyze_yield_routes` | Scan OKX DEX & cross-chain protocols for optimal liquid staking APY | **0.05 USDT** | Standard |
| `audit_asset_risk` | Smart contract security audit & portfolio concentration risk analysis | **0.05 USDT** | Standard |
| `execute_rebalance` | Construct trade execution routes for portfolio rebalancing via OKX DEX | **0.10 USDT** | Standard |
| `generate_wealth_report` | Comprehensive AI-audited financial summary & strategic yield blueprint | **0.25 USDT** | **x402 Required** |

---

## 💳 x402 Micropayment Engine

Accessing `/api/wealth-report` triggers an HTTP `402 Payment Required` challenge handshake:

* **Status Code**: `HTTP 402 Payment Required`
* **Response Headers**:
  * `X-Payment-Required: true`
  * `X-Payment-Amount: 0.25`
  * `X-Payment-Currency: USDT`
  * `X-Payment-Recipient: 0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321`
  * `X-Payment-Link: https://web3.okx.com/pay?recipient=0x9A74...f321&amount=0.25&currency=USDT&chain=xlayer`
* **Verification**: Transactions are validated on-chain via `ethers.JsonRpcProvider` against EVM receipts.

---

## 💻 Repository Setup & Quickstart Guide

### 1. Clone Repository
```bash
git clone https://github.com/sandman-sh/Synapse-Wealth.git
cd Synapse-Wealth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
# Server & OnchainOS Config
PORT=3000
RPC_URL=https://rpc.xlayer.tech
INVOICE_ADDRESS=0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321

# Personalized AI Chatbot Configuration
AI_BOT_NAME=AURA
AI_BOT_TITLE=Autonomous Onchain Wealth Advisor

# OpenRouter AI Credentials
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### 4. Run Backend & ASP Server
```bash
npm run server
```
* Express Server starts on `http://localhost:3000`.
* ASP Manifest available at `http://localhost:3000/agent-card.json`.

### 5. Run Frontend Web Workspace (Vite)
In a separate terminal window:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 6. Run Stdio MCP Server (For Claude / Cursor / OKX Agents)
```bash
npm run mcp:start
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS (PostCSS), Lucide Icons
* **Backend**: Express.js, `@modelcontextprotocol/sdk`, Ethers.js v6
* **AI Intelligence**: OpenRouter API (`openai/gpt-4o-mini`) + Built-in Fallback Engine
* **Protocol Standards**: OKX OnchainOS Skills, ERC-8004 Agent Identity, x402 Payment Spec

---

## 📄 License

Distributed under the **MIT License**. Built for the **OKX.AI Genesis Hackathon**.
