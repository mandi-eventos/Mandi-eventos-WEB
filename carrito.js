
let carrito = JSON.parse(localStorage.getItem("mandiCarrito")) || [];

function guardarCarrito() {
  localStorage.setItem("mandiCarrito", JSON.stringify(carrito));
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const cantidad = carrito.reduce(
    (total, producto) => total + (Number(producto.cantidad) || 0),
    0
  );

  contador.textContent = cantidad;
}

// Busca la imagen del juego en la tarjeta de la categoría.

function obtenerImagenProducto(nombre) {
  const normalizar = texto =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[×✕]/g, "x")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

  const nombreBuscado = normalizar(nombre);
  const tarjetas = document.querySelectorAll(".producto");

  for (const tarjeta of tarjetas) {
    const titulo = tarjeta.querySelector("h3");
    const imagen = tarjeta.querySelector("img.producto-imagen");

    if (!titulo || !imagen || !imagen.getAttribute("src")) {
      continue;
    }

    if (normalizar(titulo.textContent) === nombreBuscado) {
      return imagen.getAttribute("src");
    }
  }

  return "";
}



function agregarAlCarrito(nombre, precio = 0, imagen = "") {
  // Si no se indicó la imagen, la busca automáticamente.
  imagen = imagen || obtenerImagenProducto(nombre);

  const productoExistente = carrito.find(
    producto => producto.nombre === nombre
  );

  if (productoExistente) {
    productoExistente.cantidad++;

    // Actualiza la foto de productos que ya estaban guardados.
    if (imagen) {
      productoExistente.imagen = imagen;
    }

    if (precio > 0) {
      productoExistente.precio = precio;
    }
  } else {
    carrito.push({
      nombre: nombre,
      precio: Number(precio) || 0,
      cantidad: 1,
      imagen: imagen
    });
  }

  guardarCarrito();
  actualizarContador();

  mostrarToast(
    "¡Agregado al carrito!",
    nombre + " fue agregado a tu selección."
  );
}

function cambiarCantidad(indice, cambio) {
  if (!carrito[indice]) return;

  carrito[indice].cantidad += cambio;

  if (carrito[indice].cantidad <= 0) {
    const nombre = carrito[indice].nombre;
    carrito.splice(indice, 1);

    mostrarToast(
      "Producto eliminado",
      nombre + " fue quitado de tu selección."
    );
  }

  guardarCarrito();
  mostrarCarrito();
  actualizarContador();
}

function eliminarProducto(indice) {
  if (!carrito[indice]) return;

  const nombre = carrito[indice].nombre;
  carrito.splice(indice, 1);

  guardarCarrito();

  mostrarToast(
    "Producto eliminado",
    nombre + " fue quitado de tu selección."
  );

  mostrarCarrito();
  actualizarContador();
}

function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const vacio = document.getElementById("carrito-vacio");
  const contenido = document.getElementById("carrito-contenido");

  if (!lista || !vacio || !contenido) return;

  if (carrito.length === 0) {
    vacio.style.display = "block";
    contenido.style.display = "none";
    actualizarContador();
    return;
  }

  vacio.style.display = "none";
  contenido.style.display = "block";
  lista.innerHTML = "";

  let cantidadTotal = 0;
  let total = 0;

  carrito.forEach((producto, indice) => {
    const cantidad = Number(producto.cantidad) || 1;
    const precio = Number(producto.precio) || 0;
    const subtotal = precio * cantidad;

    cantidadTotal += cantidad;
    total += subtotal;

    const item = document.createElement("div");
    item.className = "item-carrito";

    const info = document.createElement("div");
    info.className = "item-carrito-info";

    const contenedorImagen = document.createElement("div");
    contenedorImagen.className = "item-carrito-icono";

    if (producto.imagen) {
      const foto = document.createElement("img");
      foto.src = producto.imagen;
      foto.alt = producto.nombre;
      foto.loading = "lazy";

      foto.onerror = function () {
        contenedorImagen.textContent = "🎮";
      };

      contenedorImagen.appendChild(foto);
    } else {
      contenedorImagen.textContent = "🎮";
    }

    const datos = document.createElement("div");

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;
    datos.appendChild(titulo);

    const precioTexto = document.createElement("p");

    if (precio > 0) {
      precioTexto.textContent =
        "$" + precio.toLocaleString("es-CL");
    } else {
      precioTexto.textContent = "Precio a consultar";
      precioTexto.className = "consultar";
    }

    datos.appendChild(precioTexto);

    info.appendChild(contenedorImagen);
    info.appendChild(datos);
    item.appendChild(info);

    const controles = document.createElement("div");
    controles.className = "cantidad-carrito";

    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.setAttribute("aria-label", "Restar unidad");
    menos.addEventListener("click", () => cambiarCantidad(indice, -1));

    const numero = document.createElement("strong");
    numero.textContent = cantidad;

    const mas = document.createElement("button");
    mas.type = "button";
    mas.textContent = "+";
    mas.setAttribute("aria-label", "Agregar unidad");
    mas.addEventListener("click", () => cambiarCantidad(indice, 1));

    controles.appendChild(menos);
    controles.appendChild(numero);
    controles.appendChild(mas);
    item.appendChild(controles);

    const subtotalElemento = document.createElement("div");
    subtotalElemento.className = "subtotal-carrito";
    subtotalElemento.textContent = precio > 0
      ? "$" + subtotal.toLocaleString("es-CL")
      : "Consultar";

    item.appendChild(subtotalElemento);

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.className = "eliminar-carrito";
    eliminar.textContent = "🗑️";
    eliminar.setAttribute("aria-label", "Eliminar " + producto.nombre);
    eliminar.addEventListener("click", () => eliminarProducto(indice));

    item.appendChild(eliminar);
    lista.appendChild(item);
  });

  const totalProductos = document.getElementById("total-productos");
  const totalCarrito = document.getElementById("total-carrito");

  if (totalProductos) totalProductos.textContent = cantidadTotal;

  if (totalCarrito) {
    totalCarrito.textContent = total > 0
      ? "$" + total.toLocaleString("es-CL")
      : "A consultar";
  }
}

function mostrarToast(titulo, mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const tituloElemento = document.getElementById("toast-titulo");
  const mensajeElemento = document.getElementById("toast-mensaje");

  if (tituloElemento) tituloElemento.textContent = titulo;
  if (mensajeElemento) mensajeElemento.textContent = mensaje;

  toast.classList.add("mostrar");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(cerrarToast, 3500);
}

function cerrarToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("mostrar");
}

function solicitarCotizacion() {
  if (carrito.length === 0) {
    mostrarToast(
      "Tu selección está vacía",
      "Agrega al menos un juego antes de solicitar una cotización."
    );
    return;
  }

  let mensaje =
    "Hola Mandi Eventos 👋\n\n" +
    "Quiero cotizar los siguientes juegos:\n\n";

  let totalGeneral = 0;

  carrito.forEach(producto => {
    const cantidad = Number(producto.cantidad) || 1;
    const precioUnitario = Number(producto.precio) || 0;
    const subtotal = precioUnitario * cantidad;

    totalGeneral += subtotal;

    mensaje +=
      "• " + producto.nombre +
      " x" + cantidad +
      " — " +
      (precioUnitario > 0
        ? "$" + subtotal.toLocaleString("es-CL")
        : "Precio a consultar") +
      "\n";
  });

  mensaje +=
    "\n--------------------\n" +
    "TOTAL DE JUEGOS: $" +
    totalGeneral.toLocaleString("es-CL") +
    "\n\n" +
    "Quisiera conocer disponibilidad y valor para mi evento. 😊";

  const telefono = "56935167953";

  window.open(
    "https://wa.me/" + telefono +
    "?text=" + encodeURIComponent(mensaje),
    "_blank"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarContador();
  mostrarCarrito();
}); 
