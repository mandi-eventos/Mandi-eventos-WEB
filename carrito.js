let carrito = JSON.parse(localStorage.getItem("mandiCarrito")) || [];


function guardarCarrito() {
  localStorage.setItem(
    "mandiCarrito",
    JSON.stringify(carrito)
  );
}


function actualizarContador() {

  const contador = document.getElementById("contador-carrito");

  if (!contador) return;

  const cantidad = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  contador.textContent = cantidad;
}


function agregarAlCarrito(nombre, precio = 0) {

  const productoExistente = carrito.find(
    producto => producto.nombre === nombre
  );


  if (productoExistente) {

    productoExistente.cantidad++;

  } else {

    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
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

  if (!lista) return;


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

    cantidadTotal += producto.cantidad;
    total += producto.precio * producto.cantidad;


    const item = document.createElement("div");

    item.className = "item-carrito";


    const subtotal =
      producto.precio * producto.cantidad;


    item.innerHTML = `

      <div class="item-carrito-info">

        <div class="item-carrito-icono">
          🎮
        </div>

        <div>

          <h3>${producto.nombre}</h3>

          ${
            producto.precio > 0
            ? `<p>$${producto.precio.toLocaleString("es-CL")}</p>`
            : `<p class="consultar">Precio a consultar</p>`
          }

        </div>

      </div>


      <div class="cantidad-carrito">

        <button
          onclick="cambiarCantidad(${indice}, -1)"
        >
          −
        </button>

        <strong>
          ${producto.cantidad}
        </strong>

        <button
          onclick="cambiarCantidad(${indice}, 1)"
        >
          +
        </button>

      </div>


      <div class="subtotal-carrito">

        ${
          producto.precio > 0
          ? `$${subtotal.toLocaleString("es-CL")}`
          : "Consultar"
        }

      </div>


      <button
        class="eliminar-carrito"
        onclick="eliminarProducto(${indice})"
        aria-label="Eliminar ${producto.nombre}"
      >
        🗑️
      </button>

    `;


    lista.appendChild(item);

  });


  document.getElementById(
    "total-productos"
  ).textContent = cantidadTotal;


  document.getElementById(
    "total-carrito"
  ).textContent =
    total > 0
      ? "$" + total.toLocaleString("es-CL")
      : "A consultar";

}


function mostrarToast(titulo, mensaje) {

  const toast = document.getElementById("toast");

  if (!toast) return;


  document.getElementById(
    "toast-titulo"
  ).textContent = titulo;


  document.getElementById(
    "toast-mensaje"
  ).textContent = mensaje;


  toast.classList.add("mostrar");


  clearTimeout(window.toastTimer);


  window.toastTimer = setTimeout(
    cerrarToast,
    3500
  );

}


function cerrarToast() {

  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.classList.remove("mostrar");

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
    "Hola Mandi Eventos 👋%0A%0A" +
    "Quiero cotizar los siguientes juegos:%0A%0A";


  carrito.forEach(producto => {

    mensaje +=
      "• " +
      producto.nombre +
      " x" +
      producto.cantidad +
      "%0A";

  });


  mensaje +=
    "%0AQuisiera conocer disponibilidad y valor para mi evento. 😊";


  /*
    Aquí después pondremos tu número real de WhatsApp.
  */

  const telefono = "";


  if (!telefono) {

    mostrarToast(
      "¡Tu selección está lista!",
      "Después conectaremos este botón con tu WhatsApp."
    );

    return;

  }


  window.open(
    "https://wa.me/" +
    telefono +
    "?text=" +
    mensaje,
    "_blank"
  );

}


document.addEventListener(
  "DOMContentLoaded",
  function() {

    actualizarContador();
    mostrarCarrito();

  }
);
