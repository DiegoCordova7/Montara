import {
    obtenerCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularTotal,
    contarArticulos
} from "../data/carrito.js";

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    const cartEmpty = document.getElementById("cart-empty");
    const cartSummary = document.getElementById("cart-summary");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const btnCheckout = document.getElementById("btn-checkout");
    const btnClearCart = document.getElementById("btn-clear-cart");
    const cartBadge = document.querySelector(".cart-badge");

    let lineas = [];

    function crearFila(linea, indice) {
        const { item, producto, variante, subtotal } = linea;

        const detalles = [
            variante.color ? `Color: ${variante.color}` : null,
            variante.talla ? `Talla: ${variante.talla}` : null
        ].filter(Boolean).join(" · ");

        const imagen = variante.imagen || producto.imagen;
        const alMinimo = item.cantidad <= 1;
        const alMaximo = item.cantidad >= variante.stock;

        return `
            <article class="cart-item">
                <div class="cart-item-img-box">
                    <img src="${imagen}" alt="${producto.nombre}">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${producto.nombre}</h3>
                    <p class="cart-item-variant">${detalles}</p>
                    <p class="cart-item-price">$${variante.precio} c/u</p>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn" data-accion="restar" data-indice="${indice}" aria-label="Disminuir cantidad" ${alMinimo ? "disabled" : ""}>−</button>
                        <span class="qty-value">${item.cantidad}</span>
                        <button class="qty-btn" data-accion="sumar" data-indice="${indice}" aria-label="Aumentar cantidad" ${alMaximo ? "disabled" : ""}>+</button>
                    </div>
                    <span class="cart-item-subtotal">$${subtotal}</span>
                    <button class="btn-remove" data-accion="eliminar" data-indice="${indice}">Eliminar</button>
                </div>
            </article>
        `;
    }

    function render() {
        lineas = obtenerCarrito();
        const vacio = lineas.length === 0;

        cartItems.innerHTML = lineas.map(crearFila).join("");
        cartEmpty.hidden = !vacio;
        cartSummary.hidden = vacio;

        cartCount.textContent = contarArticulos();
        cartTotal.textContent = `$${calcularTotal()}`;
        cartBadge.textContent = contarArticulos();
    }

    cartItems.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton || boton.disabled) return;

        const linea = lineas[Number(boton.dataset.indice)];
        if (!linea) return;

        const { productoId, varianteId, cantidad } = linea.item;
        const accion = boton.dataset.accion;

        if (accion === "sumar") {
            if (!cambiarCantidad(productoId, varianteId, cantidad + 1)) {
                alert("No hay más stock disponible de esta variante.");
            }
        } else if (accion === "restar") {
            cambiarCantidad(productoId, varianteId, cantidad - 1);
        } else if (accion === "eliminar") {
            eliminarDelCarrito(productoId, varianteId);
        }

        render();
    });

    btnClearCart.addEventListener("click", () => {
        if (!confirm("¿Seguro que quieres vaciar el carrito?")) return;

        vaciarCarrito();
        render();
    });

    btnCheckout.addEventListener("click", () => {
        if (lineas.length === 0) return;

        alert(`Redirigiendo al proceso de pago:\nArtículos: ${contarArticulos()}\nTotal: $${calcularTotal()}`);
    });

    render();
});