"use client";

import { obtenerExpedientes } from "@/lib/expedientes";
import { useEffect, useState } from "react";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";


export default function Expedientes() {
    const username =
        typeof window !== "undefined"
            ? localStorage.getItem("username")
            : "";

    const [expedientes, setExpedientes] = useState<any[]>([]);
    const [estado, setEstado] = useState<string>("");
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function cargarExpedientes() {
        const filtros = [];
        setLoading(true);
        if (estado) filtros.push(`estado_id=${estado}`);
        if (fechaInicio) filtros.push(`fecha_inicio=${fechaInicio}`);
        if (fechaFin) filtros.push(`fecha_fin=${fechaFin}`);
        try {
            const response = await obtenerExpedientes(filtros, "/expedientes/listarExpedientes");
            if (response.success) {
                setExpedientes(response.data);
            }

        } catch (error) {
            console.error("Error al obtener expedientes:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarExpedientes();
    }, []);

    const limpiarFiltros = () => {
        setEstado("");
        setFechaInicio("");
        setFechaFin("");
        cargarExpedientes();
    }

    return (
        <div className="">

            <h1 className="text-2xl font-bold mb-4 text-blue-950">Expedientes</h1>

            {/* FILTROS */}
            <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-end text-blue-950">

                {/* Filtro estado */}
                <div>
                    <label className="text-sm font-semibold">Estado</label>
                    <select
                        className="border rounded p-2 w-48 text-blue-950"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="1">REGISTRADO</option>
                        <option value="2">EN REVISION</option>
                        <option value="3">APROBADO</option>
                        <option value="4">RECHAZADO</option>
                    </select>
                </div>

                {/* Fecha inicio */}
                <div>
                    <label className="text-sm font-semibold">Fecha Inicio</label>
                    <input
                        type="date"
                        className="border rounded p-2 text-blue-950"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>

                {/* Fecha fin */}
                <div>
                    <label className="text-sm font-semibold">Fecha Fin</label>
                    <input
                        type="date"
                        className="border rounded p-2 text-blue-950"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                <button
                    onClick={cargarExpedientes}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white 
        ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 active:scale-95"} 
        transition-all`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Cargando...
                        </div>
                    ) : (
                        "Filtrar"
                    )}
                </button>

                <button
                    onClick={limpiarFiltros}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white 
        ${loading ? "bg-gray-300" : "bg-gray-400 hover:bg-gray-500 active:scale-95"} 
        transition-all`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        "Limpiar"
                    )}
                </button>


            </div>

            <div className="bg-white shadow-md rounded p-4 text-blue-950">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left text-blue-950">
                            <th className="p-2 font-medium">Código Expediente</th>
                            <th className="p-2 font-medium">Descripción</th>
                            <th className="p-2 font-medium">Fecha de Creación</th>
                            <th className="p-2 font-medium">Estado</th>
                            <th className="p-2 font-medium">Técnico Registró</th>
                            <th className="p-2 font-medium">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expedientes.map((exp) => (
                            <tr
                                key={exp.expediente_id}
                                className="border-t hover:bg-gray-100 transition-colors"
                            >
                                <td className="p-2">{exp.codigo_expediente}</td>
                                <td className="p-2">{exp.descripcion}</td>
                                <td className="p-2">
                                    {new Date(exp.fecha_registro).toLocaleString()}
                                </td>
                                <td className="p-2 font-semibold">
                                    {exp.estado_nombre}
                                </td>
                                <td className="p-2">{exp.tecnico_nombre}</td>
                                <td className="p-2">
                                    <Link
                                        href={`/expedientes/${exp.expediente_id}`}
                                        className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold active:scale-95 transition"
                                    >
                                        <ArrowRightCircle className="w-5 h-5" />
                                        Ver
                                    </Link>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {expedientes.length === 0 && (
                    <p className="text-gray-600 text-center mt-4">
                        No hay expedientes registrados.
                    </p>
                )}
            </div>

        </div>
    );
}