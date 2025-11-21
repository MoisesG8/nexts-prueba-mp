"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Folder,
    FilePlus,
    FileSearch,
    BarChart3,
    LogOut,
    SquarePlus
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";


const SidebarItem = ({
    icon: Icon,
    label,
    href,
    active,
}: {
    icon: any;
    label: string;
    href: string;
    active: boolean;
}) => (
    <a
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all
            ${active
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-blue-800 hover:text-white"
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </a>
);

export default function PanelLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");
        setLoaded(true);
    }, []);

    if (!loaded) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-blue-950 text-white flex flex-col py-6">
                <h2 className="text-2xl font-bold px-6 mb-6">MP Panel</h2>

                <nav className="flex-1 flex flex-col gap-2 px-3">

                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        href="/dashboard"
                        active={pathname === "/dashboard"}
                    />

                    <SidebarItem
                        icon={Folder}
                        label="Expedientes"
                        href="/expedientes"
                        active={pathname.startsWith("/expedientes")}
                    />

                    <SidebarItem
                        icon={FilePlus}
                        label="Crear Expediente"
                        href="/expedientes/crear"
                        active={pathname === "/expedientes/crear"}
                    />

                    <SidebarItem
                        icon={FileSearch}
                        label="Indicios"
                        href="/indicios"
                        active={pathname.startsWith("/indicios")}
                    />

                    <SidebarItem
                        icon={SquarePlus}
                        label="Agregar Indicios"
                        href="/indicios/crear"
                        active={pathname === "/indicios/crear"}
                    />

                    <SidebarItem
                        icon={BarChart3}
                        label="Reportes"
                        href="/reportes"
                        active={pathname.startsWith("/reportes")}
                    />
                </nav>

                {/* Logout */}
                <button
                    onClick={() => {
                        localStorage.clear();
                        router.push("/login");
                    }}
                    className="flex items-center gap-3 px-6 py-3 mt-auto text-gray-300 hover:text-white hover:bg-blue-800 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
