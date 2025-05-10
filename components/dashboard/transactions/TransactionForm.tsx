"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAssetsByPortfolioId } from "@/lib/api/assets";
import { getMyPortfolios } from "@/lib/api/portfolio";
import { createTransaction } from "@/lib/api/transactions";
import { TransactionHistoryModal } from "./TransactionHistoryModal";

type Portfolio = {
  id: string;
  name: string;
};

type Asset = {
  id: number;
  name: string;
};

export default function TransactionForm() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState({
    type: "buy",
    amount: "",
    unitPrice: "",
    currency: "USD",
    exchangeRate: "",
    transactionDate: "",
    note: "",
    platform: "",
    fee: "",
    assetId: "",
  });

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await getMyPortfolios();
        setPortfolios(res || []);
      } catch (err) {
        console.error("Portföyler alınamadı", err);
      }
    }
    fetchPortfolios();
  }, []);

  useEffect(() => {
    async function fetchAssets() {
      if (!selectedPortfolio) return;
      try {
        const res = await getAssetsByPortfolioId(Number(selectedPortfolio.id));
        setAssets(res || []);
      } catch (err) {
        console.error("Varlıklar alınamadı", err);
      }
    }
    fetchAssets();
  }, [selectedPortfolio]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const totalPrice = Number(form.amount) * Number(form.unitPrice);
      const totalPriceTry = totalPrice * Number(form.exchangeRate);

      await createTransaction({
        ...form,
        portfolioId: selectedPortfolio?.id,
        amount: Number(form.amount),
        unitPrice: Number(form.unitPrice),
        exchangeRate: Number(form.exchangeRate),
        fee: Number(form.fee),
        totalPrice,
        totalPriceTry,
      });

      toast.success("İşlem başarıyla eklendi!");
      setForm((prev) => ({
        ...prev,
        amount: "",
        unitPrice: "",
        fee: "",
        note: "",
      }));
    } catch (error) {
      toast.error("İşlem eklenemedi!");
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-xl shadow-lg bg-background">
      <h2 className="text-xl font-bold">İşlem Ekle</h2>

      {/* Portföy seçimi */}
      <div>
        <Label>Portföy Seçin</Label>
        <Select
          onValueChange={(val) => {
            const found = portfolios.find((p) => p.id === val);
            setSelectedPortfolio(found || null);
            setForm((prev) => ({ ...prev, assetId: "" }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Portföy seçin" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Eğer seçili portföy varsa diğer alanları göster */}
      {selectedPortfolio && (
        <>
          {form.assetId && (
            <div className="flex justify-end mt-2">
              <TransactionHistoryModal
                assetId={parseInt(form.assetId)}
                assetName={
                  assets.find((a) => String(a.id) === form.assetId)?.name ||
                  "Seçilen varlık"
                }
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset Seçimi */}
            <div>
              <Label>Varlık</Label>
              <Select onValueChange={(val) => handleChange("assetId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Varlık seçin" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>İşlem Türü</Label>
              <Select
                value={form.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Alım</SelectItem>
                  <SelectItem value="sell">Satım</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Miktar</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>

            <div>
              <Label>Birim Fiyat</Label>
              <Input
                type="number"
                value={form.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
              />
            </div>

            <div>
              <Label>Para Birimi</Label>
              <Select
                value={form.currency}
                onValueChange={(val) => handleChange("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">TRY</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Kur (→ TRY)</Label>
              <Input
                type="number"
                value={form.exchangeRate}
                onChange={(e) => handleChange("exchangeRate", e.target.value)}
              />
            </div>

            <div>
              <Label>İşlem Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.transactionDate}
                onChange={(e) =>
                  handleChange("transactionDate", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Platform</Label>
              <Input
                value={form.platform}
                onChange={(e) => handleChange("platform", e.target.value)}
              />
            </div>

            <div>
              <Label>İşlem Ücreti</Label>
              <Input
                type="number"
                value={form.fee}
                onChange={(e) => handleChange("fee", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Not</Label>
            <Textarea
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            İşlemi Kaydet
          </Button>
        </>
      )}
    </div>
  );
}
