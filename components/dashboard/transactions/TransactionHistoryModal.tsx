"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getTransactionsByAssetId } from "@/lib/api/transactions";

type Transaction = {
  id: number;
  type: "buy" | "sell";
  amount: number;
  unitPrice: number;
  currency: string;
  transactionDate: string;
  platform?: string;
  fee?: number;
  note?: string;
};

type Props = {
  assetId: number;
  assetName: string;
};

export function TransactionHistoryModal({ assetId, assetName }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getTransactionsByAssetId(assetId)
        .then(setTransactions)
        .catch(console.error);
    }
  }, [open, assetId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📜 Geçmiş İşlemler</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{assetName} – Geçmiş İşlemler</DialogTitle>
        </DialogHeader>

        {transactions.length === 0 ? (
          <p className="text-muted-foreground">Henüz işlem bulunmuyor.</p>
        ) : (
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tarih</th>
                  <th className="text-left p-2">Tür</th>
                  <th className="text-left p-2">Miktar</th>
                  <th className="text-left p-2">Birim Fiyat</th>
                  <th className="text-left p-2">Para Birimi</th>
                  <th className="text-left p-2">Platform</th>
                  <th className="text-left p-2">Not</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-muted">
                    <td className="p-2">
                      {new Date(tx.transactionDate).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-2">
                      {tx.type === "buy" ? "Alım" : "Satım"}
                    </td>
                    <td className="p-2">{tx.amount}</td>
                    <td className="p-2">{tx.unitPrice}</td>
                    <td className="p-2">{tx.currency}</td>
                    <td className="p-2">{tx.platform || "-"}</td>
                    <td className="p-2">{tx.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
