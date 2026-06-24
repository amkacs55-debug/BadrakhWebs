"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Саяны үүсгэсэн supabase-ээ импортлов

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
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = уншиж байна
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [gameId, setGameId] = useState("");
  const [category, setCategory] = useState("account");
  const [status, setStatus] = useState("available");
  const [basePrice, setBasePrice] = useState("");
  const [messengerLink, setMessengerLink] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  
  // Чиний route.ts-д зориулж Rent-ийн үнүүдийг нэмэв
  const [rent1h, setRent1h] = useState("");
  const [rent12h, setRent12h] = useState("");
  const [rent24h, setRent24h] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Хуудас ачаалагдах үед Supabase-д нэвтэрсэн хэрэглэгч байгаа эсэхийг шалгана
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        fetchProducts();
      } else {
        setIsLoggedIn(false);
      }
    };
    checkUser();
  }, []);

  // Supabase Auth Логин хийх функц
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Имэйл эсвэл нууц үг буруу байна: " + error.message);
    } else if (data.user) {
      setIsLoggedIn(true);
      fetchProducts();
    }
  };

  // Supabase-аас гарах функц
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Заруудыг татахад алдаа гарлаа:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError("");

    const files = Array.from(e.target.files);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pubg_preset"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/drxjlkcdq/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Cloudinary руу хуулж чадсангүй");

        const data = await res.json();
        return data.secure_url; 
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url) => url !== undefined) as string[];
      setImages((prev) => [...prev, ...validUrls]);
    } catch (err) {
      setError("Зураг хуулахад алдаа гарлаа.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          gameId,
          category,
          status,
          basePrice: Number(basePrice),
          messengerLink,
          imageUrls: images,
          tags,
          rent1h: category === "rent" ? Number(rent1h) : null,
          rent12h: category === "rent" ? Number(rent12h) : null,
          rent24h: category === "rent" ? Number(rent24h) : null,
        }),
      });

      if (!res.ok) throw new Error("Сервер рүү зар хадгалж чадсангүй");

      setTitle("");
      setGameId("");
      setBasePrice("");
      setMessengerLink("");
      setTagsInput("");
      setImages([]);
      setRent1h("");
      setRent12h("");
      setRent24h("");
      
      fetchProducts(); 
      alert("Зар амжилттай нийтлэгдлээ!");
    } catch (err) {
      setError("Зар нэмэхэд алдаа гарлаа.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Энэ зарыг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Устгаж чадсангүй");
      fetchProducts(); 
      alert("Амжилттай устгагдлаа!");
    } catch (err) {
      alert("Устгаж чадсангүй, сервер дээр алдаа гарлаа.");
    }
  };

  if (isLoggedIn === null) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Уншиж байна...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md space-y-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center">Supabase Админ Нэвтрэх</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Админ Имэйл</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" required placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Нууц үг</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Нэвтрэх</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">Хянах самбар</h1>
          <button onClick={handleLogout} className="text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg border border-red-900/50 transition">Гарах</button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Гарчиг *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Тоглоомын ID *</label>
              <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ангилал</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="account">Admin Acc</option>
                <option value="topup">Paid Post</option>
                <option value="rent">Rent (Түрээс)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Төлөв</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="available">Бэлэн байгаа</option>
                <option value="sold">Зарагдсан</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Үндсэн үнэ (₮) *</label>
              <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Холбогдох Messenger Линк</label>
              <input type="url" value={messengerLink} onChange={(e) => setMessengerLink(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Хэрэв Түрээс сонгогдвол цагийн үнүүдийг харуулна */}
          {category === "rent" && (
            <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 grid grid-cols-3 gap-3 animate-fadeIn">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">1 цаг (₮)</label>
                <input type="number" value={rent1h} onChange={(e) => setRent1h(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">12 цаг (₮)</label>
                <input type="number" value={rent12h} onChange={(e) => setRent12h(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">24 цаг (₮)</label>
                <input type="number" value={rent24h} onChange={(e) => setRent24h(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Тагууд (Таслалаар тусгаарлана уу)</label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="m416, max, glacier" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Зургууд</label>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="cursor-pointer bg-gray-800 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center w-24 h-24 transition">
                <span className="text-xs text-gray-400 text-center">{uploading ? "Уншиж байна..." : "Хуулах"}</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {images.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-800">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✕</button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setImages([])} className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2 rounded-lg transition">Цуцлах</button>
            <button type="submit" disabled={loading || uploading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50">
              {loading ? "Нийтэлж байна..." : "Нийтлэх"}
            </button>
          </div>
        </form>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-sm border-b border-gray-800">
                <th className="p-4">ЗАР</th>
                <th className="p-4">АНГИЛАЛ</th>
                <th className="p-4">ҮНЭ</th>
                <th className="p-4 text-center">ҮЙЛДЭЛ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800/30 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      {product.imageUrls?.[0] ? <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No Img</div>}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-200">{product.title}</div>
                      <div className="text-xs text-gray-500">ID: {product.gameId}</div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-gray-400">{product.category}</td>
                  <td className="p-4 font-medium text-blue-400">₮{product.basePrice.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(product.id)} className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-lg transition text-xs font-medium">Устгах</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Одоогоор ямар нэгэн зар байхгүй байна.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

