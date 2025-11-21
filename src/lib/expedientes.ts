import { apiGet } from "@/lib/api";

export async function obtenerExpedientes(filtros: string[] = [], url: string) {

    if (filtros.length > 0) {
        url += "?" + filtros.join("&");
    }
    return apiGet(url);
}

export async function descargarReportePDF(filtros: {
    estado_id?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}): Promise<void> {
    try {

        const params = new URLSearchParams();
        if (filtros.estado_id) params.append('estado_id', filtros.estado_id);
        if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
        if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);

        const queryString = params.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/expedientes/reporte/pdf${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Error al generar el reporte');
        }

        const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        const fecha = new Date().toISOString().split('T')[0];
        link.download = `reporte-expedientes-${fecha}.pdf`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error('Error al descargar reporte:', error);
        throw error;
    }
}