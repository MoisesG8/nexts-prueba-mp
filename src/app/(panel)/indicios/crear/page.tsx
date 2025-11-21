"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
    FilePlus,
    Fingerprint,
    Tag,
    Ruler,
    Weight,
    MapPin,
    BadgeAlert
} from "lucide-react";
import { obtenerExpedientes } from "@/lib/expedientes";

export default function CrearIndicioPage() {

    const [expedientes, setExpedientes] = useState<any[]>([]);
    const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<number | null>(null);

    const [descripcion, setDescripcion] = useState("");
    const [color, setColor] = useState("");
    const [tamano, setTamano] = useState("");
    const [peso, setPeso] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [tipo, setTipo] = useState("");

    const [loadingExp, setLoadingExp] = useState(true);
    const [loading, setLoading] = useState(false);

    const [msgError, setMsgError] = useState("");
    const [msgSuccess, setMsgSuccess] = useState("");

    const tecnico_id =
        typeof window !== "undefined"
            ? Number(localStorage.getItem("usuario_id"))
            : null;

    useEffect(() => {
        async function cargar() {
            try {
                const response = await obtenerExpedientes([], "/expedientes/listarExpedientes");
                if (response.success) {
                    setExpedientes(response.data);
                }
            } catch (e) {
                console.error(e);
            }
            setLoadingExp(false);
        }
        cargar();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!expedienteSeleccionado) {
            setMsgError("Debe seleccionar un expediente.");
            return;
        }

        setLoading(true);
        setMsgError("");
        setMsgSuccess("");

        try {
            const response = await apiPost("/indicios/crearIndicio", {
                expediente_id: expedienteSeleccionado,
                tecnico_id,
                descripcion,
                color,
                tamano,
                peso,
                ubicacion,
                tipo,
            });

            if (response.success) {
                setMsgSuccess("Indicio registrado exitosamente.");
                setDescripcion("");
                setColor("");
                setTamano("");
                setPeso("");
                setUbicacion("");
                setTipo("");
            }
        } catch (err: any) {
            setMsgError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="text-blue-950">

            {/* TITULO */}
            <h1 className="text-2xl font-bold mb-6">Registrar Indicio</h1>

            {/* SELECT DE EXPEDIENTE */}
            <div className="bg-white shadow p-6 rounded mb-6 border border-blue-950/20">

                <label className="font-semibold text-blue-950">
                    Seleccione un expediente
                </label>

                {loadingExp ? (
                    <p className="mt-2">Cargando expedientes...</p>
                ) : (
                    <select
                        className="w-full border rounded p-2 mt-2 text-blue-950"
                        value={expedienteSeleccionado ?? ""}
                        onChange={(e) => setExpedienteSeleccionado(Number(e.target.value))}
                    >
                        <option value="">Seleccione...</option>

                        {expedientes.map((exp) => (
                            <option key={exp.expediente_id} value={exp.expediente_id}>
                                {exp.codigo_expediente} — {exp.descripcion}
                            </option>
                        ))}
                    </select>
                )}

            </div>

            {/* FORMULARIO (solo si ya seleccionó expediente) */}
            {expedienteSeleccionado && (
                <div className="bg-white shadow-lg rounded p-6 border border-blue-950/20">

                    {/* ALERTAS */}
                    {msgError && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center gap-2">
                            <BadgeAlert className="w-5 h-5" />
                            {msgError}
                        </div>
                    )}

                    {msgSuccess && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center gap-2">
                            {msgSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* DESCRIPCIÓN */}
                        <div className="md:col-span-2">
                            <label className="font-semibold flex items-center gap-2">
                                <Fingerprint className="w-5 h-5" />
                                Descripción del Indicio
                            </label>
                            <textarea
                                className="w-full border rounded p-3 mt-1 text-blue-950 bg-gray-50"
                                rows={4}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        {/* COLOR */}
                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Color
                            </label>
                            <input
                                className="w-full border rounded p-2 mt-1 text-blue-950 bg-gray-50"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>

                        {/* TAMAÑO */}
                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <Ruler className="w-5 h-5" />
                                Tamaño
                            </label>
                            <input
                                className="w-full border rounded p-2 mt-1 text-blue-950 bg-gray-50"
                                value={tamano}
                                onChange={(e) => setTamano(e.target.value)}
                            />
                        </div>

                        {/* PESO */}
                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <Weight className="w-5 h-5" />
                                Peso
                            </label>
                            <input
                                className="w-full border rounded p-2 mt-1 text-blue-950 bg-gray-50"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                            />
                        </div>

                        {/* UBICACION */}
                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Ubicación
                            </label>
                            <input
                                className="w-full border rounded p-2 mt-1 text-blue-950 bg-gray-50"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                            />
                        </div>

                        {/* TIPO */}
                        <div className="md:col-span-2">
                            <label className="font-semibold flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Tipo de evidencia
                            </label>
                            <input
                                className="w-full border rounded p-2 mt-1 text-blue-950 bg-gray-50"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                placeholder="Ej: electrónico, documento, objeto, biológico..."
                            />
                        </div>

                        {/* BOTÓN */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 rounded text-white font-semibold 
                                    ${loading
                                        ? "bg-blue-300"
                                        : "bg-blue-700 hover:bg-blue-800 active:scale-95"
                                    }
                                    transition-all flex items-center gap-2`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <FilePlus className="w-5 h-5" />
                                        Registrar Indicio
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}
