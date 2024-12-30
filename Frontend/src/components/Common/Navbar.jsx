import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.scss"; 

function Navbar() {
  const navigate = useNavigate();
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
              <Link to="/cliete">Productos</Link>
            </li>
            <li>
              <Link to="/profile">Ver pedidos pendientes</Link>
            </li>
              <Link to="/cart">
                <ShoppingCart className="shopping-cart-icon" />
              </Link>
              <Link to="/login">
                <button className="btn btn__login">Log Out</button>
              </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;