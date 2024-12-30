import React from 'react';
import PropTypes from 'prop-types';

const ProductoCard = ({ nombre, precio, proveedor,pk_id_producto }) => {
    
    const rutaImagen = `./productos/${pk_id_producto}.jpg`;
    console.log('Ruta de la imagen:', rutaImagen);

    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <img src={rutaImagen} className="card-img-top" alt={nombre} />
            <div className="card-body">
                <h5 className="card-title">{nombre}</h5>
                <p className="card-text"><strong>Precio:</strong> ${precio.toLocaleString()}</p>
                <p className="card-text"><strong>Proveedor:</strong> {proveedor}</p>
            </div>
        </div>
    );
};

ProductoCard.propTypes = {
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    proveedor: PropTypes.string.isRequired,
};

export default ProductoCard;