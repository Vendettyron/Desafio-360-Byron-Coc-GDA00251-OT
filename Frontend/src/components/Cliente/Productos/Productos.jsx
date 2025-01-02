import React, { useEffect, useState } from 'react';
import { obtenerProductos } from '@/services/productosService';
import { getProveedores } from '@/services/proveedoresService';
import ProductosCard from '@/components/Cliente/Productos/ProductosCard';
import { useNavigate} from 'react-router-dom';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate=useNavigate(); 

    // Crear un mapa para una búsqueda más eficiente de proveedores
    const [proveedoresMap, setProveedoresMap] = useState({});

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                console.log('Iniciando solicitud para obtener productos y proveedores...');
                const [productosData, proveedoresData] = await Promise.all([
                    obtenerProductos(),
                    getProveedores(),
                ]);
                console.log('Productos obtenidos:', productosData);
                console.log('Proveedores obtenidos:', proveedoresData);
                setProductos(productosData);
                setProveedores(proveedoresData);
                
                // Crear el mapa de proveedores
                const map = {};
                proveedoresData.forEach(proveedor => {
                    map[proveedor.pk_id_proveedor] = proveedor.nombre;
                });
                setProveedoresMap(map);

            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError('No se pudieron obtener los datos.');
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
                {error}
            </div>
        );
    }

    const handleVerProductoPorId = (id) => {
        navigate(`/cliente/productoId/${id}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Bienvenido a Mi Tiedita Online </h2>
            <div className="row">
                {productos.map(producto => (
                    <div key={producto.pk_id_producto} className="col-md-4">
                        <ProductosCard
                            nombre={producto.nombre}
                            precio={producto.precio}
                            proveedor={proveedoresMap[producto.fk_proveedor] || 'Desconocido'}
                            pk_id_producto={producto.pk_id_producto}
                            onClick={() => handleVerProductoPorId(producto.pk_id_producto)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Productos;
