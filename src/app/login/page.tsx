"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await apiPost("/auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("username", response.user.username);
            localStorage.setItem("rol_id", response.user.rol_id);
            localStorage.setItem("usuario_id", response.user.usuario_id);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-lg w-96"
            >
                <h2 className="text-2xl text-blue-950 font-bold mb-4 text-center">Iniciar Sesión</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-sm text-blue-950 font-semibold">Usuario</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded text-neutral-950"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm text-blue-950 font-semibold">Contraseña</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded text-neutral-950"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
