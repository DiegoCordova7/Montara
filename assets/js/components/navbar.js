import { obtenerSesion, cerrarSesion } from "../data/usuarios.js";
import { contarArticulos } from "../data/carrito.js";

function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[caracter]));
}

// Barra de categorías (se muestra debajo del navbar). Los id corresponden a productos.js.
const MENU_CATEGORIAS = [
    { nombre: "GPS", id: "gps" },
    { nombre: "Iluminación", id: "iluminacion" },
    { nombre: "Casas de Campaña", id: "camping" },
    { nombre: "Primeros auxilios", id: "primeros-auxilios" },
    { nombre: "Herramientas", id: "herramientas" },
    { nombre: "Mochilas", id: "mochilas" },
    {
        nombre: "Ropa y calzado",
        subs: [
            { nombre: "Ropa para mujer", id: "ropa-mujer" },
            { nombre: "Ropa para hombre", id: "ropa-hombre" },
            { nombre: "Calzado", id: "calzado" }
        ]
    }
];

function urlCategoria(id) {
    return `catalogo.html?categoria=${encodeURIComponent(id)}`;
}

function crearBarraCategorias() {
    const items = MENU_CATEGORIAS.map(({ nombre, id, subs }) => {
        const flecha = `<i class="fa-solid fa-angle-down"></i>`;

        if (!subs) {
            return `
                <li class="category-item">
                    <a href="${urlCategoria(id)}" class="category-link">${nombre}${flecha}</a>
                </li>`;
        }

        const enlaces = subs
            .map(sub => `<li><a href="${urlCategoria(sub.id)}">${sub.nombre}</a></li>`)
            .join("");

        return `
                <li class="category-item has-menu">
                    <button type="button" class="category-link" aria-haspopup="true">${nombre}${flecha}</button>
                    <ul class="category-menu">${enlaces}</ul>
                </li>`;
    }).join("");

    return `
            <nav class="category-bar" aria-label="Categorías">
                <ul class="category-list">${items}
                </ul>
            </nav>`;
}

export function cargarNavbar() {
    const contenedor = document.getElementById("navbar-container");

    if (!contenedor) return;

    const sesion = obtenerSesion();

    const enlacesUsuario = sesion
        ? `
                <span class="nav-link">Hola, ${escapar(sesion.nombre)}</span>
                <a href="#" class="nav-link" id="btn-logout">Cerrar sesión</a>`
        : `
                <a href="login.html" class="nav-link">Iniciar sesión</a>
                <a href="registro.html" class="nav-link">Registrarse</a>`;

    contenedor.innerHTML = `
        <div class="site-header">
        <header class="navbar">
            <div class="nav-left">
                <a href="index.html" class="logo-container">
                    <img
                        src="assets/img/logo.png"
                        alt="Montara"
                        class="logo-img"
                    >
                    <span class="logo-text">Montara</span>
                </a>
            </div>

            <div class="nav-center">
                <div class="search-box">
                    <input type="text" id="nav-search-input" placeholder="Buscar productos" aria-label="Buscar productos"
                    >
                    <button class="search-btn" id="nav-search-btn" aria-label="Buscar">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>

            <div class="nav-right">${enlacesUsuario}
                <a href="carrito.html" class="cart-icon" aria-label="Carrito">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-badge">${contarArticulos()}</span>
                </a>
            </div>
        </header>
        ${crearBarraCategorias()}
        </div>
    `;

    const inputBusqueda = document.getElementById("nav-search-input");
    const btnBusqueda = document.getElementById("nav-search-btn");

    inputBusqueda.value = new URLSearchParams(location.search).get("q") ?? "";

    function buscar() {
        const consulta = inputBusqueda.value.trim();
        location.href = consulta
            ? `catalogo.html?q=${encodeURIComponent(consulta)}`
            : "catalogo.html";
    }

    btnBusqueda.addEventListener("click", buscar);
    inputBusqueda.addEventListener("keydown", evento => {
        if (evento.key === "Enter") buscar();
    });

    document.getElementById("btn-logout")?.addEventListener("click", evento => {
        evento.preventDefault();
        cerrarSesion();
        location.reload();
    });
}
