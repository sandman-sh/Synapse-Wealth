export type NodeType = 'wallet' | 'asset' | 'protocol' | 'risk' | 'yield';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number; // Value in USD or relative size
  chain?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  apy?: number;
  details?: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'holding' | 'staking' | 'risk_flag' | 'yield_route';
  value?: number;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  chain: string;
  change24h: number;
  icon: string;
}

export interface YieldOpportunity {
  id: string;
  protocol: string;
  chain: string;
  asset: string;
  apy: number;
  tvlUsd: number;
  riskScore: 'Low' | 'Medium' | 'High';
  strategy: string;
  estimatedReturnUsd: number;
}

export interface RiskAuditAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  asset?: string;
  recommendation: string;
}

export interface McpToolCallPayload {
  tool: string;
  args: Record<string, any>;
  result?: any;
  timestamp: string;
}

export interface AgentCardManifest {
  name: string;
  version: string;
  service_type: 'A2MCP' | 'A2A';
  description: string;
  onchain_identity: {
    protocol: string;
    chain_id: number;
    address: string;
  };
  capabilities: {
    mcp_tools: string[];
    x402_payments: boolean;
    onchainos_skills: string[];
  };
  tools: {
    name: string;
    description: string;
    price_usdt: number;
  }[];
  registration_cli: string;
}

export interface X402Challenge {
  status: 402;
  message: string;
  price: string;
  currency: string;
  paymentLink: string;
  recipientAddress: string;
}
