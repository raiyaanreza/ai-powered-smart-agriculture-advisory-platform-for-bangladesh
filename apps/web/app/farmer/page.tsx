"use client";
import dynamic from "next/dynamic";

const FarmerDashboard = dynamic(
  () => import("@/features/dashboard/components/FarmerDashboard").then((mod) => ({ default: mod.FarmerDashboard })),
  { loading: () => <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center"><div className="h-64 w-64 rounded-3xl bg-slate-100 animate-pulse" /></div> }
);

export default function FarmerDashboardPage() {
  return <FarmerDashboard />;
}
