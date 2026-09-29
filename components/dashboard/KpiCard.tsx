"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({ icon: Icon, value, label, trend, trendUp }: KpiCardProps) {
  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-labal-lime/10 flex items-center justify-center group-hover:bg-labal-lime/20 transition-colors">
          <Icon className="w-5 h-5 text-labal-lime" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "text-labal-lime bg-labal-lime/10"
                : "text-red-500 bg-red-50"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="kpi-value animate-count-up">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  children: ReactNode;
}

export function StatCard({ title, children }: StatCardProps) {
  return (
    <div className="bg-white border border-labal-gray-medium rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-labal-deep mb-4 flex items-center gap-2">
        {title}
        <div className="h-0.5 flex-1 bg-labal-lime/30 rounded-full" />
      </h3>
      {children}
    </div>
  );
}
