import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAgentCardManifest } from './agentCard.js';
import { fetchOnchainOSPortfolio, findOnchainOSYieldRoutes, auditOnchainOSRisk } from './onchainos.js';
import { mcpToolsList, handleMcpToolCall } from './mcpServer.js';
import { x402PaymentMiddleware, registerPaymentProof } from './x402.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. OKX ASP Manifest Endpoints
app.get('/', (req, res) => {
  res.json(getAgentCardManifest());
});

app.get('/agent-card.json', (req, res) => {
  res.json(getAgentCardManifest());
});

// 2. Portfolio, Yield, and Risk Data Endpoints
app.get('/api/portfolio', async (req, res) => {
  const address = (req.query.address as string) || '0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321';
  const data = await fetchOnchainOSPortfolio(address);
  res.json(data);
});

app.get('/api/yields', async (req, res) => {
  const yields = await findOnchainOSYieldRoutes();
  res.json(yields);
});

app.get('/api/risks', async (req, res) => {
  const address = (req.query.address as string) || '0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321';
  const alerts = await auditOnchainOSRisk(address);
  res.json(alerts);
});

// 3. MCP JSON-RPC 2.0 Router
app.get('/api/mcp/tools', (req, res) => {
  res.json({ tools: mcpToolsList });
});

app.post('/api/mcp', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      result: { tools: mcpToolsList },
      id
    });
  }

  if (method === 'tools/call') {
    try {
      const { name, arguments: toolArgs } = params;
      const result = await handleMcpToolCall(name, toolArgs || {});
      return res.json({
        jsonrpc: '2.0',
        result,
        id
      });
    } catch (err: any) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: err.message },
        id
      });
    }
  }

  res.status(400).json({
    jsonrpc: '2.0',
    error: { code: -32601, message: 'Method not found' },
    id
  });
});

// 4. x402 Protected Premium Endpoint
app.get('/api/wealth-report', x402PaymentMiddleware, async (req, res) => {
  const address = (req.query.address as string) || '0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321';
  const report = await handleMcpToolCall('generate_wealth_report', { address });
  res.json({
    status: 'SUCCESS',
    unlockedBy: 'x402 Micropayment (0.25 USDT verified)',
    report
  });
});

app.post('/api/verify-payment', async (req, res) => {
  const { hash } = req.body;
  const success = await registerPaymentProof(hash);
  if (success) {
    res.json({ status: 'VERIFIED', hash, message: 'Payment verified. Premium x402 endpoints unlocked.' });
  } else {
    res.status(400).json({ status: 'FAILED', message: 'Invalid payment hash provided.' });
  }
});

// 5. AI Chat Concierge Endpoint with Gemini Fallback
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  const systemPrompt = `You are Synapse Wealth AI — the official OKX.AI Agentic Service Provider (ASP) Concierge.
You assist users with multi-chain portfolio wealth planning, yield strategy discovery, x402 payments, and registering ASPs on OKX.AI using OKX Agent Identity from Onchain OS.
Keep responses concise, informative, professional, and formatted in Markdown. Include actionable steps.`;

  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  if (openrouterApiKey) {
    try {
      const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Synapse Wealth OKX ASP'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        })
      });

      if (openRouterRes.ok) {
        const json = await openRouterRes.json();
        const replyText = json.choices?.[0]?.message?.content;
        if (replyText) {
          return res.json({ reply: replyText });
        }
      } else {
        const errText = await openRouterRes.text();
        console.warn('OpenRouter API non-200 response:', errText);
      }
    } catch (err: any) {
      console.warn('OpenRouter API call failed, using fallback:', err.message);
    }
  }



  // Intelligent Fallback Logic
  const lowerMsg = (message || '').toLowerCase();
  let reply = '';

  if (lowerMsg.includes('register') || lowerMsg.includes('asp') || lowerMsg.includes('okx')) {
    reply = `### 🤖 Registering Synapse Wealth on OKX.AI
To register this Agentic Service Provider (ASP) on OKX.AI:

1. **Install Onchain OS Skills**:
   \`\`\`bash
   npx skills add okx/onchainos-skills --yes -g
   \`\`\`
2. **Authenticate Agent Wallet**:
   Prompt your agent: *"Log in to Agentic Wallet on Onchain OS with my email."*
3. **Submit Registration**:
   Prompt your agent:
   > **"Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS"**

You can inspect our live manifest anytime at [\`/agent-card.json\`](http://localhost:3000/agent-card.json).`;
  } else if (lowerMsg.includes('yield') || lowerMsg.includes('apy') || lowerMsg.includes('strategy')) {
    reply = `### ⚡ Top Yield Strategies (OnchainOS Verified)

1. **OKX DEX Liquidity Hub (X Layer)**:
   - **Asset**: USDT / OKB LP
   - **APY**: 14.5%
   - **Est. Annual Return**: +$754.00 on $5.2k deposit

2. **Injective Hydro Protocol**:
   - **Asset**: hINJ Liquid Staking
   - **APY**: 16.2%
   - **Est. Annual Return**: +$775.60 on $4.7k deposit

*Click "Execute Rebalance" in your dashboard to execute via OKX DEX.*`;
  } else if (lowerMsg.includes('x402') || lowerMsg.includes('pay') || lowerMsg.includes('report')) {
    reply = `### 💳 x402 Micropayment Status
Our premium **AI Wealth Audit Report** requires a **0.25 USDT** HTTP 402 payment challenge. 

- **Endpoint**: \`GET /api/wealth-report\`
- **Recipient**: \`0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321\`
- **Status**: Click the **"Unlock x402 Report"** button in the header or dashboard to simulate/execute the payment!`;
  } else {
    reply = `### ⚡ Synapse Wealth Overview
I have analyzed your multi-chain portfolio:

- **Total Net Worth**: **$35,047.50**
- **Assets Tracked**: ETH, OKB, USDT, INJ, stETH
- **Risk Score**: Low-Medium (33.6% in un-staked ETH)

**Recommended Action**: Move $5,200 idle USDT into the OKX DEX USDT/OKB vault to earn an extra 14.5% APY.`;
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ Synapse Wealth OKX ASP Server running on port ${PORT}`);
  console.log(`📄 OKX ASP Manifest: http://localhost:${PORT}/agent-card.json`);
  console.log(`🔧 MCP RPC Endpoint: http://localhost:${PORT}/api/mcp`);
  console.log(`💳 x402 Protected API: http://localhost:${PORT}/api/wealth-report`);
  console.log(`=======================================================`);
});
