"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";

const ADMIN_PASSWORD = "admin123";

const categoryOptions = [
  { value: "admin_acc", label: "Admin Acc" },
  { value: "paid_post", label: "Төлбөртэй post" },
  { value: "midman", label: "Мидман" },
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [gameId, setGameId] = useState("");
  const [category, setCategory] = useState("admin_acc");
  const [status, setStatus] = useState("available");
  const [basePrice, setBasePrice] = useState("");
  const [messengerLink, setMessengerLink] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Нууц үг буруу байна!");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setFormError("");

    const files = Array.from(e.target.files);

    try {
      const base64Promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });

      const convertedImages = await Promise.all(base64Promises);
      setImages((prev) => [...prev, ...convertedImages]);
    } catch (err) {
      setFormError("Зургийг уншиж хуулахад алдаа гарлаа.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!title || !gameId || !basePrice) {
      setFormError("Шаардлагатай талбаруудыг бөглөнө үү!");
      return;
    }

    const payload = {
      title,
      gameId,
      category,
      status,
      basePrice: Number(basePrice),
      messengerLink,
      imageUrls: images,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormSuccess("Амжилттай нэмэгдлээ!");
        setShowForm(false);
        fetchProducts();
        setTitle(""); setGameId(""); setBasePrice(""); setMessengerLink(""); setTagsInput(""); setImages([]);
      } else {
        setFormError("Зар нэмэхэд алдаа гарлаа.");
      }
    } catch (err) {
      setFormError("Сүлжээний алдаа гарлаа.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Энэ зарыг устгахдаа итгэлтэй байна уу?")) return;
    
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Зарыг амжилттай устгалаа!");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Устгаж чадсангүй: ${errorData.message || "Алдаа гарлаа."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Сүлжээний алдаа гарлаа.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060B18] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center mb-6 space-y-2">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Админ нэвтрэх</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Нууц үг</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold transition-all">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 pb-12">
      <header className="border-b border-slate-800/60 bg-[#060B18]/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-base">Хянах самбар</h1>
          <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Нийт зар ({products.length})</h2>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all">
            <Plus className="w-4 h-4" /> Шинэ зар
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <form onSubmit={handleAddProduct} className="p-6 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Гарчиг *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm" placeholder="M416 Glacier-тэй аккаунт" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Тоглоомын ID *</label>
                    <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm" placeholder="512345678" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Ангилал</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300">
                      {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Төлөв</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300">
                      {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Үндсэн үнэ (₮) *</label>
                    <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm" placeholder="150000" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Холбогдох Messenger Линк</label>
                  <input type="text" value={messengerLink} onChange={(e) => setMessengerLink(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm" placeholder="https://m.me/username" />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Тагууд (Таслалаар тусгаарлана уу)</label>
                  <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm" placeholder="Glacier M4, X-Suit, Хуучин" />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Зургууд</label>
                  <div className="flex flex-wrap gap-2">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <Image src={src} alt="Uploaded" fill className="object-cover" />
                        <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-black/60 rounded-md text-slate-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-all">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="text-[10px]">Хуулах</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple className="hidden" accept="image/*" />
                  </div>
                </div>

                {formError && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{formError}</div>}
                {formSuccess && <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">{formSuccess}</div>}

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700">Цуцлах</button>
                  <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500">Нийтлэх</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs">Уншиж байна...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">Зар байхгүй байна.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-xs text-slate-400 uppercase font-semibold">
                    <th className="px-5 py-3">Зар</th>
                    <th className="px-5 py-3">Ангилал</th>
                    <th className="px-5 py-3">Үнэ</th>
                    <th className="px-5 py-3 text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-900/20">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-slate-950 rounded-lg overflow-hidden shrink-0">
                          {product.imageUrls?.[0] ? <Image src={product.imageUrls[0]} alt="" fill className="object-cover" /> : <div className="w-full h-full bg-slate-900" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{product.title}</div>
                          <div className="text-xs text-slate-500">ID: {product.gameId}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {product.category === "admin_acc" && "Admin Acc"}
                        {product.category === "paid_post" && "Төлбөртэй post"}
                        {product.category === "midman" && "Мидман"}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-blue-400">
                        {new Intl.NumberFormat("mn-MN").format(product.basePrice)} ₮
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button 
                          type="button"
                          onClick={(e) => handleDelete(e, product.id)} 
                          disabled={deleteLoading === product.id} 
                          className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50 transition-all"
                        >
                          {deleteLoading === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
