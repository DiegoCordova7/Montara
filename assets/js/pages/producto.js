import { buscarProductoPorId } from "../data/productos.js";

document.addEventListener("DOMContentLoaded", () => {
    const producto = buscarProductoPorId(101);
    if (!producto) throw new Error("No se encontró el producto.");

    const colorButtons = document.querySelectorAll(".color-btn");
    const sizeButtons = document.querySelectorAll(".size-btn");
    const activeProductImg = document.getElementById("active-product-img");
    const productPrice = document.getElementById("product-price");
    const selectedColorName = document.getElementById("selected-color-name");
    const specColorVal = document.getElementById("spec-color-val");
    const selectedSizeName = document.getElementById("selected-size-name");
    const btnAddCart = document.getElementById("btn-add-cart");
    const btnBuyNow = document.getElementById("btn-buy-now");
    const cartBadge = document.querySelector(".cart-badge");

    let colorSeleccionado = document.querySelector(".color-btn.active")?.dataset.color ?? "Blanco";
    let tallaSeleccionada = document.querySelector(".size-btn.active")?.dataset.size ?? "CH";
    let varianteSeleccionada = null;
    let cartCount = Number(cartBadge.textContent) || 0;

    function buscarVariante(color, talla) {
        return producto.variantes.find(variante =>
            variante.color === color && variante.talla === talla
        ) ?? null;
    }

    function actualizarVista() {
        const variante = buscarVariante(colorSeleccionado, tallaSeleccionada);

        if (!variante) {
            alert("Esta combinación de color y talla no existe.");
            return false;
        }

        varianteSeleccionada = variante;
        activeProductImg.src = variante.imagen || producto.imagen;
        productPrice.textContent = `$${variante.precio}`;
        selectedColorName.textContent = variante.color;
        specColorVal.textContent = variante.color;
        selectedSizeName.textContent = variante.talla;

        colorButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.color === variante.color);
        });

        sizeButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.size === variante.talla);
        });

        btnAddCart.disabled = !variante.estaDisponible();
        btnBuyNow.disabled = !variante.estaDisponible();

        return true;
    }

    colorButtons.forEach(button => {
        button.addEventListener("click", () => {
            const colorAnterior = colorSeleccionado;
            colorSeleccionado = button.dataset.color;

            if (!actualizarVista()) colorSeleccionado = colorAnterior;
            actualizarVista();
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const tallaAnterior = tallaSeleccionada;
            tallaSeleccionada = button.dataset.size;

            if (!actualizarVista()) tallaSeleccionada = tallaAnterior;
            actualizarVista();
        });
    });

    btnAddCart.addEventListener("click", () => {
        if (!varianteSeleccionada?.estaDisponible()) return;

        cartCount++;
        cartBadge.textContent = cartCount;

        alert(`¡Producto agregado al carrito!\n${producto.nombre}\nColor: ${varianteSeleccionada.color}\nTalla: ${varianteSeleccionada.talla}\nPrecio: $${varianteSeleccionada.precio}`);
    });

    btnBuyNow.addEventListener("click", () => {
        if (!varianteSeleccionada?.estaDisponible()) return;

        alert(`Redirigiendo al proceso de pago:\n${producto.nombre}\nColor: ${varianteSeleccionada.color}\nTalla: ${varianteSeleccionada.talla}\nPrecio: $${varianteSeleccionada.precio}`);
    });

    actualizarVista();
});