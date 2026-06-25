"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  gameId: string;
  category: string;
  status: string;
  basePrice: number;
  messengerLink: string;
  imageUrls: string[];
  tags: string[];
  rent1h?: number | null;
  rent12h?: number | null;
  rent24h?: number | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Баазаас заруудыг татах
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Заруудыг татахад алдаа гарлаа:", err);
    } finally {
      setLoading(false);
    }
  };

  // ID хуулах функц
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert("Тоглоомын ID амжилттай хуулагдлаа: " + id);
  };

  // Шүүлтүүр хийх (Хайлт болон Ангилал)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.gameId.includes(searchQuery) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-12 selection:bg-blue-600 selection:text-white">
      {/* Дээд хэсэг / Navbar */}
      <div className="max-w-4xl mx-auto px-4 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* 💡 ЭНДЭЭС САЙТЫНХАА ГАРЧГИЙГ СОЛИОРОЙ */}
          <h1 className="text-xl font-bold tracking-tight text-white">Badrakh MN</h1>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
            ✓ VERIFIED
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Баталгаат Холбоосууд */}
        <div className="bg-gray-900/60 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
            🛡️ Баталгаат холбоосууд
          </div>
          
          {/* 💡 Шууд хөтөч дээр чат нээх линкээр солив. username хэсгийг өөрийнхөөрөө солиорой */}
          <a
            href="https://www.facebook.com/messages/t/badrakhgamestore.admin" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 transition group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">f</div>
              <span className="text-sm font-medium text-gray-200">Админ Бадрах</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-blue-400 transition">Чатлах ➔</span>
          </a>

          <a
            href="https://www.facebook.com/messages/t/tuguldurkrx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 transition group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">f</div>
              <span className="text-sm font-medium text-gray-200">Мидман Төгөлдөр</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-blue-400 transition">Чатлах ➔</span>
          </a>

          <a
            href="https://www.facebook.com/messages/t/jargalsaikhan.official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 transition group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">f</div>
              <span className="text-sm font-medium text-gray-200">Мидман Жаргалсайхан</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-blue-400 transition">Чатлах ➔</span>
          </a>
        </div>

        {/* Ангилал солих Табууд */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            Бүгд
          </button>
          <button
            onClick={() => setSelectedCategory("account")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "account" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            Admin Acc
          </button>
          <button
            onClick={() => setSelectedCategory("topup")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "topup" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            Төлбөртэй post
          </button>
          <button
            onClick={() => setSelectedCategory("rent")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "rent" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            Түрээс (Rent)
          </button>
        </div>

        {/* Хайлтын хэсэг */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="ID болон гарчигаар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
          />
        </div>

        {/* Заруудын Жагсаалт (Grid) */}
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-sm">Уншиж байна...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-sm">Зар одоогоор олдсонгүй.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentImgIdx(0);
                }}
                className="bg-gray-900 border border-gray-800/60 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-700 transition duration-200 group flex flex-col shadow-lg"
              >
                {/* Зураг */}
                <div className="relative aspect-[16/9] w-full bg-gray-950 overflow-hidden">
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">Зураггүй</div>
                  )}
                  {/* Төлөв бэдж */}
                  <div className="absolute top-3 left-3">
                    {product.status === "available" ? (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Бэлэн байгаа
                      </span>
                    ) : (
                      <span className="bg-gray-800/80 text-gray-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-gray-700/50 backdrop-blur-md">
                        Зарагдсан
                      </span>
                    )}
                  </div>
                </div>

                {/* Зарын мэдээлэл */}
                <div className="p-4 flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-gray-100 group-hover:text-blue-400 transition line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">ID: {product.gameId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider text-[10px] font-semibold">Нийт үнэ</p>
                    <p className="font-bold text-blue-400 text-base">₮{product.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Дэлгэрэнгүй харах Поп-ап Цонх (Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-gray-900 border-t sm:border border-gray-800 w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Толгой хэсэг */}
            <div className="p-4 border-b border-gray-800/60 flex justify-between items-start sticky top-0 bg-gray-900/95 backdrop-blur-md z-10">
              <div>
                <h2 className="text-lg font-bold text-white pr-6">{selectedProduct.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">ID: {selectedProduct.gameId}</span>
                  <button
                    onClick={() => handleCopyId(selectedProduct.gameId)}
                    className="text-[10px] bg-gray-800 hover:bg-gray-700 text-blue-400 px-2 py-0.5 rounded border border-gray-700 font-medium transition"
                  >
                    ID Хуулах
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Зургийн цомог (Slider) */}
            <div className="relative bg-gray-950 aspect-[16/10] w-full flex items-center justify-center group">
              {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
                <>
                  <img
                    src={selectedProduct.imageUrls[currentImgIdx]}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                  {selectedProduct.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImgIdx((prev) => (prev === 0 ? selectedProduct.imageUrls.length - 1 : prev - 1))}
                        className="absolute left-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white text-sm flex items-center justify-center transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentImgIdx((prev) => (prev === selectedProduct.imageUrls.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white text-sm flex items-center justify-center transition"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-[11px] font-medium px-2 py-0.5 rounded-md text-gray-300 backdrop-blur-sm">
                        {currentImgIdx + 1} / {selectedProduct.imageUrls.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-gray-600 text-xs">Зураггүй</div>
              )}
            </div>

            {/* Зургийн жижиг Thumbnail-ууд */}
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-4 bg-gray-950/40 border-b border-gray-800/40 no-scrollbar">
                {selectedProduct.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIdx(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      idx === currentImgIdx ? "border-blue-500 scale-95" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Мэдээлэл ба Үнийн хэсэг */}
            <div className="p-5 space-y-4 flex-1">
              {/* Хэрэв Түрээсийн ангилал бол цагийн үнүүдийг харуулна */}
              {selectedProduct.category === "rent" ? (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">⏰ Түрээслэх үнийн тариф:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800/60">
                      <div className="text-[10px] text-gray-500">1 цаг</div>
                      <div className="text-xs font-bold text-blue-400">₮{selectedProduct.rent1h?.toLocaleString() || "0"}</div>
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800/60">
                      <div className="text-[10px] text-gray-500">12 цаг</div>
                      <div className="text-xs font-bold text-blue-400">₮{selectedProduct.rent12h?.toLocaleString() || "0"}</div>
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800/60">
                      <div className="text-[10px] text-gray-500">24 цаг</div>
                      <div className="text-xs font-bold text-blue-400">₮{selectedProduct.rent24h?.toLocaleString() || "0"}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Тагууд */}
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-800/80 text-gray-400 text-[11px] px-2.5 py-0.5 rounded-md border border-gray-700/40">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Нийт үндсэн үнэ харуулах */}
              <div className="flex justify-between items-center bg-gray-950/60 border border-gray-800 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider text-[10px] font-semibold">Үндсэн үнэ</p>
                  <p className="text-xl font-extrabold text-white">₮{selectedProduct.basePrice.toLocaleString()}</p>
                </div>
                
                {/* Худалдан авах товч - Шууд хөтөч дээр Facebook рүү Jump хийнэ */}
                <a
                  href={selectedProduct.messengerLink || "https://www.facebook.com/messages/t/badrakh.username"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl flex items-center gap-2 transition active:scale-[0.97] ${
                    selectedProduct.status === "available"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/10"
                      : "bg-gray-800 border border-gray-700 text-gray-500 pointer-events-none"
                  }`}
                >
                  💬 {selectedProduct.category === "rent" ? "Түрээслэх" : "Худалдан авах"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

