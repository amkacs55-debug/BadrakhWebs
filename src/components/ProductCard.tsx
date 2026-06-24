"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";

export type Product = {
  id: number;
  title: string;
  gameId: string;
  category: "account" | "topup" | "rent";
  status: "available" | "sold" | "rented";
  tags: string[];
  basePrice: number;
  messengerLink: string;
  imageUrls: string[];
  rent1h: number | null;
  rent12h: number | null;
  rent24h: number | null;
};

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const statusConfig = {
  available: {
    label: "Бэлэн байгаа",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  sold: {
    label: "Зарагдсан",
    bg: "bg-slate-600/15",
    border: "border-slate-600/30",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
  rented: {
    label: "Түрээслэгдсэн",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
};

const categoryLabels: Record<string, string> = {
  account: "Аккаунт",
  topup: "Цэнэглэлт",
  rent: "Түрээс",
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const status = statusConfig[product.status];
  const firstImage = product.imageUrls?.[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price);
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-slate-700/80 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
        {firstImage && !imgError ? (
          <Image
            src={firstImage}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Eye className="w-8 h-8 text-slate-600" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-slate-300">
            {categoryLabels[product.category]}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${status.bg} ${status.border} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">ID: {product.gameId}</p>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {formatPrice(product.basePrice)}
            </span>
            <span className="text-xs text-slate-500 font-medium">₮</span>
          </div>
        </div>
      </div>
    </div>
  );
}
