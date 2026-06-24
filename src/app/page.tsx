"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  UserCheck, // 👈 Баталгаажсан админ аккаунтын дүрс
  FileText,  // 👈 Төлбөртэй зарын (пост) дүрс
  Clock,
  ChevronDown,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import RentalModal from "@/components/RentalModal";
import SkeletonCard from "@/components/SkeletonCard";
import type { Product } from "@/components/ProductCard";

// 1. Ангиллын түлхүүр үгсийг шинэчилсэн
type Category = "all" | "admin_acc" | "paid_post" | "rent";
type SortOption = "newest" | "price-asc" | "price-desc";

// 2. Табуудын нэршил болон дүрсүүдийг яг таны хүссэнээр өөрчлөв
const tabs: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "Бүгд", icon: <ShoppingBag className="w-4 h-4" /> },
  { key: "admin_acc", label: "Admin Acc", icon: <UserCheck className="w-4 h-4" /> },
  { key: "paid_post", label: "Төлбөртэй post", icon: <FileText className="w-4 h-4" /> },
  { key: "rent", label: "Түрээс", icon: <Clock className="w-4 h-4" /> },
];

const sortOptions: { key: SortOption; label: string }[] = [
  { key: "newest", label: "Шинээр" },
  { key: "price-asc", label: "Үнэ: Бага → Их" },
  { key: "price-desc", label: "Үнэ: Их → Бага" },
];

const faqItems = [
  {
    question: "Аккаунт худалдан авахдаа ямар мэдээлэл хэрэгтэй вэ?",
    answer:
      "Та зөвхөн Messenger-ээр бидэнтэй холбогдож, сонирхож буй аккаунтын ID-г илгээхэд л хангалттай. Бид танд нэмэлт мэдээлэл болон төлбөрийн зааврыг олгоно.",
  },
  {
    question: "Түрээсийн аккаунт хэр удаан ашиглах боломжтой вэ?",
    answer:
      "Түрээсийн аккаунтууд 1 цаг, 12 цаг, 24 цаг гэсэн гурван төрлийн хугацаатай байдаг. Та өөрт тохирох хугацааг сонгож худалдан авах боломжтой.",
  },
  {
    question: "Төлбөр хэрхэн хийх вэ?",
    answer:
      "Бид QPay, SocialPay, банкны шилжүүлэг болон бусад төлбөрийн хэрэгслийг хүлээн авдаг. Төлбөр баталгаажсаны дараа аккаунтын мэдээллийг шууд илгээнэ.",
  },
  {
    question: "Аккаунт буцаах боломжтой юу?",
    answer:
      "Аккаунтын нууц үг болон бусад мэдээлэл шилжүүлсний дараа буцаах боломжгүй. Худалдан авахын өмнө бүтээгдэхүүний мэдээллийг сайтар уншина уу.",
  },
  {
    question: "Аюулгүй байдлыг хэрхэн хангасан бэ?",
    answer:
      "Бүх аккаунт баталгаатай бөгөөд бид зөвхөн итгэлцэлд суурилсан найдвартай эх үүсвэрээс бүтээгдэхүүн нийлүүлдэг. Мөн бүх гүйлгээ нууцлалтай хийгддэг.",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (searchQuery) params.set("search", searchQuery);
      if (sortBy !== "newest") params.set("sort", sortBy);

      // Эндээс Supabase API руу шинээр өөрчилсөн category-ууд ('admin_acc', 'paid_post') шууд зөв дамжина
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#060B18]">
      <Header />

      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
          >
            PUBG Mobile Аккаунт &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-slate-400 bg-clip-text text-transparent">
              Түрээс
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg mx-auto"
          >
            Баталгаатай, аюулгүй PUBG Mobile аккаунт худалдан авалт болон түрээсийн үйлчилгээ
          </motion.p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-[#060B18]/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === tab.key
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {activeCategory === tab.key && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-blue-600/20 border border-blue-500/30 rounded-xl"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </form>
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">
                  {sortOptions.find((s) => s.key === sortBy)?.label}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#0F172A] border border-slate-700/60 rounded-xl shadow-xl shadow-black/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === opt.key
                        ? "bg-blue-600/15 text-blue-300"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">Бүтээгдэхүүн олдсонгүй</h3>
            <p className="text-sm text-slate-500 mt-1">
              Өөр шүүлтүүр эсвэл хайлтаар дахин оролдоно уу
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onClick={setSelectedProduct}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-slate-100">Түгээмэл асуултууд</h2>
        </div>
        <div className="space-y-2">
          {faqItems.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0F172A] border border-slate-800/60 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-sm font-medium text-slate-200 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-600">
            © 2025 Pubg Accounts MN. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </footer>

      {/* Rental Modal */}
      <RentalModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
