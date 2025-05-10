"use client";

import dynamic from "next/dynamic";

const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((mod) => mod.ResponsivePie),
  { ssr: false }
);

export default function AllPortfoliosPie({ data }: { data: any[] }) {
  if (!data.length) return <p>Varlık yok</p>;

  return (
    <ResponsivePie
      data={data.map((a) => ({
        id: a.symbol,
        label: a.symbol,
        value: Number((a.amount * a.buyPrice).toFixed(2)),
      }))}
      margin={{ top: 30, right: 80, bottom: 40, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#999"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      tooltip={({ datum }) => (
        <div
          style={{
            background: "#1f1f1f",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            fontSize: "0.875rem",
          }}
        >
          {datum.label}:{" "}
          {datum.value.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </div>
      )}
    />
  );
}
