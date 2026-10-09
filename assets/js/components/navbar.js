export function cargarNavbar() {
    const contenedor = document.getElementById("navbar-container");

    if (!contenedor) return;

    contenedor.innerHTML = `
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
                    <input type="text" placeholder="Buscar productos" aria-label="Buscar productos"
                    >
                    <button class="search-btn" aria-label="Buscar">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>

            <div class="nav-right">
                <a href="login.html" class="nav-link">Iniciar sesión</a>
                <a href="registro.html" class="nav-link">Registrarse</a>
                <a href="carrito.html" class="cart-icon" aria-label="Carrito">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </header>
    `;
}