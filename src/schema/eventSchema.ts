import z from "zod";

export const eventSchema = z.object({
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

export type EventForm = z.infer<typeof eventSchema>;
