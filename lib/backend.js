var productos = [
  {
    id: 1,
    nombre: "Pan",
    idCategoria: 1,
    precioVenta: 500,
    activo: true,
  },
  {
    id: 2,
    nombre: "Jamon",
    idCategoria: 1,
    precioVenta: 2500,
    activo: true,
  },
  {
    id: 3,
    nombre: "Laptop",
    idCategoria: 2,
    precioVenta: 5000000,
    activo: true,
  },
];

var categorias = [
  {
    id: 1,
    nombre: "Comida",
    activo: true,
  },
  {
    id: 2,
    nombre: "Tecnologia",
    activo: true,
  },
];

var carrito = [];

var ventas = [
  {
    idVenta: 1,
    fecha: "4/11/2024",
    idCliente: 1,
    total: 20000,
  },
];

var detalleVentas = [
  {
    idVenta: 1,
    idDetalleVenta: 1,
    idProducto: 1,
    cantidad: 5,
    precio: 2500,
  },
  {
    idVenta: 1,
    idDetalleVenta: 2,
    idProducto: 2,
    cantidad: 7,
    precio: 17500,
  },
];

var clientes = [
  {
    id: 1,
    cedula: 5537788,
    nombre: "Francisco",
    apellido: "Cabañas",
  },
];

//    Productos

export function getProductos() {
  return productos;
}

export function getOneProducto(id) {
  return productos.filter((item) => item.id === parseInt(id))[0];
}

export function addProducto(producto) {
  productos.push({
    ...producto,
    id: productos.length + 1,
    activo: true,
  });
  return productos;
}

export function editProducto(productoEditado) {
  productos[parseInt(productoEditado.id - 1)] = {
    id: parseInt(productoEditado.id),
    nombre: productoEditado.nombre,
    idCategoria: parseInt(productoEditado.idCategoria),
    precioVenta: productoEditado.precioVenta,
    activo: true,
  };
  return productos;
}

export function deleteProducto(producto) {
  productos[parseInt(producto.id) - 1] = {
    id: parseInt(producto.id),
    activo: false,
    nombre: productos[parseInt(producto.id) - 1].nombre,
    idCategoria: productos[parseInt(producto.id) - 1].idCategoria,
  };

  return productos;
}

export function filtrarProductos(filtro) {
  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((item) =>
    // eslint-disable-next-line prettier/prettier
    item?.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // Filtrar categorías por nombre
  const categoriasFiltradas = categorias.filter((item) =>
    // eslint-disable-next-line prettier/prettier
    item?.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // Si no hay categorías filtradas, retornar solo productos filtrados por nombre
  if (categoriasFiltradas.length === 0) {
    return productosFiltrados;
  }

  // Obtener productos por categoría
  const productosPorCategoria = productos.filter((item1) =>
    // eslint-disable-next-line prettier/prettier
    categoriasFiltradas.some((item2) => item2.id === item1?.idCategoria)
  );

  // Si no hay productos por categoría, retornar solo productos filtrados por nombre
  if (productosPorCategoria.length === 0) {
    return productosFiltrados;
  }

  // Combinar ambos arrays y eliminar duplicados usando un Map para mantener solo la última ocurrencia
  const productosMap = new Map();

  // Agregar primero los productos filtrados por nombre
  productosFiltrados.forEach((producto) => {
    productosMap.set(producto.id, producto);
  });

  // Agregar los productos por categoría
  productosPorCategoria.forEach((producto) => {
    productosMap.set(producto.id, producto);
  });

  // Convertir el Map de vuelta a array
  return Array.from(productosMap.values());
}

//    Categoria

export function getCategorias() {
  return categorias;
}

export function addCategoria(categoria) {
  categorias.push({
    ...categoria,
    id: categorias.length + 1,
    activo: true,
  });
  return categorias;
}

export function editCategoria(categoriaEditado) {
  categorias[parseInt(categoriaEditado.id - 1)] = {
    id: parseInt(categoriaEditado.id),
    nombre: categoriaEditado.nombre,
    activo: true,
  };
  return categorias;
}

export function deleteCategoria(categoria) {
  categorias[parseInt(categoria.id) - 1] = {
    id: parseInt(categoria.id),
    activo: false,
    nombre: categorias[parseInt(categoria.id) - 1].nombre,
  };
  console.log("categorias", categorias);
  return categorias;
}

export function filtrarCategorias(filtro) {
  return categorias.filter((item) =>
    // eslint-disable-next-line prettier/prettier
    item?.nombre.toLowerCase().includes(filtro.toLowerCase())
  );
}

//    Carrito

export function getCarrito() {
  return carrito;
}

export function resetCarrito() {
  carrito = [];
}

export function addProductoCarrito(producto) {
  carrito.push({
    id: producto.id,
    cantidad: producto.cantidad,
    precio: producto.precio,
  });
  return carrito;
}

//    Venta

export function guardarVenta(data) {
  //Argumento modelo
  //data= {
  //  productos: [
  //    {
  //      idProducto: 1,
  //      cantidad: 2,
  //      precio: 5000
  //    }
  //  ]
  //  venta: {
  //    idCliente: 1,
  //    total: 15000
  //  }
  //}

  const fechaActual = new Date();

  const dia = String(fechaActual.getDate()).padStart(2, "0");
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
  const anio = fechaActual.getFullYear();

  const fechaFormateada = `${dia}/${mes}/${anio}`;

  ventas.push({
    idVenta: ventas.length + 1,
    fecha: fechaFormateada,
    idCliente: data.venta.idCliente,
    total: data.venta.total,
  });

  for (const producto of data.productos) {
    detalleVentas.push({
      idVenta: ventas.length,
      idDetalleVenta: detalleVentas.length + 1,
      idProducto: parseInt(producto.idProducto),
      cantidad: producto.cantidad,
      precio: producto.precio,
    });
  }
  console.log(ventas);
}

export function filtrarVenta(opcion, filtro) {
  let resultado = [];
  if (filtro === "") {
    return ventas;
  }

  if (opcion === "fecha") {
    resultado = ventas.filter((item) => item.fecha.includes(filtro));
    return resultado;
  } else if (opcion === "cliente") {
    const nombreApellidoFiltro = clientes.filter(
      (item) =>
        item.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        // eslint-disable-next-line prettier/prettier
        item.apellido.toLowerCase().includes(filtro.toLowerCase())
    );

    let cedulaFiltro = [];
    if (!isNaN(filtro) && !filtro.includes(" ")) {
      const filtroNum = filtro;
      cedulaFiltro = clientes.filter(
        // eslint-disable-next-line prettier/prettier
        (item) => item.cedula.toString().includes(filtroNum)
      );
    }

    // Combinar los resultados de nombre/apellido y cédula, eliminando duplicados
    const clientesFiltrados = Array.from(
      // eslint-disable-next-line prettier/prettier
      new Set([...nombreApellidoFiltro, ...cedulaFiltro])
    );

    // Obtener las ventas de los clientes filtrados
    resultado = ventas.filter((item1) =>
      // eslint-disable-next-line prettier/prettier
      clientesFiltrados.some((item2) => item2.id === item1.idCliente)
    );
  }

  return resultado;
}

export function getDetallesVenta(idVenta) {
  return detalleVentas.filter((item) => item.idVenta === parseInt(idVenta));
}

//    Cliente

export function clienteExists(cedula) {
  for (const cliente of clientes) {
    if (cliente.cedula === cedula) {
      return true;
    }
  }
  return false;
}

export function getOneCliente(cedula) {
  for (const cliente of clientes) {
    if (cliente.cedula === parseInt(cedula)) {
      return cliente;
    }
  }
  return null;
}

export function getClientes() {
  return clientes;
}

export function addCliente(cliente) {
  const res = {
    ...cliente,
    id: clientes.length + 1,
  };
  clientes.push(res);
  return res;
}
