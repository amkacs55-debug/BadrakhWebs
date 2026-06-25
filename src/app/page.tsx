"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MessageCircle, BadgeCheck, Loader2, ShieldCheck } from "lucide-react";
import RentalModal from "@/components/RentalModal";
import type { Product } from "@/components/ProductCard";

// 🚀 БАТАЛГААТ 3 АДМИН БОЛОН МИДМАНЫ ЛИНКҮҮД
const CONTACTS = [
  { name: "Админ Бадрах", url: "https://m.me/Badrakhgamestore.Admin" },
  { name: "Мидман Төгөлдөр", url: "https://m.me/TuguldurKrx" },
  { name: "Мидман Жаргалсайхан", url: "https://m.me/jargalsaikhan.official" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Дата татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesTab = activeTab === "all" || product.category === activeTab;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.gameId.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const statusLabels: Record<string, string> = {
    available: "Бэлэн байгаа",
    sold: "Зарагдсан",
    rented: "Түрээслэгдсэн",
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 pb-12">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060B18]/80 border-b border-slate-800/40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">
              Badrakh MN
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md uppercase tracking-wider">
              <BadgeCheck className="w-3 h-3 fill-blue-400 text-[#060B18]" />
              Verified
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* 🚀 3 АДМИН / МИДМАНЫ ТОВЧЛУУР ХЭСЭГ */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              Баталгаат холбоосууд
            </h2>
          </div>

          {/* 🚀 ЗӨВЛӨМЖ ХЭСЭГ */}
          <p className="text-[11px] text-center text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg py-2 px-3">
            ⚠️ Messenger-ээрээ нэвтэрсний дараа баталгаат холбоос дээр дарна уу! iPhone-той хэрэглэгчид Safari хөтөч дээрээ Badrakh.vercel.app вэбсайтаар нэвтэрнэ үү! 📱🍎
          </p>

          <div className="flex flex-col gap-2.5">
            {CONTACTS.map((person, idx) => (
              <a
                key={idx}
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-slate-200 hover:bg-[#1877F2]/20 hover:text-white hover:border-[#1877F2]/50 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-[#1877F2]/5"
              >
                <svg className="w-5 h-5 fill-current text-[#1877F2] shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {person.name}
              </a>
            ))}
          </div>
        </div>

        {/* ТАВУУД / ФИЛТЕР */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "Бүгд" },
            { id: "account", label: "Admin Acc" },
            { id: "topup", label: "Төлбөртэй post" },
            { id: "midman", label: "Moderator Acc" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/15"
                  : "bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ХАЙЛТЫН ХЭСЭГ */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="ID болон гарчигаар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* ЖАГСААЛТ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Уншиж байна...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-500">
            Зар одоогоор олдсонгүй.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:border-slate-700/80 hover:bg-slate-800/40 transition-all"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-950">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 480px) 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                      Зураггүй
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md ${
                      product.status === "available"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-700/20 text-slate-400 border-slate-600/30"
                    }`}>
                      ● {statusLabels[product.status] || product.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-100 truncate pr-2">
                        {product.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono shrink-0">
                        ID: {product.gameId}
                      </span>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium tracking-wider">
                        Үндсэн үнэ
                      </span>
                      <span className="text-base font-black text-blue-400">
                        {new Intl.NumberFormat("mn-MN").format(product.basePrice)} ₮
                      </span>
                    </div>
                  </div>

                  {/* КАРТАН ДЭЭРХ ХОЛБОГДОХ ТОВЧЛУУР */}
                  <a
                    href={
                      product.messengerLink ||
                      (String(product.category) === "midman"
                        ? CONTACTS[1].url
                        : CONTACTS[0].url)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-700/40 hover:border-blue-500"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Холбогдох
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <RentalModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

