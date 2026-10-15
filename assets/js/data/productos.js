import { Categoria } from "../models/Categoria.js";
import { Producto } from "../models/Producto.js";
import { VarianteProducto } from "../models/VarianteProducto.js";

export const categorias = [
  new Categoria({ id: "gps", nombre: "GPS" }),
  new Categoria({ id: "iluminacion", nombre: "Iluminación" }),
  new Categoria({ id: "camping", nombre: "Camping" }),
  new Categoria({ id: "primeros-auxilios", nombre: "Primeros auxilios" }),
  new Categoria({ id: "herramientas", nombre: "Herramientas" }),
  new Categoria({ id: "calzado", nombre: "Calzado" }),
  new Categoria({ id: "mochilas", nombre: "Mochilas" }),
  new Categoria({ id: "ropa", nombre: "Ropa" }),
  new Categoria({ id: "ropa-mujer", nombre: "Mujer", categoriaPadreId: "ropa" }),
  new Categoria({ id: "ropa-hombre", nombre: "Hombre", categoriaPadreId: "ropa" })
];

export const productos = [
  new Producto({
    id: 101,
    nombre: "Chamarra impermeable para mujer",
    descripcion: "Abrigo ligero con capucha para lluvia, senderismo y actividades al aire libre.",
    marca: "CUBIC PLANET",
    categoriaId: "ropa-mujer",
    imagen: "assets/img/chamarra-impermeable.jpg",
    atributos: {
      rangoEdad: "Adulto",
      clasificacion: "Ropa y calzado",
      material: "Poliéster",
      cuidados: "Lavado a mano",
      paisOrigen: "China",
      estilo: "Chaquetón",
      tipoManga: "Manga larga",
      impermeable: true,
      temporadas: ["Invierno", "Primavera", "Otoño"],
      patron: "Sólido",
      corte: "Regular"
    },
    variantes: ["Blanco", "Negro", "Rosa"].flatMap(color =>
      ["M", "XL", "2XL", "3XL", "CH", "G"].map(talla => {
        const imagenes = {
          Blanco: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
          Negro: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
          Rosa: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80"
        };
        const precio = color === "Negro" ? 458 : 412;
        return new VarianteProducto({
          id: `101-${color.toLowerCase()}-${talla.toLowerCase()}`,
          color,
          talla,
          precio,
          stock: 5,
          imagen: imagenes[color]
        });
      })
    )
  }),

  new Producto({
    id: 102,
    nombre: "Linterna LED recargable",
    descripcion: "Linterna compacta para excursiones y actividades nocturnas.",
    marca: "Outdoor Basic",
    categoriaId: "iluminacion",
    imagen: "assets/img/linterna-led.jpg",
    atributos: {
      tipo: "LED",
      recargable: true,
      uso: "Exterior"
    },
    variantes: [
      new VarianteProducto({
        id: "102-negra",
        color: "Negro",
        precio: 299,
        stock: 15
      })
    ]
  }),

  new Producto({
    id: 103,
    nombre: "Mochila de senderismo",
    descripcion: "Mochila para transportar equipo durante caminatas y excursiones.",
    marca: "Trail Explorer",
    categoriaId: "mochilas",
    imagen: "assets/img/mochila-senderismo.jpg",
    atributos: {
      capacidadLitros: 35,
      material: "Poliéster",
      uso: "Senderismo"
    },
    variantes: [
      new VarianteProducto({
        id: "103-verde",
        color: "Verde",
        precio: 799,
        stock: 7
      }),
      new VarianteProducto({
        id: "103-negra",
        color: "Negro",
        precio: 829,
        stock: 4
      })
    ]
  }),

  new Producto({
    id: 104,
    nombre: "Brújula de orientación",
    descripcion: "Brújula para navegación y orientación en recorridos al aire libre.",
    marca: "Adventure Gear",
    categoriaId: "gps",
    imagen: "assets/img/brujula.jpg",
    atributos: {
      tipo: "Manual",
      uso: "Orientación"
    },
    variantes: [
      new VarianteProducto({
        id: "104-estandar",
        precio: 189,
        stock: 12
      })
    ]
  })
];

export function buscarProductoPorId(id) {
  return productos.find(producto => producto.id === id) ?? null;
}

export function buscarProductosPorCategoria(categoriaId) {
  return productos.filter(producto => producto.categoriaId === categoriaId);
}

export function buscarCategoriaPorId(id) {
  return categorias.find(categoria => categoria.id === id) ?? null;
}