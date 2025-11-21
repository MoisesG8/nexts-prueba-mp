"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CrearExpedientePage() {
    const router = useRouter();

    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const tecnico_id =
                typeof window !== "undefined"
                    ? Number(localStorage.getItem("usuario_id"))
                    : null;

            if (!tecnico_id) {
                setError("No se pudo obtener el técnico actual (usuario_id).");
                setLoading(false);
                return;
            }

            const response = await apiPost("/expedientes/crearExpediente", {
                descripcion,
                tecnico_id,
            });

            if (response.success) {
                setSuccess("Expediente creado correctamente.");

                setTimeout(() => {
                    router.push("/expedientes");
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-blue-950">

            <h1 className="text-2xl font-bold mb-6">Crear Expediente</h1>

            <div className="bg-white shadow p-6 rounded w-full max-w-xl">

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
                        {success}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Descripción del expediente
                        </label>
                        <textarea
                            className="w-full border p-3 rounded text-blue-950"
                            rows={4}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-5 py-2 rounded text-white text-sm font-medium 
                            ${loading
                                ? "bg-blue-300"
                                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                            }
                            transition-all flex items-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Guardando...
                            </>
                        ) : (
                            "Crear Expediente"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
