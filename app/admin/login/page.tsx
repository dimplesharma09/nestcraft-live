"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { loginThunk } from "@/lib/store/auth/authThunks";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
 const dispatch= useDispatch<AppDispatch>();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response= await dispatch(loginThunk({email,password})).unwrap()
    console.log("login", response);
        if(response.status){
          router.push("/admin");
          router.refresh();
        }else{
          toast.error("Invalid Credentials");
        }
    // try {
    //   const res = await fetch("/api/admin/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!res.ok) {
    //     const data = await res.json();
    //     throw new Error(data.message || "Invalid credentials");
    //   }

    //   router.push("/admin");
    //   router.refresh();
    // } catch (err: any) {
    //   setError(err.message);
    // }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40">
      <div className="max-w-md w-full p-8 border border-border bg-background rounded-2xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black mb-2 tracking-tight uppercase">Nestcraft Admin Login</h1>
          <p className="text-muted-foreground text-sm">Sign in to manage the e-commerce store</p>
        </div>

        {error && (
          <div className="p-3 mb-6 flex text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="admin@nestcraft.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full flex h-10 mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
