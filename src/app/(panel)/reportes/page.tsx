"use client";

import Link from "next/link";
import { FileText, ListChecks } from "lucide-react";

export default function ReportesPage() {
    return (
        <div className="text-blue-950 p-6">
            <h1 className="text-3xl font-bold mb-8">Reportes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white border border-blue-200 shadow rounded p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <FileText className="w-6 h-6" />
                        Reporte de Expedientes
                    </h2>
                    <p className="mb-4">
                        Genera un PDF con todos los expedientes, filtrados por estado y rango de fechas.
                    </p>
                    <Link
                        href="/reportes/expedientes"
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                    >
                        Generar Reporte
                    </Link>
                </div>

            </div>
        </div>
    );
}
