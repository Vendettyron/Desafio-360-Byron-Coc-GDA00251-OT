import React from 'react';
import PropTypes from 'prop-types';

const ProductosCard = ({ nombre, precio, proveedor, pk_id_producto, stock, onClick, imageTimestamp }) => {
    // Añadir el timestamp como parámetro de consulta para evitar la caché
    const rutaImagen = `/assets/productos/${pk_id_producto}.jpg?ts=${imageTimestamp}`;
    const rutaImagenDefault = '/assets/productos/default.jpg';

    const handleImageError = (e) => {
        e.target.src = rutaImagenDefault;
    };

    return (
        <div id="productoCard">
            <button
                className="bg-white border border-gray-200 rounded-md shadow-2xl dark:bg-gray-800 dark:border-gray-700"
                onClick={onClick}
            >
                <img
                    src={rutaImagen}
                    onError={handleImageError}
                    className="p-8 rounded-t-lg w-full h-full"
                    alt={nombre}
                />
                <div className="flex flex-col items-center space-x-1 rtl:space-x-reverse">
                    <p className="text-left text-neutral-500 font-light text-sm">{proveedor}</p>
                    <h5 className="">{nombre}</h5>
                    {stock > 0 ? (
                        <p className="font-bold text-gray-800">Q{precio.toLocaleString()}</p>
                    ) : (
                        <p className="text-left text-neutral-500 font-light text-sm">No Disponible</p>
                    )}
                </div>
            </button>
        </div>
    );
};

ProductosCard.propTypes = {
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    proveedor: PropTypes.string.isRequired,
    pk_id_producto: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    imageTimestamp: PropTypes.number.isRequired, // Definir el tipo de prop
};

export default ProductosCard;
