// src/components/ProductoPorId.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { obtenerProductoPorId } from "@/services/productosService";
import { obtenerProveedorPorId } from "@/services/proveedoresService";
import { agregarProductoAlCarrito } from "@/services/carritoService";
import toast from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";

//componentes reutilizables
import { CirclePlus, CircleMinus } from "lucide-react";
import FormInput from "@/components/Forms/FormInput";
import { set } from "react-hook-form";
import { Progress } from "@/components/ui/progress";

const ProductoPorId = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la ruta
  const [producto, setProducto] = useState({});
  const [proveedor, setProveedor] = useState({});
  const [cantidad, setCantidad] = useState(1); // Cantidad inicial
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState("");
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const { auth } = useContext(AuthContext); // Acceder al contexto de autenticación

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener detalles del producto
        setCargando(50);
        const productoData = await obtenerProductoPorId(id);
        setProducto(productoData);
        console.log("Datos del producto obtenidos:", productoData);

        // Verificar si el producto tiene un proveedor asociado
        if (productoData.fk_proveedor) {
          const proveedorData = await obtenerProveedorPorId(
            productoData.fk_proveedor
          );
          setProveedor(proveedorData);
          console.log("Datos del proveedor obtenidos:", proveedorData);
        } else {
          setProveedor({});
          console.log("No se encontró proveedor para este producto.");
        }
        setCargando(80);
      } catch (err) {
        setError(err.message || "Error al cargar los datos del producto.");
        toast.error(err.message || "Error al cargar los datos del producto.");
      } finally {
        setCargando(100);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Funciones para incrementar y decrementar la cantidad
  const incrementarCantidad = () => {
    setCantidad((prev) => (prev < producto.stock ? prev + 1 : prev));
  };

  const decrementarCantidad = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Función para agregar al carrito
  const handleAgregarAlCarrito = async () => {
    if (!auth.token) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      await agregarProductoAlCarrito(producto.pk_id_producto, cantidad);
      toast.success("Producto agregado al carrito exitosamente.");
    } catch (err) {
      toast.error(err.message || "Error al agregar el producto al carrito.");
    }
  };

  // Renderizado condicional

  if (loading) {
    return <Progress value={cargando} />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // Verificar el stock del producto
  const estaDisponible = producto.stock > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        {/* Imagen del Producto */}
        <div className="md:w-1/2 flex flex-col items-center content-center justify-center">
          <img
            src={`/assets/productos/${id}.jpg?t=${imageTimestamp}`}
            alt={producto.nombre || "Imagen del producto"}
            className=" w-2/3 h-auto "
            onError={(e) => (e.target.src = "/assets/productos/default.jpg")}
          />
        </div>

        {/* Información del Producto */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">{producto.nombre}</h2>
            {proveedor.nombre && (
              <p className="text-gray-800 mb-4 ">
                <strong className="font-semibold">Proveedor:</strong>{" "}
                {proveedor.nombre}
              </p>
            )}
            <p className="text-gray-700 mb-4 font-normal  ">
              {producto.descripcion}
            </p>

            <p className="text-gray-800 mb-4">
              <strong className="font-semibold">Stock:</strong> {producto.stock}
            </p>

            <p className="text-gray-800 mb-4 font-bold text-2xl ">
              <p className="font-semibold">Precio:</p> Q
              {producto.precio.toLocaleString()}
            </p>
          </div>

          {/* Renderizado Condicional basado en el Stock */}
          {estaDisponible ? (
            <>
              {/* Gestión de Cantidad */}
              <div className="flex items-center mb-4 ml-4">
                <button
                  onClick={decrementarCantidad}
                  className="btn-plus-minus"
                  aria-label="Decrementar cantidad"
                >
                  <CircleMinus></CircleMinus>
                </button>
                <FormInput
                  type="text"
                  value={cantidad}
                  readOnly
                  className="px-2 py-2 max-w-20 text-center border-t border-b border-gray-200 -mb-5 "
                  aria-label="Cantidad"
                />
                <button
                  onClick={incrementarCantidad}
                  className={`btn-plus-minus ${
                    cantidad >= producto.stock
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Incrementar cantidad"
                  disabled={cantidad >= producto.stock}
                >
                  <CirclePlus></CirclePlus>
                </button>
              </div>

              {/* Botón de Añadir al Carrito */}
              <button
                id="btnAgregarCarrito"
                onClick={handleAgregarAlCarrito}
                className="w-full text-white py-2 rounded transition-colors"
              >
                Añadir al carrito
              </button>
            </>
          ) : (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              Producto No disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoPorId;
