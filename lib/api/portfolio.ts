import { fetchWithAuth } from "@/lib/fetchWithAuth";

const BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolios`;

export async function getMyPortfolios() {
  const res = await fetchWithAuth(BASE);
  if (!res.ok) throw new Error("Portföyler alınamadı");
  return res.json();
}
