import * as React from "react"
import {
  GalleryVerticalEnd,
  SquareTerminal,
  UserRound,
  ChartBar,
  ShoppingBasket,
  ShoppingCart,
  PackagePlus
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { flip } from "@popperjs/core"


// This is sample data.
const data = {
  user: {
    name: "Byron Coc",
    email: "coc@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Mi Tiendita Online",
      logo: GalleryVerticalEnd,
      plan: "Admin",
    },
  ],
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
      isActive: false,
      items: [
        {
          title: "Ver Pedidos",
          url: "/admin/pedidos", 
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
          url: "/admin/catgorias/crear",
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

  ],
  projects: [

  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
