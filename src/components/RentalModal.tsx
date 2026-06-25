"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Clock,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "./ProductCard";

interface RentalModalProps {
  product: Product | null;
  onClose: () => void;
}

const statusConfig = {
  available: {
    label: "Бэлэн байгаа",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  sold: {
    label: "Зарагдсан",
    bg: "bg-slate-600/15",
    border: "border-slate-600/30",
    text: "text-slate-400",
  },
  rented: {
    label: "Түрээслэгдсэн",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
  },
};

export default function RentalModal({ product, onClose }: RentalModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<"1h" | "12h" | "24h" | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedDuration(null);
      setCurrentImageIndex(0);
      setCopied(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const status = statusConfig[product.status];
  const images = product.imageUrls || [];

  const allDurations: { key: "1h" | "12h" | "24h"; label: string; price: number | null }[] = [
    { key: "1h", label: "1 цаг", price: product.rent1h },
    { key: "12h", label: "12 цаг", price: product.rent12h },
    { key: "24h", label: "24 цаг", price: product.rent24h },
  ];
  const durations = allDurations.filter((d): d is typeof allDurations[number] & { price: number } => d.price !== null && d.price !== undefined);

  const finalPrice = selectedDuration
    ? durations.find((d) => d.key === selectedDuration)?.price ?? product.basePrice
    : product.basePrice;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(product.gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = product.gameId;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuy = () => {
    window.open(product.messengerLink, "_blank", "noopener,noreferrer");
  };

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = 280;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < images.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0B1221] border-t border-slate-700/50 rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-700/60" />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Header */}
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-slate-100 leading-tight">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500 font-mono">ID: {product.gameId}</span>
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/15 border border-blue-500/25 text-blue-400 hover:bg-blue-600/25 transition-all duration-200 text-[11px] font-medium"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Хуулсан
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            ID Хуулах
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all duration-200 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status */}
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border ${status.bg} ${status.border} ${status.text}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Main Image Gallery */}
              {images.length > 0 && (
                <div className="px-5 pb-4">
                  <div
                    className="relative w-full rounded-xl overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <img
                      src={images[currentImageIndex]}
                      alt={`${product.title} - ${currentImageIndex + 1}`}
                      className="w-full h-auto block rounded-xl"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((p) => Math.max(0, p - 1))}
                          disabled={currentImageIndex === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 backdrop-blur-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800/80 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((p) => Math.min(images.length - 1, p + 1))
                          }
                          disabled={currentImageIndex === images.length - 1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 backdrop-blur-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800/80 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-sm text-xs text-slate-300 font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="relative mt-3">
                      <div
                        ref={galleryRef}
                        className="flex gap-2 overflow-x-auto gallery-scroll pb-1"
                      >
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              idx === currentImageIndex
                                ? "border-blue-500 ring-1 ring-blue-500/30"
                                : "border-slate-700/50 hover:border-slate-600"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="px-5 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Price Engine */}
              {durations.length > 0 && (
                <div className="px-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Түрээсийн хугацаа</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {durations.map((dur) => (
                      <button
                        key={dur.key}
                        onClick={() => setSelectedDuration(dur.key)}
                        className={`relative p-3 rounded-xl border text-center transition-all duration-200 ${
                          selectedDuration === dur.key
                            ? "bg-blue-600/15 border-blue-500/40 shadow-lg shadow-blue-900/20"
                            : "bg-slate-800/40 border-slate-700/40 hover:border-slate-600/60"
                        }`}
                      >
                        <div className="text-xs text-slate-400 mb-1">{dur.label}</div>
                        <div
                          className={`text-sm font-bold ${
                            selectedDuration === dur.key ? "text-blue-300" : "text-slate-200"
                          }`}
                        >
                          {formatPrice(dur.price!)} ₮
                        </div>
                        {selectedDuration === dur.key && (
                          <motion.div
                            layoutId="duration-indicator"
                            className="absolute inset-0 rounded-xl border-2 border-blue-500/50"
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Price */}
              <div className="px-5 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={finalPrice}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/40"
                  >
                    <span className="text-sm text-slate-400">Нийт үнэ</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(finalPrice)}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">₮</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="shrink-0 p-5 border-t border-slate-800/60 bg-[#0B1221]">
              <button
                onClick={handleBuy}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 text-white font-semibold text-sm shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 hover:from-blue-500 hover:via-indigo-500 hover:to-slate-700 transition-all duration-300 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" />
                Худалдан авах
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
