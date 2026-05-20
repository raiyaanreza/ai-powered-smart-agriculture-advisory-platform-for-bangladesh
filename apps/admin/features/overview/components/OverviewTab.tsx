"use client";
import { Users, Activity, Zap, Bell, FileJson, TrendingUp, MapPin, AlertTriangle, CheckCircle, Clock, Eye, Download, RefreshCw, Filter, Calendar } from "lucide-react";
import { MetricCard } from "./MetricCard";
import dynamic from "next/dynamic";
import { useState } from "react";

const OutbreakMap = dynamic(() => import("@/features/admin/components/OutbreakMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-80 w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-xs font-medium text-slate-400">Initializing GIS Intelligence...</div>
    </div>
  )
});

interface OverviewTabProps {
  metrics: {
    totalUsers: number;
    diagnosesCount: number;
    accuracy: number;
    activeAlerts: number;
  };
}

const recentActivity = [
  { id: 1, type: "diagnosis", message: "Brown Spot detected in Rajshahi", time: "2 min ago", severity: "high" },
  { id: 2, type: "verification", message: "Farmer ID #4821 approved", time: "8 min ago", severity: "info" },
  { id: 3, type: "alert", message: "Blast disease advisory issued for Sylhet", time: "15 min ago", severity: "warning" },
  { id: 4, type: "diagnosis", message: "Healthy crop confirmed in Dhaka", time: "22 min ago", severity: "success" },
  { id: 5, type: "system", message: "Model retrained with 1,240 new samples", time: "1 hr ago", severity: "info" },
];

const districtSummary = [
  { name: "Rajshahi", cases: 142, trend: "+12%" },
  { name: "Dhaka", cases: 98, trend: "-3%" },
  { name: "Sylhet", cases: 87, trend: "+8%" },
  { name: "Chittagong", cases: 76, trend: "+5%" },
  { name: "Khulna", cases: 54, trend: "-1%" },
];

export function OverviewTab({ metrics }: OverviewTabProps) {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">System Online</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">National Agricultural Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitoring 64 districts · {metrics.totalUsers.toLocaleString()} active nodes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateRange === range ? "bg-[#052E16] text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button className="h-8 px-3 rounded-lg bg-[#052E16] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#064E3B] transition-colors">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Metric Cards - Compact Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total User Base</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+8.2%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.diagnosesCount.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total Diagnoses</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.accuracy}%</div>
          <div className="text-xs text-slate-500 mt-0.5">AI Model Confidence</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{metrics.activeAlerts} Active</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.activeAlerts}</div>
          <div className="text-xs text-slate-500 mt-0.5">Active National Alerts</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Outbreak Visualization</h3>
              <p className="text-xs text-slate-500">Geospatial Intelligence Engine</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                <Filter className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <OutbreakMap />
          </div>
        </div>

        {/* Right Column - Activity Feed + District Summary */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              <button className="text-xs text-[#052E16] font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <div key={item.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      item.severity === "high" ? "bg-red-500" :
                      item.severity === "warning" ? "bg-amber-500" :
                      item.severity === "success" ? "bg-emerald-500" :
                      "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{item.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Summary */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">District Summary</h3>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="divide-y divide-slate-100">
              {districtSummary.map((district, idx) => (
                <div key={district.name} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400 w-4">{idx + 1}</span>
                    <span className="text-sm font-medium text-slate-700">{district.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">{district.cases}</span>
                    <span className={`text-xs font-medium ${district.trend.startsWith("+") ? "text-red-600" : "text-emerald-600"}`}>
                      {district.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Active Districts</span>
          </div>
          <div className="text-xl font-bold text-slate-900">64<span className="text-sm font-normal text-slate-400 ml-1">/ 64</span></div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#052E16] rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Verified Farmers</span>
          </div>
          <div className="text-xl font-bold text-slate-900">48.2K</div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
          </div>
          <div className="text-xl font-bold text-slate-900">127</div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "15%" }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Avg Response</span>
          </div>
          <div className="text-xl font-bold text-slate-900">0.8<span className="text-sm font-normal text-slate-400 ml-1">sec</span></div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
