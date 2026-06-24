"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, MessageCircle, BadgeCheck, Loader2 } from "lucide-react";

// 1. Таны Фэйсбүүк профайл эсвэл Пэйж хуудасны линк
const ADMIN_FACEBOOK_LINK = "https://www.facebook.com/share/1ES4ks43Bp/";

export interface Product {
  id: number;
  title: string;
  gameId: string;
  category: "admin_acc" | "paid_post" | "rent";
  status: "available" | "sold" | "rented";
  tags: string[];
  basePrice: number;
  messengerLink: string;
  imageUrls: string[];
  rent1h?: number | null;
  rent12h?: number | null;
  rent24h?: number | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Үзүүлэлт татахад алдаа гарлаа:", error);
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
      
      {/* ДЭЭД ХЭСЭГ (HEADER) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060B18]/80 border-b border-slate-800/40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">
              Pubg Accounts MN
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md uppercase tracking-wider">
              <BadgeCheck className="w-3 h-3 fill-blue-400 text-[#060B18]" />
              Verified
            </span>
          </div>

          {/* Баруун дээд талын дугуйлсан Админтай холбогдох товч */}
          <a
            href={ADMIN_FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all duration-200 flex items-center justify-center"
            title="Админтай холбогдох"
          >
            <svg className="w-5 h-5 fill-current text-slate-300 hover:text-blue-400" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </header>

      {/* ҮНДСЭН АГУУЛГА */}
      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* HERO ХЭСЭГ */}
        <div className="space-y-3">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            PUBG Mobile Аккаунт & <span className="text-blue-400">Түрээс</span>
          </h1>
          
          {/* Хуучин текст байсан хэсэгт орсон Админтай холбогдох FB товчлуур */}
          <a
            href={ADMIN_FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-slate-200 hover:bg-[#1877F2]/20 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide"
          >
            {/* Facebook Logo */}
            <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Админтай холбогдох
          </a>
        </div>

        {/* ТАВУУД / ФИЛТЕР */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "Бүгд" },
            { id: "admin_acc", label: "Admin Acc" },
            { id: "paid_post", label: "Төлбөртэй post" },
            { id: "rent", label: "Түрээс" },
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* БҮТЭЭГДЭХҮҮНИЙ ЖАГСААЛТ */}
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
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Зургийн хэсэг */}
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

                  {/* Төлвийн пайз */}
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

                {/* Мэдээллийн хэсэг */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-100 truncate">
                        {product.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        ID: {product.gameId}
                      </span>
                    </div>

                    {/* Тагууд */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Үнийн мэдээлэл */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium tracking-wider">
                        Үндсэн үнэ
                      </span>
                      <span className="text-base font-black text-blue-400">
                        {new Intl.NumberFormat("mn-MN").format(product.basePrice)} ₮
                      </span>
                    </div>

                    {product.category === "rent" && (product.rent1h || product.rent24h) && (
                      <div className="text-right text-xs text-slate-400 space-y-0.5">
                        {product.rent1h && <div>1ц: {product.rent1h}₮</div>}
                        {product.rent24h && <div>24ц: {product.rent24h}₮</div>}
                      </div>
                    )}
                  </div>

                  {/* Карт бүрийн доорх холбогдох товч */}
                  <a
                    href={product.messengerLink || ADMIN_FACEBOOK_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-700/40 hover:border-blue-500"
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
    </div>
  );
}
