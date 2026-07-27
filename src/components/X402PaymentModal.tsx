import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface X402PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  isUnlocked: boolean;
}

export const X402PaymentModal: React.FC<X402PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  isUnlocked
}) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [txHash, setTxHash] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setLoading(true);
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    try {
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: mockHash })
      });
      await verifyRes.json();

      const reportRes = await fetch('/api/wealth-report?paid=true');
      const data = await reportRes.json();
      setReportData(data.report);
      setTxHash(mockHash);
      onPaymentSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b101d] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">x402 MICROPAYMENT HANDSHAKE</h2>
              <span className="text-xs text-amber-400 font-mono-num">HTTP 402 Payment Challenge • 0.25 USDT / OKB</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        {isUnlocked && reportData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>x402 Micropayment Verified! Transaction Hash: {txHash.substring(0, 10)}...</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono-num text-xs">
              <h3 className="font-heading text-sm font-bold text-white">{reportData.title}</h3>
              <p className="text-slate-300">{reportData.summary}</p>
              
              <div className="pt-2">
                <span className="font-bold text-cyan-400 block mb-1">Recommended Action Plan:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 font-sans">
                  {reportData.actionableSteps?.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Endpoint Required</span>
                <span className="font-mono-num text-amber-300">GET /api/wealth-report</span>
              </div>
              <p>
                Accessing the deep-dive AI Wealth Audit Report triggers an HTTP 402 challenge. Pay 0.25 USDT to unlock full liquid restaking yield maps.
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[11px] font-mono-num">
                <span>Invoice Address:</span>
                <span className="text-cyan-300">0x9A74...f321</span>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
            >
              {loading ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>{loading ? 'Verifying x402 On-Chain Proof...' : 'Pay 0.25 USDT & Unlock Report'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
