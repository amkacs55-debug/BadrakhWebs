"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Upload,
  X,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/components/ProductCard";

const ADMIN_PASSWORD = "Hosoo0625@";

// 1. Ангиллын сонголтуудыг шинэ утгаар солив
const categoryOptions = [
  { value: "admin_acc", label: "Admin Acc" },
  { value: "paid_post", label: "Төлбөртэй post" },
  { value: "rent", label: "Түрээс" },
];

const statusOptions = [
  { value: "available", label: "Бэлэн байгаа" },
  { value: "sold", label: "Зарагдсан" },
  { value: "rented", label: "Түрээслэгдсэн" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 2. Form state-ийн category төрлийг шинэчлэв
  const [formData, setFormData] = useState({
    title: "",
    gameId: "",
    category: "admin_acc" as "admin_acc" | "paid_post" | "rent",
    status: "available" as "available" | "sold" | "rented",
    tags: "",
    basePrice: "",
    messengerLink: "https://m.me/",
    rent1h: "",
    rent12h: "",
    rent24h: "",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Нууц үг буруу байна");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification("Бүтээгдэхүүн амжилттай устгагдлаа", "success");
      } else {
        showNotification("Устгахад алдаа гарлаа", "error");
      }
    } catch {
      showNotification("Устгахад алдаа гарлаа", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        gameId: formData.gameId,
        category: formData.category,
        status: formData.status,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        basePrice: parseInt(formData.basePrice, 10) || 0,
        messengerLink: formData.messengerLink,
        imageUrls: uploadedImages,
        rent1h: formData.rent1h ? parseInt(formData.rent1h, 10) : null,
        rent12h: formData.rent12h ? parseInt(formData.rent12h, 10) : null,
        rent24h: formData.rent24h ? parseInt(formData.rent24h, 10) : null,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification("Бүтээгдэхүүн амжилттай нэмэгдлээ", "success");
        setFormData({
          title: "",
          gameId: "",
          category: "admin_acc", // 👈 Амжилттай хадгалагдсаны дараа admin_acc-аар reset хийнэ
          status: "available",
          tags: "",
          basePrice: "",
          messengerLink: "https://m.me/",
          rent1h: "",
          rent12h: "",
          rent24h: "",
        });
        setUploadedImages([]);
        setShowForm(false);
        fetchProducts();
      } else {
        showNotification("Нэмэхэд алдаа гарлаа", "error");
      }
    } catch {
      showNotification("Нэмэхэд алдаа гарлаа", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  const statusLabels: Record<string, string> = {
    available: "Бэлэн",
    sold: "Зарагдсан",
    rented: "Түрээслэгдсэн",
  };

  const statusColors: Record<string, string> = {
    available: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    sold: "text-slate-400 bg-slate-600/15 border-slate-600/30",
    rented: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
  };

  // 3. Хүснэгтийн жагсаалтад харагдах текстийг шинэчлэв
  const categoryLabels: Record<string, string> = {
    admin_acc: "Admin Acc",
    paid_post: "Төлбөртэй post",
    rent: "Түрээс",
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl p-8 shadow-xl shadow-black/20">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-2xl bg-blue-600/15 border border-blue-500/25">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-white mb-1">
              Админ нэвтрэх
            </h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Удирдлагын самбарт нэвтрэхийн тулд нууц үгээ оруулна уу
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Нууц үг"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 text-white font-semibold text-sm shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 transition-all duration-300 active:scale-[0.98]"
              >
                Нэвтрэх
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg"
            style={{
              background: notification.type === "success" ? "rgba(6, 78, 59, 0.95)" : "rgba(127, 29, 29, 0.95)",
              borderColor: notification.type === "success" ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)",
            }}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm text-white">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060B18]/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-white">Удирдлагын самбар</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Шинээр нэмэх</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Гарах</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-100 mb-5">
                  Шинэ бүтээгдэхүүн нэмэх
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Гарчиг
                      </label>
                      <input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="Жишээ: Conqueror аккаунт"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Game ID
                      </label>
                      <input
                        required
                        value={formData.gameId}
                        onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="5123456789"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Ангилал
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as "admin_acc" | "paid_post" | "rent" })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                      >
                        {categoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Төлөв
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as "available" | "sold" | "rented" })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Үндсэн үнэ (₮)
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="150000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Tags (таслалаар тусгаарлана)
                      </label>
                      <input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="Conqueror, M416, Level 70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Messenger холбоос
                      </label>
                      <input
                        required
                        value={formData.messengerLink}
                        onChange={(e) => setFormData({ ...formData, messengerLink: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="https://m.me/yourpage"
                      />
                    </div>
                  </div>

                  {/* Rent Prices */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Түрээсийн үнэ (₮) — хүсвэл бөглөнө
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={formData.rent1h}
                        onChange={(e) => setFormData({ ...formData, rent1h: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="1 цаг"
                      />
                      <input
                        type="number"
                        value={formData.rent12h}
                        onChange={(e) => setFormData({ ...formData, rent12h: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="12 цаг"
                      />
                      <input
                        type="number"
                        value={formData.rent24h}
                        onChange={(e) => setFormData({ ...formData, rent24h: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="24 цаг"
                      />
                    </div>
                  </div>

                  {/* Drag & Drop Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Зураг оруулах
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-blue-500/60 bg-blue-600/10"
                          : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50"
                      }`}
                    >
                      <Upload className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400">
                        Зургаа энд чирж оруулна уу эсвэл{" "}
                        <span className="text-blue-400">сонгоно уу</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-1">PNG, JPG, JPEG дэмжигдэнэ</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Image Preview Grid with Watermark */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-700/50 group"
                        >
                          <Image
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                          {/* Watermark */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold text-white/20 tracking-wider uppercase rotate-[-12deg]">
                              Pubg Accounts MN
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white hover:bg-red-600/80 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 text-white font-semibold text-sm shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
                    >
                      {formSubmitting ? "Хадгалж байна..." : "Хадгалах"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setUploadedImages([]);
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all text-sm font-medium"
                    >
                      Болих
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/60">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              Бүтээгдэхүүний жагсаалт
            </h2>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 shimmer rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Бүтээгдэхүүн олдсонгүй</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Гарчиг
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Game ID
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Ангилал
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Төлөв
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Үнэ
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Үйлдэл
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
                        #{product.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {product.imageUrls?.[0] && (
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-700/50">
                              <Image
                                src={product.imageUrls[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                          )}
                          <span className="text-sm text-slate-200 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-400 font-mono hidden sm:table-cell">
                        {product.gameId}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-400">
                          {categoryLabels[product.category]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${statusColors[product.status]}`}
                        >
                          {statusLabels[product.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-200 font-medium">
                                                {new Intl.NumberFormat("mn-MN").format(product.basePrice)} ₮
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading === product.id}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

                      
