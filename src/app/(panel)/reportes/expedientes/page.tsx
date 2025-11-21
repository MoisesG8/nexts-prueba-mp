"use client";

import { descargarReportePDF } from "@/lib/expedientes";
import { useState } from "react";

export default function ReporteExpedientesPage() {

    const [estado, setEstado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function generarPDF() {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
                setError("La fecha de inicio no puede ser mayor que la fecha fin");
                return;
            }

            await descargarReportePDF({
                estado_id: estado || undefined,
                fecha_inicio: fechaInicio || undefined,
                fecha_fin: fechaFin || undefined
            });

            setSuccess("¡Reporte generado exitosamente!");

            setTimeout(() => setSuccess(null), 3000);

        } catch (err: any) {
            console.error("Error al generar PDF:", err);
            setError(err.message || "Error al generar el reporte");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="text-blue-950 p-6">
            <h1 className="text-2xl font-bold mb-4">Reporte de Expedientes</h1>

            <div className="bg-white shadow p-6 rounded border border-blue-200 w-full max-w-xl">

                <label className="block mb-2 font-semibold">Estado</label>
                <select
                    className="border p-2 w-full mb-4 rounded text-blue-950"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="1">REGISTRADO</option>
                    <option value="2">EN REVISION</option>
                    <option value="3">APROBADO</option>
                    <option value="4">RECHAZADO</option>
                </select>

                <label className="block mb-2 font-semibold">Fecha Inicio</label>
                <input
                    type="date"
                    className="border p-2 w-full mb-4 rounded text-blue-950"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                />

                <label className="block mb-2 font-semibold">Fecha Fin</label>
                <input
                    type="date"
                    className="border p-2 w-full mb-6 rounded text-blue-950"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                />

                <button
                    onClick={generarPDF}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full"
                >
                    Generar PDF
                </button>

            </div>
        </div>
    );
}
