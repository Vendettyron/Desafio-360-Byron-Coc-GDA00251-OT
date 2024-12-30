/**
 * Formatea el nombre del producto para que coincida con el nombre del archivo de imagen.
 * Reemplaza espacios y elimina caracteres especiales.
 * @param {string} nombre - Nombre del producto.
 * @returns {string} - Nombre del archivo de imagen.
 */
export const formatNombreImagen = (nombre) => {
    return nombre
        .toLowerCase()
        .replace(/ /g, '_') // Reemplaza espacios por guiones bajos
        .replace(/[áéíóúüñ]/g, (match) => {
            const acentos = {
                'á': 'a',
                'é': 'e',
                'í': 'i',
                'ó': 'o',
                'ú': 'u',
                'ü': 'u',
                'ñ': 'n'
            };
            return acentos[match] || match;
        })
        .replace(/[^a-z0-9_]/g, ''); // Elimina caracteres no alfanuméricos excepto guiones bajos
};
