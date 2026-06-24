"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

// Supabase-ээс ирэх бүтээгдэхүүний өгөгдлийн төрөл
interface Product {
  id: number;
  title: string;
  game_id: string;
  category: "account" | "topup" | "rent";
  status: "available" | "sold" | "rented";
  tags: string[];
  base_price: number;
  messenger_link: string;
  image_urls: string[]; // Скриншотуудын линк (Array)
  rent_1h?: number;
  rent_12h?: number;
  rent_24h?: number;
}

interface RentalModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalModal({ product, isOpen, onClose }: RentalModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<"1h" | "12h" | "24h">("1h");

  // Модал хаагдах үед зургийн индексийг 0 болгож шинэчлэх
  useEffect(() => {
    if (!isOpen) {
      setActiveImageIndex(0);
      setSelectedDuration("1h");
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // ID хуулах функц
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(product.game_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("ID хуулж чадсангүй", err);
    }
  };

  // Үнэ тооцоолох логик (Түрээс бол сонгосон цагаар, бусад үед үндсэн үнээр)
  const getFinalPrice = () => {
    if (product.category === "rent") {
      if (selectedDuration === "1h") return product.rent_1h || product.base_price;
      if (selectedDuration === "12h") return product.rent_12h || product.base_price;
      if (selectedDuration === "24h") return product.rent_24h || product.base_price;
    }
    return product.base_price;
  };

  // Карусель удирдлага
  const nextImage = () => {
    if (product.image_urls.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.image_urls.length);
    }
  };

  const prevImage = () => {
    if (product.image_urls.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + product.image_urls.length) % product.image_urls.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      {/* Модалын гадна талд дарахад хаагдах */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Үндсэн Кард - Тансаг гүн хөх өнгө (#060B18), Скроллгүй цэгцтэй бүтэц */}
      <div className="relative w-full max-w-lg bg-[#060B18] rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden text-slate-100 z-10">
        
        {/* Дээд талын жижиг зураас (Гулсуулж хаах mobile индикатор) */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="w-12 h-1 rounded-full bg-slate-700/60" />
        </div>

        {/* ХЭРЭГЛЭГЧИЙН ХҮССЭН ТОЛГОЙ ХЭСЭГ: Гарчиг, ID, Хаах товчлуур */}
        <div className="p-5 pb-3 flex justify-between items-start border-b border-slate-900">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">{product.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400">ID: {product.game_id}</span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-800/30 text-blue-400 text-xs font-medium hover:bg-blue-900/40 active:scale-95 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Хуулагдлаа</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[11px]">ID Хуулах</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Төлөвийн тэмдэг */}
            <div className="pt-1">
              <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {product.status === "available" && "Бэлэн байгаа"}
                {product.status === "sold" && "Зарагдсан"}
                {product.status === "rented" && "Түрээслэгдсэн"}
              </span>
            </div>
          </div>

          {/* Хаах товчлуур */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Дунд хэсэг (Зураг болон Сонголтууд) - Дотоод нарийн скроллтой */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          
          {/* СҮҮЛИЙН СҮПЕР ГАЛЕРЕЙ КАРУСЕЛЬ (Зурагны унталтыг 100% зөв харуулна) */}
          <div className="relative group w-full aspect-[16/9] bg-slate-950/60 rounded-xl overflow-hidden border border-slate-900 flex items-center justify-center">
            {product.image_urls && product.image_urls.length > 0 ? (
              <>
                <img
                  src={product.image_urls[activeImageIndex]}
                  alt={`${product.title} - ${activeImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                />

                {/* Зуун/Баруун сумнууд (Олон зурагтай үед харагдана) */}
                {product.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 p-1.5 rounded-lg bg-black/60 border border-white/5 text-white/80 hover:text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 p-1.5 rounded-lg bg-black/60 border border-white/5 text-white/80 hover:text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Зургийн тоолуур (жишээ нь: 2 / 3) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/5 text-xs text-slate-300 font-medium">
                      {activeImageIndex + 1} / {product.image_urls.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-500">Зураггүй байна</div>
            )}
          </div>

          {/* ЖИЖИГ ХУУРМАГ ЗУРГУУДЫН ЖАГСААЛТ (Thumbnail Grid) */}
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar-thin">
              {product.image_urls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 aspect-[16/9] bg-slate-950 rounded-md overflow-hidden border transition-all ${
                    idx === activeImageIndex
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* ТҮРЭЭСИЙН ХУГАЦАА СОНГОХ (Зөвхөн Түрээс ангилалд харагдана) */}
          {product.category === "rent" && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Түрээсийн хугацаа сонгох
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedDuration("1h")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedDuration === "1h"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-sm font-bold">1 цаг</span>
                  <span className="text-xs opacity-80">{(product.rent_1h || product.base_price).toLocaleString()}₮</span>
                </button>
                <button
                  onClick={() => setSelectedDuration("12h")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedDuration === "12h"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-sm font-bold">12 цаг</span>
                  <span className="text-xs opacity-80">{(product.rent_12h || product.base_price * 10).toLocaleString()}₮</span>
                </button>
                <button
                  onClick={() => setSelectedDuration("24h")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedDuration === "24h"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-sm font-bold">24 цаг</span>
                  <span className="text-xs opacity-80">{(product.rent_24h || product.base_price * 18).toLocaleString()}₮</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ДООД ХЭСЭГ: Нийт үнэ ба Худалдан авах товчлуур (Уусгалттай цэнхэр) */}
        <div className="p-5 bg-slate-950/40 border-t border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-slate-400 font-medium">Нийт үнэ</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {getFinalPrice().toLocaleString()} <span className="text-lg font-bold text-blue-400">₮</span>
            </span>
          </div>

          <a
            href={product.messenger_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              {product.category === "rent" ? "Түрээслэх" : "Худалдан авах"}
            </span>
          </a>
        </div>
      </div>

      {/* НҮДЭНД ДУЛААХАН НАРИЙХАН СКРОЛЛЫН ТУСГАЙ CSS СТИЛЬ */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
        .custom-scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
}
