"use client";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/dashboard/transactions/TransactionForm";
import { getMyPortfolios } from "@/lib/api/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  const [portfolio, setPortfolio] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const portfolios = await getMyPortfolios();
        setPortfolio(portfolios[0]);
      } catch (error) {
        console.error("Portföy alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  if (!portfolio) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Portföy bulunamadı</CardTitle>
        </CardHeader>
        <CardContent>Lütfen önce bir portföy oluşturun.</CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">İşlem Ekle</h1>
      <TransactionForm
        portfolioId={portfolio.id}
        portfolioName={portfolio.name}
      />
    </div>
  );
}
