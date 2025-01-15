import Estado from './Estado.js';
import Rol from './Rol.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Proveedor from './Proveedor.js';
import Producto from './Producto.js';
import Pedido from './Pedido.js';
import DetallePedido from './DetallePedido.js';
import Carrito from './Carrito.js';
import DetalleCarrito from './DetalleCarrito.js';
import Log from './Log.js';

/**
 * Definición de todas las asociaciones entre modelos
 */

// 1. Estado (1)---(N) Categorias
Categoria.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Categoria, {
  foreignKey: 'fk_estado',
});

// 2. Estado (1)---(N) Usuarios
Usuario.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Usuario, {
  foreignKey: 'fk_estado',
});

// 3. Rol (1)---(N) Usuarios
Usuario.belongsTo(Rol, {
  foreignKey: 'fk_rol',
});
Rol.hasMany(Usuario, {
  foreignKey: 'fk_rol',
});

// 4. Estado (1)---(N) Proveedor
Proveedor.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Proveedor, {
  foreignKey: 'fk_estado',
});

// 5. Estado (1)---(N) Productos
Producto.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Producto, {
  foreignKey: 'fk_estado',
});

// 6. Proveedor (1)---(N) Productos
Producto.belongsTo(Proveedor, {
  foreignKey: 'fk_proveedor',
});
Proveedor.hasMany(Producto, {
  foreignKey: 'fk_proveedor',
});

// 7. Categoria (1)---(N) Productos
Producto.belongsTo(Categoria, {
  foreignKey: 'fk_categoria',
});
Categoria.hasMany(Producto, {
  foreignKey: 'fk_categoria',
});

// 8. Estado (1)---(N) Pedidos
Pedido.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Pedido, {
  foreignKey: 'fk_estado',
});

// 9. Usuario (1)---(N) Pedidos
Pedido.belongsTo(Usuario, {
  foreignKey: 'fk_cliente',
});
Usuario.hasMany(Pedido, {
  foreignKey: 'fk_cliente',
});

// 10. Pedido (1)---(N) DetallePedido
DetallePedido.belongsTo(Pedido, {
  foreignKey: 'fk_id_pedido',
});
Pedido.hasMany(DetallePedido, {
  foreignKey: 'fk_id_pedido',
});

// 12. Usuario (1)---(N) Carrito
Carrito.belongsTo(Usuario, {
  foreignKey: 'fk_id_usuario',
});
Usuario.hasMany(Carrito, {
  foreignKey: 'fk_id_usuario',
});

// 13. Estado (1)---(N) Carrito
Carrito.belongsTo(Estado, {
  foreignKey: 'fk_estado',
});
Estado.hasMany(Carrito, {
  foreignKey: 'fk_estado',
});

// 14. Carrito (1)---(N) DetalleCarrito
DetalleCarrito.belongsTo(Carrito, {
  foreignKey: 'fk_id_carrito',
});
Carrito.hasMany(DetalleCarrito, {
  foreignKey: 'fk_id_carrito',
});

// 15. Producto (1)---(N) DetalleCarrito
DetalleCarrito.belongsTo(Producto, {
  foreignKey: 'fk_id_producto',
  as: 'ProductoDetalleCarrito',
});
Producto.hasMany(DetalleCarrito, {
  foreignKey: 'fk_id_producto',
});

// 11. Producto (1)---(N) DetallePedido
DetallePedido.belongsTo(Producto, {
  foreignKey: 'fk_id_producto',
  as: 'ProductoDetallePedido',
});
Producto.hasMany(DetallePedido, {
  foreignKey: 'fk_id_producto',
});

Log.belongsTo(Usuario, {
  foreignKey: 'fk_id_usuario',
});
Usuario.hasMany(Log, {
  foreignKey: 'fk_id_usuario',
});

export {
  Estado,
  Rol,
  Categoria,
  Usuario,
  Proveedor,
  Producto,
  Pedido,
  DetallePedido,
  Carrito,
  DetalleCarrito,
  Log
};
