const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiPost(path: string, body: any) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Error en la petición");
    }

    return response.json();
}

export async function apiGet(path: string, token?: string) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    return response.json();
}

export async function apiPut(path: string, body: any) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Error en la petición");
    }

    return response.json();
}
