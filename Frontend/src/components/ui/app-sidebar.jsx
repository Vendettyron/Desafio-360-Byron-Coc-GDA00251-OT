import React, { useContext } from "react";
import {
  GalleryVerticalEnd,
  SquareTerminal,
  UserRound,
  ChartBar,
  ShoppingBasket,
  ShoppingCart,
  PackagePlus,
  NotebookText
} from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavProjects } from "@/components/ui/nav-projects";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { AuthContext } from "@/context/AuthContext";

export function AppSidebar({ ...props }) {
  const { auth } = useContext(AuthContext);

  // Verifica si el usuario está autenticado y tiene los datos necesarios
  const usuarioAutenticado = auth?.usuario;

  // Define el objeto 'data' dentro del componente para usar datos dinámicos
  const data = {
    user: {
      name: usuarioAutenticado?.nombre || "Usuario", // Reemplaza 'nombre' según tu estructura de AuthContext
      email: usuarioAutenticado?.correo || "usuario@example.com", // Reemplaza 'email' según tu estructura de AuthContext
      avatar: usuarioAutenticado?.avatar || "/avatars/default.jpg", // Reemplaza 'avatar' según tu estructura de AuthContext
    },
    teams: [
      {
        name: "Mi Tiendita Online",
        logo: GalleryVerticalEnd,
        plan: "Admin",
      },
    ],
    // Define las secciones de la barra lateral
    navMain: [
      {
        title: "Proveedores",
        url: "#",
        icon: PackagePlus,
        isActive: false,
        items: [
          {
            title: "Ver Proveedores",
            url: "/admin/proveedores",
          },
          {
            title: "Crear Proveedor",
            url: "/admin/proveedores/crear",
          },
        ],
      },
      {
        title: "Estados",
        url: "#",
        icon: SquareTerminal,
        isActive: false,
        items: [
          {
            title: "Ver Estados",
            url: "/admin/estados",
          },
          {
            title: "Crear Estados",
            url: "/admin/estados/crear",
          },
        ],
      },
      {
        title: "Pedidos",
        url: "#",
        icon: ShoppingCart,
        isActive: true,
        items: [
          {
            title: "Ver Pedidos",
            url: "/admin/pedido",
          },
        ],
      },
      {
        title: "Productos",
        url: "#",
        icon: ShoppingBasket,
        isActive: false,
        items: [
          {
            title: "Ver Productos",
            url: "/admin/productos",
          },
          {
            title: "Crear Producto",
            url: "/admin/productos/crear",
          },
        ],
      },
      {
        title: "Categorias",
        url: "#",
        icon: ChartBar,
        isActive: false,
        items: [
          {
            title: "Ver Categorias",
            url: "/admin/categorias",
          },
          {
            title: "Crear Categoria",
            url: "/admin/categorias/crear",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: UserRound,
        isActive: false,
        items: [
          {
            title: "Ver Usuarios",
            url: "/admin/usuarios",
          },
          {
            title: "Crear Usuario",
            url: "/admin/usuarios/crear",
          },
        ],
      },
      {
        title: "Log",
        url: "#",
        icon: NotebookText,
        isActive: false,
        items: [
          {
            title: "Ver Log",
            url: "/admin/log",
          },
        ],
      },
    ],
    projects: [],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        {/* Dropdowns */}
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {/* Información del Usuario y Cerrar Sesión */}
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
