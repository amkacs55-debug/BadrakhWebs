"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MessageCircle, BadgeCheck, Loader2, ShieldCheck, Copy, X, ChevronLeft, ChevronRight } from "lucide-react";

// 🚀 БҮХ ДАТАНЫ ЗАГВАР ШУУД ЭНДЭЭ БАЙНА (Тусдаа файл хэрэггүй)
interface Product {
  id: number;
  title: string;
  gameId: string;
  category: string;
  status: string;
  basePrice: number;
  messengerLink?: string;
  imageUrls: string[];
  tags: string[];
  rent1h?: number | null;
  rent12h?: number | null;
  rent24h?: number | null;
}

// 🚀 БАТАЛГААТ 3 АДМИН БОЛОН МИДМАНЫ ЛИНКҮҮД
const CONTACTS = [
  { name: "Админ Бадрах", url: "https://www.facebook.com/messages/t/Badrakhgamestore.Admin" },
  { name: "Мидман Төгөлдөр", url: "https://www.facebook.com/messages/t/TuguldurKrx" },
  { name: "Мидман Жаргалсайхан", url: "https://www.facebook.com/messages/t/jargalsaikhan.official" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Поп-ап цонхны стэйтүүд
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert("Тоглоомын ID амжилттай хуулагдлаа: " + id);
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
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentImgIdx(0);
                }}
                className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:border-slate-700/80 hover:bg-slate-800/40 transition-all relative group"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 480px) 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                      Зураггүй
                    </div>
                  )}

                  {/* 🔥 ГАДНА ТАЛЫН ЗАРАГДСАН ТУУЗ */}
                  {product.status !== "available" && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center overflow-hidden z-10 pointer-events-none">
                      <div className="bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest py-1.5 w-[140%] text-center -rotate-12 shadow-2xl border-y-2 border-yellow-300 animate-pulse">
                        {product.status === "sold" ? "ЗАРАГДСАН" : "ТҮРЭЭСЛЭГДЭВ"}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md ${
                      product.status === "available"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : product.status === "sold"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      ● {statusLabels[product.status] || product.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 relative z-20 bg-[#0F172A]">
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
                      <span className={`text-base font-black ${product.status === "available" ? "text-blue-400" : "text-slate-500 line-through"}`}>
                        {new Intl.NumberFormat("mn-MN").format(product.basePrice)} ₮
                      </span>
                    </div>
                  </div>

                  {/* КАРТАН ДЭЭРХ ТОвчлуур */}
                  {product.status === "available" ? (
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
                  ) : (
                    <button
                      disabled
                      onClick={(e) => e.stopPropagation()}
                      className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <span>🔒 {product.status === "sold" ? "ЗАРАГДСАН" : "ТҮРЭЭСЛЭГДСЭН"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🚀 ШУУД ДОТООД РУУ ОРСОН БҮРЭН ПОП-АП ЦОНХ (RENTAL MODAL ХЭРЭГГҮЙ) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-700/60 w-full max-w-lg rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Толгой хэсэг */}
            <div className="p-4 border-b border-slate-800/80 flex justify-between items-start sticky top-0 bg-[#0F172A]/95 backdrop-blur-md z-30">
              <div>
                <h2 className="text-base font-bold text-white pr-6 leading-tight">{selectedProduct.title}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedProduct.gameId}</span>
                  <button
                    onClick={() => handleCopyId(selectedProduct.gameId)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-0.5 rounded flex items-center gap-1 transition-colors border border-slate-700"
                  >
                    <Copy className="w-3 h-3" /> Хуулах
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Зургийн цомог */}
            <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
              {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
                <>
                  <Image
                    src={selectedProduct.imageUrls[currentImgIdx]}
                    alt={selectedProduct.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 480px) 100vw"
                  />
                  
                  {/* 🔥 ПОП-АП ДОТОРХ ЗАРАГДСАН ТУУЗ */}
                  {selectedProduct.status !== "available" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center overflow-hidden z-20 pointer-events-none">
                      <div className="bg-yellow-400 text-slate-950 font-black text-lg sm:text-xl uppercase tracking-widest py-2 w-[150%] text-center -rotate-12 shadow-2xl border-y-4 border-yellow-300">
                        {selectedProduct.status === "sold" ? "ЗАРАГДСАН" : "ТҮРЭЭСЛЭГДЭВ"}
                      </div>
                    </div>
                  )}

                  {selectedProduct.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImgIdx((prev) => (prev === 0 ? selectedProduct.imageUrls.length - 1 : prev - 1))}
                        className="absolute left-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/10 z-30"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImgIdx((prev) => (prev === selectedProduct.imageUrls.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/10 z-30"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-[10px] font-bold px-2.5 py-1 rounded-md text-white backdrop-blur-sm z-30">
                        {currentImgIdx + 1} / {selectedProduct.imageUrls.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-slate-600 text-xs">Зураггүй</div>
              )}
            </div>

            {/* Зургийн жижиг Thumbnail-ууд */}
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 bg-[#060B18] border-b border-slate-800/80 no-scrollbar">
                {selectedProduct.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIdx(idx)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === currentImgIdx ? "border-blue-500 scale-95" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Мэдээлэл ба Үнийн хэсэг */}
            <div className="p-5 space-y-5">
              
              {/* Түрээсийн үнэ харуулах */}
              {selectedProduct.category === "rent" && (
                <div className="bg-[#060B18] p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-blue-400">🕒</span> Түрээслэх үнийн тариф:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">1 цаг</div>
                      <div className="text-xs font-bold text-blue-400">{selectedProduct.rent1h ? `₮${selectedProduct.rent1h.toLocaleString()}` : "-"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">12 цаг</div>
                      <div className="text-xs font-bold text-blue-400">{selectedProduct.rent12h ? `₮${selectedProduct.rent12h.toLocaleString()}` : "-"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">24 цаг</div>
                      <div className="text-xs font-bold text-blue-400">{selectedProduct.rent24h ? `₮${selectedProduct.rent24h.toLocaleString()}` : "-"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Үнийн блок ба Товчлуур */}
              <div className="flex justify-between items-center bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">
                    Үндсэн үнэ
                  </span>
                  <span className={`text-xl font-black ${selectedProduct.status === "available" ? "text-white" : "text-slate-500 line-through"}`}>
                    ₮{selectedProduct.basePrice.toLocaleString()}
                  </span>
                </div>
                
                {selectedProduct.status === "available" ? (
                  <a
                    href={
                      selectedProduct.messengerLink ||
                      (String(selectedProduct.category) === "midman"
                        ? CONTACTS[1].url
                        : CONTACTS[0].url)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 transition active:scale-95 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> 
                    {selectedProduct.category === "rent" ? "Түрээслэх" : "Худалдан авах"}
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
                  >
                    🔒 {selectedProduct.status === "sold" ? "ЗАРАГДСАН" : "ТҮРЭЭСЛЭГДСЭН"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

