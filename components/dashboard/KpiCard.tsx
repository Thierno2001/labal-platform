"use client";

import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({ icon: Icon, value, label, trend, trendUp }: KpiCardProps) {
  return (
    <div className="glass-card card-hover rounded-2xl p-5 relative overflow-hidden group">
      {/* Decorative background gradient glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-labal-lime/10 rounded-full blur-2xl group-hover:bg-labal-lime/20 transition-all duration-300" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-labal-lime/20 to-labal-lime/5 flex items-center justify-center border border-labal-lime/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-labal-deep" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${
              trendUp
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-amber-700 bg-amber-50 border-amber-200"
            }`}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-3xl font-black text-labal-deep tracking-tight group-hover:text-labal-lime transition-colors">
          {value}
        </div>
        <div className="text-xs font-bold text-labal-gray-dark uppercase tracking-wider mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export function StatCard({ title, subtitle, children }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 relative">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-labal-deep tracking-tight flex items-center gap-2">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs text-labal-gray-dark mt-0.5 font-medium">{subtitle}</p>
        )}
        <div className="mt-2.5 h-0.5 w-full bg-gradient-to-r from-labal-lime/40 via-labal-deep/10 to-transparent rounded-full" />
      </div>
      <div>{children}</div>
    </div>
  );
}
