"use client";

import { useEffect, useState } from "react";
import { EventService } from "@/services/eventServices";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

interface FlashEvent {
  id: number;
  name: string;
  location: string;
  startDate: string;
  tickets: any[];
}

export default function DashboardPage() {
  const [events, setEvents] = useState<FlashEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await EventService.getAllEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Event</h1>

        {/* UBAH BAGIAN INI */}
        <Link
          href="/dashboard/create-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <CalendarPlus size={20} />
          Buat Event Baru
        </Link>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data dari server...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada event. Silakan buat baru.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-medium">Nama Event</th>
                <th className="p-4 font-medium">Lokasi</th>
                <th className="p-4 font-medium">Tanggal Mulai</th>
                <th className="p-4 font-medium">Jenis Tiket</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">{evt.name}</td>
                  <td className="p-4 text-gray-600">{evt.location}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(evt.startDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-gray-600">
                    {evt.tickets.length} Kategori
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
