import { AgentCardManifest } from '../src/types/index.js';

export function getAgentCardManifest(): AgentCardManifest {
  return {
    name: "Synapse Wealth",
    version: "1.0.0",
    service_type: "A2MCP",
    description: "On-Chain Knowledge Graph Wealth Planner & AI Portfolio Concierge built for OKX.AI (Powered by OnchainOS)",
    onchain_identity: {
      protocol: "ERC-8004 OKX Agent Identity",
      chain_id: 196, // X Layer Mainnet / Sepolia 11155111
      address: "0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321"
    },
    capabilities: {
      mcp_tools: [
        "get_portfolio_graph",
        "analyze_yield_routes",
        "audit_asset_risk",
        "execute_rebalance",
        "generate_wealth_report"
      ],
      x402_payments: true,
      onchainos_skills: [
        "okx-wallet-portfolio",
        "okx-dex-swap",
        "okx-cex-market",
        "okx-agent-payments-protocol"
      ]
    },
    tools: [
      {
        name: "get_portfolio_graph",
        description: "Fetches multi-chain wallet balances, protocol holdings, and risk nodes formatted as a living knowledge graph payload.",
        price_usdt: 0.00
      },
      {
        name: "analyze_yield_routes",
        description: "Scans OKX DEX and cross-chain liquid staking protocols to generate high-yield APY strategies.",
        price_usdt: 0.05
      },
      {
        name: "audit_asset_risk",
        description: "Evaluates smart contract security scores, concentration vulnerabilities, and unverified pools.",
        price_usdt: 0.05
      },
      {
        name: "execute_rebalance",
        description: "Constructs optimal trade execution routes for portfolio rebalancing.",
        price_usdt: 0.10
      },
      {
        name: "generate_wealth_report",
        description: "Produces a comprehensive, AI-audited financial summary and yield strategy map (x402 Micropayment required).",
        price_usdt: 0.25
      }
    ],
    registration_cli: "Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS"
  };
}
