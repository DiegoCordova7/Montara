import { agregarAlCarrito, contarArticulos } from "../data/carrito.js";
import { buscarProductoPorId, productos } from "../data/productos.js";

document.addEventListener("DOMContentLoaded", () => {
    const idProducto = Number(new URLSearchParams(location.search).get("id")) || 101;
    const producto = buscarProductoPorId(idProducto);
    if (!producto) throw new Error("No se encontró el producto.");

    document.title = `Montara - ${producto.nombre}`;

    const productTitle = document.getElementById("product-title");
    const activeProductImg = document.getElementById("active-product-img");
    const productPrice = document.getElementById("product-price");
    const selectedColorName = document.getElementById("selected-color-name");
    const selectedSizeName = document.getElementById("selected-size-name");
    const colorContainer = document.getElementById("color-options-container");
    const sizeContainer = document.getElementById("size-options-container");
    const specsContainer = document.getElementById("specs-container");
    const btnAddCart = document.getElementById("btn-add-cart");
    const btnBuyNow = document.getElementById("btn-buy-now");
    const cartBadge = document.querySelector(".cart-badge");
    const comparatorContainer = document.getElementById("comparator-container");

    if (productTitle) productTitle.textContent = producto.nombre;

    const coloresDisponibles = [...new Set(producto.variantes.map(v => v.color))];
    const tallasDisponibles = [...new Set(producto.variantes.map(v => v.talla))];

    let colorSeleccionado = coloresDisponibles[0] || "Blanco";
    let tallaSeleccionada = tallasDisponibles.includes("CH") ? "CH" : (tallasDisponibles[0] || "M");
    let varianteSeleccionada = null;

    if (cartBadge) {
        cartBadge.textContent = contarArticulos();
    }

    function buscarVariante(color, talla) {
        return producto.variantes.find(variante =>
            variante.color === color && variante.talla === talla
        ) ?? null;
    }

    function renderizarColores() {
        if (!colorContainer) return;
        colorContainer.innerHTML = "";

        coloresDisponibles.forEach(color => {
            const varianteRef = producto.variantes.find(v => v.color === color);
            const imgUrl = varianteRef?.imagen || producto.imagen;
            const btn = document.createElement("button");
            btn.className = `color-btn ${color === colorSeleccionado ? "active" : ""}`;
            btn.dataset.color = color;
            btn.innerHTML = `
                <img src="${imgUrl}" alt="${color}">
                <span class="opt-name">${color}</span>
                <span class="opt-price">$${varianteRef ? varianteRef.precio : '---'}</span>
            `;
            btn.addEventListener("click", () => {
                colorSeleccionado = color;
                actualizarVista();
            });
            colorContainer.appendChild(btn);
        });
    }

    function renderizarTallas() {
        if (!sizeContainer) return;
        sizeContainer.innerHTML = "";

        tallasDisponibles.forEach(talla => {
            const btn = document.createElement("button");
            btn.className = `size-btn ${talla === tallaSeleccionada ? "active" : ""}`;
            btn.dataset.size = talla;
            btn.textContent = talla;
            btn.addEventListener("click", () => {
                tallaSeleccionada = talla;
                actualizarVista();
            });
            sizeContainer.appendChild(btn);
        });
    }

    function renderizarEspecificaciones() {
        if (!specsContainer) return;

        let specsHTML = `<h2>Detalles de producto</h2>`;
        specsHTML += `
            <div class="spec-row">
                <span class="spec-key">Marca</span>
                <span class="spec-val">${producto.marca}</span>
            </div>
            <div class="spec-row">
                <span class="spec-key">Descripción</span>
                <span class="spec-val">${producto.descripcion}</span>
            </div>
        `;

        if (producto.atributos) {
            for (const [key, value] of Object.entries(producto.atributos)) {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' \$1');
                const formattedVal = Array.isArray(value) ? value.join(', ') : (typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value);

                specsHTML += `
                    <div class="spec-row">
                        <span class="spec-key">${formattedKey}</span>
                        <span class="spec-val">${formattedVal}</span>
                    </div>
                `;
            }
        }
        specsContainer.innerHTML = specsHTML;
    }

    function renderizarComparador() {
        if (!comparatorContainer) return;

        const productosSimilares = productos.filter(p => p.id !== producto.id).slice(0, 2);

        let tablaHTML = `
            <h2>Compara con artículos similares</h2>
            <div class="comparator-table-wrapper">
                <table class="comparator-table">
                    <thead>
                        <tr>
                            <th>Característica</th>
                            <th class="current-product-col">
                                <img src="${producto.variantes[0]?.imagen || producto.imagen}" alt="${producto.nombre}">
                                <span>${producto.nombre} (Actual)</span>
                            </th>
        `;

        productosSimilares.forEach(p => {
            const imgAlt = p.variantes[0]?.imagen || p.imagen;
            tablaHTML += `
                <th>
                    <img src="${imgAlt}" alt="${p.nombre}">
                    <span>${p.nombre}</span>
                </th>
            `;
        });

        tablaHTML += `</tr></thead><tbody>`;

        tablaHTML += `
            <tr>
                <td><strong>Precio base</strong></td>
                <td class="current-product-col">$${producto.variantes[0]?.precio || 0}</td>
        `;
        productosSimilares.forEach(p => {
            tablaHTML += `<td>$${p.variantes[0]?.precio || 'N/D'}</td>`;
        });
        tablaHTML += `</tr>`;

        tablaHTML += `
            <tr>
                <td><strong>Marca</strong></td>
                <td class="current-product-col">${producto.marca}</td>
        `;
        productosSimilares.forEach(p => {
            tablaHTML += `<td>${p.marca}</td>`;
        });
        tablaHTML += `</tr>`;

        const materialActual = producto.atributos?.material || producto.atributos?.tipo || 'N/D';
        tablaHTML += `
            <tr>
                <td><strong>Material / Tipo</strong></td>
                <td class="current-product-col">${materialActual}</td>
        `;
        productosSimilares.forEach(p => {
            const materialAlt = p.atributos?.material || p.atributos?.tipo || 'N/D';
            tablaHTML += `<td>${materialAlt}</td>`;
        });
        tablaHTML += `</tr>`;

        tablaHTML += `</tbody></table></div>`;
        comparatorContainer.innerHTML = tablaHTML;
    }

    function actualizarVista() {
        const variante = buscarVariante(colorSeleccionado, tallaSeleccionada);
        if (!variante) return false;

        varianteSeleccionada = variante;
        activeProductImg.src = variante.imagen || producto.imagen;
        productPrice.textContent = `$${variante.precio}`;
        selectedColorName.textContent = variante.color;
        selectedSizeName.textContent = variante.talla;

        document.querySelectorAll(".color-btn").forEach(button => {
            button.classList.toggle("active", button.dataset.color === variante.color);
        });

        document.querySelectorAll(".size-btn").forEach(button => {
            button.classList.toggle("active", button.dataset.size === variante.talla);
        });

        if (btnAddCart) btnAddCart.disabled = !variante.estaDisponible();
        if (btnBuyNow) btnBuyNow.disabled = !variante.estaDisponible();

        return true;
    }

    if (btnAddCart) {
        btnAddCart.addEventListener("click", () => {
            if (!varianteSeleccionada?.estaDisponible()) return;

            const agregado = agregarAlCarrito(producto.id, varianteSeleccionada.id);

            if (!agregado) {
                alert("Ya tienes en el carrito todo el stock disponible de esta variante.");
                return;
            }

            if (cartBadge) {
                cartBadge.textContent = contarArticulos();
            }

            alert(`¡Producto agregado al carrito!\n${producto.nombre}\nColor: ${varianteSeleccionada.color}\nTalla: ${varianteSeleccionada.talla}\nPrecio: $${varianteSeleccionada.precio}`);
        });
    }

    if (btnBuyNow) {
        btnBuyNow.addEventListener("click", () => {
            if (!varianteSeleccionada?.estaDisponible()) return;
            alert(`Redirigiendo al proceso de pago:\n${producto.nombre}\nColor: ${varianteSeleccionada.color}\nTalla: ${varianteSeleccionada.talla}\nPrecio: $${varianteSeleccionada.precio}`);
        });
    }

    renderizarColores();
    renderizarTallas();
    renderizarEspecificaciones();
    renderizarComparador();
    actualizarVista();
});