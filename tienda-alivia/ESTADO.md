# Estado del proyecto — Alivia

- **Tienda:** pendiente de crear (el dueño crea la cuenta de Shopify con su correo).
- **Ruta del tema:** `tienda-alivia/tema/` (base: Dawn 16.2.0) · paquete listo: `tienda-alivia/alivia-tema.zip`
- **Fase completada:** 4 y 5 (construcción + producto/páginas). Falta fase 6 (subir y publicar) cuando exista la tienda.
- **Validación:** `shopify theme check` → 0 errores (solo avisos heredados de Dawn).

## Producto
- Masajeador Shiatsu Alivia con Calor · handle `masajeador-shiatsu-alivia`
- Variantes (opción "Cantidad"): 1 unidad Q349 · 2 unidades Q599 (precio comparado Q698 = 2 × Q349)
- Importación: `productos-shopify.csv` (sin fotos: se suben las del proveedor)
- La página de producto es la plantilla por defecto `templates/product.json` → no hace falta asignar plantilla.

## Decisiones de diseño
- Marca: **Alivia** — "Bienestar en casa". Tono cercano, guatemalteco, honesto (sin reseñas ni cifras inventadas).
- Colores: tinta #12302F · verde azulado #1F5F5B · arena #F6F0E8 · crema #FFFBF6 · coral (botones) #E8704F · salvia #DCE8E1
- Tipografías: Fraunces (títulos) + DM Sans (texto), desde Google Fonts. Interruptor en Configuración del tema → "Alivia – Marca y WhatsApp".
- Prefijo propio: `al-` (archivos, clases CSS).
- Botón principal "Pedir ahora · Pago al recibir" lleva directo al pago (return_to=/checkout).

## Secciones creadas
| Archivo | Qué hace |
|---|---|
| `al-hero` | Portada: título, precio, garantías, foto del producto (o ilustración), tarjetas flotantes, parallax |
| `al-marquee` | Cinta animada de garantías |
| `al-problema` | Dolores del cliente + frase puente |
| `al-beneficios` | Tarjetas de beneficios (bloques) |
| `al-escena` | "Cómo funciona": imagen fija + pasos que se iluminan al hacer scroll |
| `al-comparativa` | Masajista vs Alivia + cifra de ahorro animada |
| `al-regalo` | Navidad: ofertas + cuenta atrás (fecha editable, se oculta al terminar) |
| `al-producto` | Galería, precio dinámico, variantes, compra directa, WhatsApp, confianza, pestañas, barra fija en móvil, datos para Google |
| `al-garantia` | Sello 30 días + garantías (bloques) |
| `al-resenas` | Opiniones REALES (vacía = no se muestra) |
| `al-faq` | Preguntas frecuentes + caja de WhatsApp + datos para Google |
| `al-cta-final` | Llamada final |
| `footer` | Pie de página reescrito (marca, enlaces, formas de pago, políticas, WhatsApp flotante) |
| `header` | Dawn + nombre de la marca con icono de hoja |

Otros: `assets/al-styles.css`, `assets/al-scripts.js`, `assets/al-favicon.png`, `snippets/al-icon.liquid`, `snippets/al-ilustracion.liquid`, cambios en `layout/theme.liquid` (favicon, fuentes, estilos) y `config/` (colores, ajustes Alivia).

## Pendiente (lado del dueño)
1. Crear cuenta Shopify → subir `alivia-tema.zip` → publicar.
2. Importar `productos-shopify.csv` y subir fotos del proveedor.
3. WhatsApp en Configuración del tema.
4. Pagos manuales (contra entrega + depósito BI), envío gratis Q0, políticas, teléfono obligatorio, quitar contraseña.
5. Proveedor (Dropi Guatemala) y verificar que las especificaciones coinciden con los textos.
