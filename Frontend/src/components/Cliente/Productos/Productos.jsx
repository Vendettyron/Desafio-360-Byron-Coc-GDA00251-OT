import React, { useEffect, useState } from 'react';
import { obtenerProductosActivos } from '@/services/productosService';
import { getProveedores } from '@/services/proveedoresService';
import ProductosCard from '@/components/Cliente/Productos/ProductosCard';
import { useNavigate} from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cargando, setCargando] = useState(20);
    const [error, setError] = useState('');
    const navigate=useNavigate(); 

    // Crear un mapa para una búsqueda más eficiente de proveedores
    const [proveedoresMap, setProveedoresMap] = useState({});

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                setCargando(50);
                console.log('Iniciando solicitud para obtener productos y proveedores...');
                const [productosData, proveedoresData] = await Promise.all([
                    obtenerProductosActivos(),
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
                setCargando(80);
            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError('No se pudieron obtener los datos.');
            } finally {
                setCargando(100);
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    if (loading) {
        return (
            <Progress value={cargando} />
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
            <h2 className="text-center mb-10 text-black font-bold text-3xl">Catalogo de productos</h2>
            <div className=""  id="catalogo">
                {productos.map(producto => (
                    <div key={producto.pk_id_producto} >
                        <ProductosCard
                            nombre={producto.nombre}
                            precio={producto.precio}
                            proveedor={proveedoresMap[producto.fk_proveedor] || 'Desconocido'}
                            pk_id_producto={producto.pk_id_producto}
                            stock={producto.stock}
                            onClick={() => handleVerProductoPorId(producto.pk_id_producto)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Productos;
