import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.scss"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { auth, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  const handlePerfiles = () => {
    navigate("/cliente/perfil");
  };

  const handleEliminarCuenta = () => {  
    navigate("/cliente/eliminarCuenta");
  };
   // Redirigir a la página de inicio de sesión 
  const handleCerrarSesion = () => {
    logoutUser();
    navigate('/login'); 
  };



  return (
    <header className="header">
      <div className="header__content">
        <Link to="/cliente" className="header__content__logo">
          Mi Tiendita Online
        </Link>
        <nav
          className={`${"header__content__nav"} 
          ${menuOpen && size.width < 768 ? `${"isMenu"}` : ""} 
          }`}
        >
          <ul>
            <li>
              <Link to ="/cliente">Productos</Link>
            </li>
            <li>
              <Link to="/cliente/pedidos">Historial Pedidos</Link>
            </li>
            <li >
              <DropdownMenu style={"z-index: 1000;"} >
              <DropdownMenuTrigger>Perfil</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Juan Perez</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePerfiles} >Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEliminarCuenta}>Eliminar Cuenta</DropdownMenuItem>
                <DropdownMenuItem onClick={handleCerrarSesion}>Cerrar Sesion</DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <button className="btn">
              <Link to="/cliente/carrito">
                <ShoppingCart className="shopping-cart-icon"/>
              </Link>
            </button>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;