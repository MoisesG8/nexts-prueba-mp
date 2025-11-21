"use client";

export default function Dashboard() {
    const username =
        typeof window !== "undefined"
            ? localStorage.getItem("username")
            : "";


    return (
        <div>
            <h1 className="text-3xl font-bold text-blue-950 mb-4">
                Bienvenido, {username}
            </h1>

            <p className="text-gray-700">
                Selecciona una opción del menú lateral para continuar.
            </p>
        </div>
    );
}
