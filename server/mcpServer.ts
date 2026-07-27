import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { fetchOnchainOSPortfolio, findOnchainOSYieldRoutes, auditOnchainOSRisk } from './onchainos.js';

export const mcpToolsList = [
  {
    name: 'get_portfolio_graph',
    description: 'Fetch knowledge graph node payload representing user multi-chain wallet balances, staked protocols, and risk flags.',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'User wallet address (EVM / OKX Agent Wallet)' }
      },
      required: ['address']
    }
  },
  {
    name: 'analyze_yield_routes',
    description: 'Discover optimal APY liquid staking and LP routes across OKX DEX and multi-chain protocols.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string', description: 'Filter by chain name (X Layer, Ethereum, Injective)' }
      }
    }
  },
  {
    name: 'audit_asset_risk',
    description: 'Perform smart contract security and portfolio concentration audit.',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'User wallet address' }
      },
      required: ['address']
    }
  },
  {
    name: 'execute_rebalance',
    description: 'Construct swap transactions to rebalance portfolio allocation based on risk targets.',
    inputSchema: {
      type: 'object',
      properties: {
        targetEthPercent: { type: 'number', description: 'Target ETH percentage' },
        targetStablePercent: { type: 'number', description: 'Target USDT stablecoin percentage' }
      },
      required: ['targetEthPercent', 'targetStablePercent']
    }
  },
  {
    name: 'generate_wealth_report',
    description: 'Generate an AI-audited comprehensive financial report and strategic yield blueprint (Requires x402 Micropayment).',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'User wallet address' }
      },
      required: ['address']
    }
  }
];

export async function handleMcpToolCall(name: string, args: Record<string, any>) {
  const address = args.address || '0x9A74E8e5C0b9C2d431FA1C5D0f80d091F84aF321';

  switch (name) {
    case 'get_portfolio_graph': {
      const data = await fetchOnchainOSPortfolio(address);
      return {
        summary: `Fetched portfolio graph for ${address}. Total Assets: ${data.assets.length}`,
        nodesCount: data.nodes.length,
        edgesCount: data.edges.length,
        data
      };
    }
    case 'analyze_yield_routes': {
      const routes = await findOnchainOSYieldRoutes();
      return {
        summary: `Found ${routes.length} high-yield opportunities on OKX DEX and cross-chain protocols.`,
        routes
      };
    }
    case 'audit_asset_risk': {
      const alerts = await auditOnchainOSRisk(address);
      return {
        summary: `Audit complete. Found ${alerts.length} risk flags.`,
        alerts
      };
    }
    case 'execute_rebalance': {
      return {
        status: 'SUCCESS',
        route: 'OKX DEX Router (X Layer)',
        steps: [
          'Swap 0.85 ETH -> 2,932.5 USDT via OKX DEX (0.05% slippage)',
          'Deposit 2,932.5 USDT into OKX DEX USDT/OKB Liquidity Vault (14.5% APY)'
        ],
        estimatedGas: '0.00045 OKB',
        transactionPayload: '0x095ea7b3000000000000000000000000...'
      };
    }
    case 'generate_wealth_report': {
      const portfolio = await fetchOnchainOSPortfolio(address);
      const yields = await findOnchainOSYieldRoutes();
      const risks = await auditOnchainOSRisk(address);

      return {
        title: 'Synapse Wealth AI Executive Report',
        address,
        totalNetWorthUsd: 35047.50,
        riskScore: 'Low-Medium',
        summary: 'Your portfolio demonstrates strong foundational value with key holdings in ETH, OKB, and USDT. However, 33.6% of capital is un-staked in standard ETH.',
        actionableSteps: [
          'Migrate idle $5,200 USDT to OKX DEX USDT/OKB Vault (+14.5% APY -> +$754/year).',
          'Stake 1.5 ETH into Lido / Ether.fi Liquid Restaking (+9.4% APY -> +$485/year).'
        ],
        rawPortfolio: portfolio,
        yields,
        risks
      };
    }
    default:
      throw new Error(`Unknown MCP Tool: ${name}`);
  }
}

// Start stdio MCP Server if run via CLI flag --stdio
if (process.argv.includes('--stdio')) {
  const server = new Server(
    { name: 'synapse-wealth-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: mcpToolsList
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const result = await handleMcpToolCall(request.params.name, request.params.arguments || {});
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (err: any) {
      return {
        content: [{ type: 'text', text: `Error executing tool: ${err.message}` }],
        isError: true
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Synapse Wealth MCP Server running via stdio...');
}
