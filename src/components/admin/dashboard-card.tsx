import Link from "next/link";
import { type ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
  linkHref?: string;
  linkText?: string;
}

export function DashboardCard({
  title,
  value,
  icon,
  description,
  linkHref,
  linkText,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {linkHref && linkText && (
        <Link 
          href={linkHref} 
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
