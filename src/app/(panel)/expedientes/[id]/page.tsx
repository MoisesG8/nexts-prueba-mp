"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPut } from "@/lib/api";
import {
    FileBadge,
    CheckCircle,
    XCircle,
    Send,
    Loader2,
    Fingerprint
} from "lucide-react";

export default function DetalleExpedientePage() {
    const params = useParams();
    const expedienteId = Number(params.id);

    const [expediente, setExpediente] = useState<any>(null);
    const [indicios, setIndicios] = useState<any[]>([]);
    const [loadingEstado, setLoadingEstado] = useState(false);
    const [mensajes, setMensajes] = useState({ error: "", success: "" });

    const usuario_rol =
        typeof window !== "undefined"
            ? Number(localStorage.getItem("rol_id"))
            : null;

    // Cargar expediente e indicios al cargar la página
    useEffect(() => {
        async function cargar() {
            const exp = await apiGet(`/expedientes/listarExpedientes?expediente_id=${expedienteId}`);
            if (exp.success) setExpediente(exp.data[0]);

            const ind = await apiGet(`/indicios/listarIndicios?expediente_id=${expedienteId}`);
            if (ind.success) setIndicios(ind.data);
        }
        cargar();
    }, [expedienteId]);

    // Cambiar estado
    async function cambiarEstado(nuevoEstado: number, comentario: string) {
        if (!confirm(`¿Seguro que deseas cambiar el estado del expediente a: ${comentario}?`)) {
            return;
        }

        setLoadingEstado(true);
        setMensajes({ error: "", success: "" });

        try {
            const response = await apiPut(`/expedientes/${expedienteId}/estado`, {
                nuevo_estado_id: nuevoEstado,
                comentario: comentario
            });

            if (response.success) {
                setMensajes({ success: response.message, error: "" });

                // Recargar en 1 segundo para actualizar estado
                setTimeout(() => window.location.reload(), 1200);
            }

        } catch (err: any) {
            setMensajes({ error: err.message, success: "" });
        } finally {
            setLoadingEstado(false);
        }
    }

    return (
        <div className="text-blue-950">

            {/* HEADER */}
            <div className="bg-blue-950 text-white p-6 rounded shadow mb-6 flex items-center gap-4">
                <FileBadge className="w-10 h-10" />
                <div>
                    <h1 className="text-3xl font-bold">Expediente #{expedienteId}</h1>
                    {expediente && (
                        <p className="opacity-80">
                            {expediente.codigo_expediente} — {expediente.descripcion}
                        </p>
                    )}
                </div>
            </div>

            {/* MENSAJES */}
            {mensajes.error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {mensajes.error}
                </div>
            )}

            {mensajes.success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {mensajes.success}
                </div>
            )}

            {/* BOTONES DE ESTADO (solo admin y coordinador) */}
            {(usuario_rol === 1 || usuario_rol === 2) && (
                <div className="mb-6 flex gap-4">

                    {/* ENVIAR A REVISION */}
                    <button
                        onClick={() => cambiarEstado(2, "Enviado a revisión")}
                        disabled={loadingEstado}
                        className="px-4 py-2 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 active:scale-95 flex items-center gap-2 transition"
                    >
                        {loadingEstado ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Enviar a revisión
                    </button>

                    {/* APROBAR */}
                    <button
                        onClick={() => cambiarEstado(3, "Aprobado")}
                        disabled={loadingEstado}
                        className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 active:scale-95 flex items-center gap-2 transition"
                    >
                        {loadingEstado ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Aprobar
                    </button>

                    {/* RECHAZAR */}
                    <button
                        onClick={() => cambiarEstado(4, "Rechazado")}
                        disabled={loadingEstado}
                        className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-95 flex items-center gap-2 transition"
                    >
                        {loadingEstado ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        Rechazar
                    </button>

                </div>
            )}

            {/* INDICIOS */}
            <div className="bg-white shadow rounded p-6 border border-blue-950/20">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Fingerprint className="w-6 h-6" />
                    Indicios registrados
                </h2>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left text-blue-950">
                            <th className="p-2">ID</th>
                            <th className="p-2">Descripción</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Técnico</th>
                            <th className="p-2">Fecha</th>
                        </tr>
                    </thead>

                    <tbody>
                        {indicios.map((i) => (
                            <tr key={i.indicio_id} className="border-t hover:bg-gray-100 transition">
                                <td className="p-2">{i.indicio_id}</td>
                                <td className="p-2">{i.descripcion}</td>
                                <td className="p-2">{i.tipo}</td>
                                <td className="p-2">{i.tecnico_nombre}</td>
                                <td className="p-2">{new Date(i.fecha_registro).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {indicios.length === 0 && (
                    <p className="text-gray-600 mt-4">Aún no hay indicios registrados.</p>
                )}
            </div>

        </div>
    );
}
