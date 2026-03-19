"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { EventService } from "@/services/eventServices";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 1. Schema Zod (Mirror dari Backend)
const eventSchema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  description: z.string().optional(),
  location: z.string().min(3, "Lokasi wajib diisi"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  tickets: z
    .array(
      z.object({
        ticketType: z.string().min(1, "Nama tiket wajib diisi"),
        price: z
          .number({ message: "Harga harus angka" })
          .min(0, "Harga tidak boleh minus"),
        quota: z
          .number({ message: "Kuota harus angka" })
          .min(1, "Kuota minimal 1"),
      }),
    )
    .min(1, "Minimal harus ada 1 jenis tiket"),
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  // 2. Setup React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      tickets: [{ ticketType: "Reguler", price: 0, quota: 100 }], // Default 1 tiket
    },
  });

  // 3. Setup Field Array (Untuk form tiket yang dinamis)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  // 4. Submit Handler
  const onSubmit = async (data: EventForm) => {
    try {
      setErrorMessage("");

      // Transformasi format tanggal HTML (datetime-local) ke ISO-8601 untuk Backend
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      const response = await EventService.createEvent(payload);

      if (response.success) {
        router.push("/dashboard"); // Kembali ke halaman utama jika sukses
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Gagal membuat event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Buat Event Baru</h1>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Card Info Utama */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Informasi Utama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Event
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Konser Super"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                {...register("location")}
                className="w-full px-4 py-2 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Stadion GBK"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                {...register("startDate")}
                className="w-full px-4 py-2 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                {...register("endDate")}
                className="w-full px-4 py-2 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card Tiket (Dynamic Array) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Kategori Tiket
            </h2>
            <button
              type="button"
              onClick={() => append({ ticketType: "", price: 0, quota: 1 })}
              className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
            >
              <Plus size={16} /> Tambah Tiket
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nama Tiket
                </label>
                <input
                  type="text"
                  {...register(`tickets.${index}.ticketType`)}
                  className="w-full px-3 py-2 border rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VIP / Festival"
                />
                {errors.tickets?.[index]?.ticketType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tickets[index].ticketType?.message}
                  </p>
                )}
              </div>

              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  {...register(`tickets.${index}.price` as const, {
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border rounded  text-black focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="w-full md:w-32">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Kuota
                </label>
                <input
                  type="number"
                  {...register(`tickets.${index}.quota` as const, {
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Tombol Hapus (Hanya muncul jika tiket > 1) */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition mb-0.5"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {errors.tickets?.root && (
            <p className="text-red-500 text-sm mt-2">
              {errors.tickets.root.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 text-lg"
        >
          {isSubmitting ? "Menyimpan Data..." : "Simpan & Publikasikan Event"}
        </button>
      </form>
    </div>
  );
}
