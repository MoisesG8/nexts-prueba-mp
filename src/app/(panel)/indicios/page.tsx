"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
    Search,
    Calendar,
    FolderSearch,
    User,
    Fingerprint
} from "lucide-react";
import { obtenerExpedientes } from "@/lib/expedientes";

export default function IndiciosPage() {

    const [indicios, setIndicios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [expedienteId, setExpedienteId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [expedientes, setExpedientes] = useState<any[]>([]);
    const [tecnicos, setTecnicos] = useState<any[]>([]);

    useEffect(() => {
        async function cargarAuxiliares() {
            const response = await obtenerExpedientes([], "/expedientes/listarExpedientes");
            if (response.success) {
                setExpedientes(response.data);
            }

            const tech = await apiGet("/usuarios/listarUsuarios");
            if (tech.success) setTecnicos(tech.data);
        }
        cargarAuxiliares();
    }, []);

    async function cargarIndicios() {
        setLoading(true);
        const filtros = [];

        if (expedienteId) filtros.push(`expediente_id=${expedienteId}`);
        if (tecnicoId) filtros.push(`tecnico_id=${tecnicoId}`);
        if (fechaInicio) filtros.push(`fecha_inicio=${fechaInicio}`);
        if (fechaFin) filtros.push(`fecha_fin=${fechaFin}`);

        const response = await obtenerExpedientes(filtros, "/indicios/listarIndicios");
        if (response.success) {
            setIndicios(response.data);
        }

        setLoading(false);
    }

    useEffect(() => {
        cargarIndicios();
    }, []);

    const limpiarFiltros = () => {
        setExpedienteId("");
        setTecnicoId("");
        setFechaInicio("");
        setFechaFin("");
        cargarIndicios();
    };

    return (
        <div className="text-blue-950">

            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Fingerprint className="w-8 h-8" />
                Listado de Indicios
            </h1>

            <div className="bg-white p-6 rounded shadow mb-6 border border-blue-950/20 grid grid-cols-1 md:grid-cols-4 gap-4">

                <div>
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <FolderSearch className="w-4 h-4" />
                        Expediente
                    </label>
                    <select
                        className="border rounded p-2 w-full text-blue-950"
                        value={expedienteId}
                        onChange={(e) => setExpedienteId(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {expedientes.map((exp) => (
                            <option key={exp.expediente_id} value={exp.expediente_id}>
                                {exp.codigo_expediente}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Técnico
                    </label>
                    <select
                        className="border rounded p-2 w-full text-blue-950"
                        value={tecnicoId}
                        onChange={(e) => setTecnicoId(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {tecnicos.map((t) => (
                            <option key={t.usuario_id} value={t.usuario_id}>
                                {t.nombre_completo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha inicio
                    </label>
                    <input
                        type="date"
                        className="border rounded p-2 w-full text-blue-950"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha fin
                    </label>
                    <input
                        type="date"
                        className="border rounded p-2 w-full text-blue-950"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                <div className="md:col-span-4 flex gap-4 mt-2">
                    <button
                        onClick={cargarIndicios}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 active:scale-95 hover:bg-blue-700 transition"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                        Buscar
                    </button>

                    <button
                        onClick={limpiarFiltros}
                        className="bg-gray-400 text-white px-4 py-2 rounded active:scale-95 hover:bg-gray-500 transition"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded p-6 border border-blue-950/20">

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left text-blue-950">
                            <th className="p-2">Indicio</th>
                            <th className="p-2">Descripción</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Color</th>
                            <th className="p-2">Expediente</th>
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
                                <td className="p-2">{i.color}</td>
                                <td className="p-2">{i.codigo_expediente}</td>
                                <td className="p-2">{i.tecnico_nombre}</td>
                                <td className="p-2">
                                    {new Date(i.fecha_registro).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!loading && indicios.length === 0 && (
                    <p className="text-center mt-4 text-gray-600">No hay indicios registrados.</p>
                )}
            </div>
        </div>
    );
}
