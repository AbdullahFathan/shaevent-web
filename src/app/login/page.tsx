"use client"; // Wajib karena kita pakai hooks (useState, useForm)

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authservices";
import { useAuthStore } from "@/stores/authStore";

// 1. Setup Zod Schema (Sama persis logikanya dengan di Backend!)
const loginSchema = z.object({
  email: z.email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState("");

  // 2. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Fungsi Submit ke Backend
  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMessage("");
      const response = await AuthService.login(data);

      if (response.success) {
        // Simpan data user & token ke Zustand (dan localStorage)
        setAuth(response.data.user, response.data.token);

        // Redirect ke Dashboard (nanti kita buat)
        router.push("/dashboard");
      }
    } catch (error: any) {
      // Tangkap pesan error dari backend (misal: "Invalid email or password")
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghubungi server.",
      );
    }
  };

  // 4. Render UI dengan Tailwind CSS
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          ShaEvent Admin
        </h1>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="admin@flashticket.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 text-black focus:ring-blue-500 outline-none transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
