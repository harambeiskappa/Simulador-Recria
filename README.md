# Simulador de Recría — Darwash SA

App (PWA) para evaluar en la feria si conviene comprar un lote de terneros para **recría**, comparando el $/kg pagado contra el **precio de indiferencia** (punto de equilibrio).

- **Verde** = se pagó por debajo de la indiferencia → buena compra.
- **Rojo** = se pagó por encima → mala compra → reclamo a la feria.

El criterio es **indiferencia**, NO un margen objetivo.

Vive en: https://harambeiskappa.github.io/Simulador-Recria/

---

## A qué apunta

- **Uso en el ruedo, desde el celular** (modo *Feria*: categoría + peso → máximo a pagar, sin escribir precio).
- Que **casi todo sea auto-actualizable** (precios de mercado) — objetivo en curso.
- Excel como backend de datos (registro, control por carga). Está en la carpeta del proyecto, no en este repo.

---

## Cómo funciona el modelo

Alineado a la planilla de Nico (hojas **Invernada** y **Recria Capt**). Validado celda por celda.

**Indiferencia** = precio de compra que hace el resultado por cabeza = 0.

```
Resultado = (Venta neta − Compra neta) − Costos de producción [− Costo financiero]
```

### Todo por hectárea (clave del modelo)
El costo del campo se arma por hectárea/año y baja a la cabeza según la carga:

```
costo campo/ha/año = implem. verdeos + implem. pasturas/años + mantenimiento + (alquiler kg novillo × $/kg)
atot por cabeza = costo campo/ha/año ÷ carga (cab/ha) ÷ 365 × días en campo
```
- **Verdeos**: método de siembra **Aéreo (voleo)** o **Terrestre** → labor + semilla × precio × tipo de cambio (los insumos están en USD).
- La **carga** (cab/ha) es la palanca más fuerte: más carga → menos costo por cabeza.

### Suplementación (dieta de 3 insumos)
Maíz, silo y núcleo, ponderados por **receta (partes)** y **materia seca (%MS)**:
```
costo dieta $/tonTC = Σ(precio × partes) / Σ(partes)
stot por cabeza = pesoProm × consumoTC/PV × %suplementación × días de suministro × (costo dieta/1000) × (1 + markup)
```

### Dos modos de campo
- **Alquiler**: cascada por hectárea (arriba).
- **Capitalización**: el costo son los **kilos que entregás** = % de los kilos producidos × precio de salida (sin alquiler ni suplementación propia).

### Mortandad y desbaste
**Mortandad por ciclo** y **desbaste de venta** se descuentan de los kilos vendidos (como Nico), no como costo aparte.

### Capa comercial / impuestos / financiera
Comisiones (compra/venta), guías, fletes por km y kg/jaula, IVA, retención de ganancias (RG 830), costo financiero (tasa × días de financiamiento).

### Destinos
- **INVERNADA**: venta viva ($/kg de pizarra o manual).
- **FAENA**: carne × rinde.
- **TRANSFERENCIA**: a feedlot propio (precio de salida de pizarra).

---

## Pizarra de precios (`precios.json`)

La app lee `precios.json` al abrir y actualiza la pizarra y los parámetros de mercado.

| Dato | Fuente | Auto |
|---|---|---|
| Terneros / terneras / vaquillonas (por rango de kg) | Entre Surcos y Corrales | sí (semanal) |
| Maíz | BCR Rosario | sí |
| Novillo gordo / arrendamiento | Mercado Agroganadero Cañuelas | sí |
| Tipo de cambio | Dólar mayorista | sí |
| Silo / núcleo / semilla | Proveedor | manual (no cotizan público) |

---

## La app (PWA)

- Hosteada en **GitHub Pages**, instalable en iPhone/Android (pantalla completa, offline).
- **Service worker v4 "red primero"** para el index → las actualizaciones entran solas al reabrir (no hace falta reinstalar).
- **Flujo de actualización**: editar archivos → **Commit + Push** (GitHub Desktop) → la app se actualiza sola.
- **Modo Feria** (rápido: peso + categoría → máximo a pagar) y **modo Completo** (simulador completo).
- Botón **Generar informe (PDF)**: arma un informe de una carilla con el estilo de la app y lo comparte como archivo.
- Pestañas: **Simulador** y **Detalle del cálculo** (listas). **Análisis de compras** y **Sensibilidad** están **en revisión** (dependen de parámetros sin validar / datos de prueba).

---

## Archivos del repo

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS en un solo archivo). |
| `sw.js` | Service worker (caché offline + red-primero). |
| `manifest.json` | Manifiesto PWA (nombre, ícono, colores). |
| `icon-*.png`, `apple-touch-icon.png` | Íconos de la app (R con barra dorada + semáforo). |
| `precios.json` | Pizarra de precios editable que la app lee. |

---

## Parámetros: básicos vs avanzados

- **Básicos** (panel ⚙, a la vista): modo de campo, carga de terneros, alquiler, aumento diario, mortandad, sanidad, tasa, método de siembra, % suplementación, días de suministro, precios maíz/silo/núcleo.
- **Avanzados** (plegados): financiero fino, números de siembra, receta y %MS de la dieta, comercial, flete, impuestos.

Los datos provisorios se marcan con un asterisco `*`.

---

## Pendiente de confirmar con Nico/Lolo

- Tasa anual (19% capital propio vs ~57% del archivo de Nico).
- Carga real de El Aras (cab/ha) — hoy en 1 (valor de prueba, bajo).
- Días de suministro reales de suplemento.
- Precios de silo, núcleo y semilla.
- Error en el Excel de Nico: mantenimiento usaba ×1,7 en vez de × tipo de cambio (corregido en el nuestro).

---

## Validación

Validado contra la planilla de Nico:
- Cascada por hectárea: **$363.701/cab** (= su celda K11).
- Dieta: **$183.547/tonTC** y **56,1% MS** (= C68/C58).
- Suplementación con markup: **$46.192/cab** (= C75).
- Capitalización: **$60.000/cab** (= su K11 de Recria Capt).
- Break-even exacto en 0. Indiferencia decrece monótonamente con el peso.

---

## Regla del proyecto (importante)

**Este README se actualiza con cada cambio del simulador** (qué se agrega, saca o modifica). Es la base de contexto para retomar el trabajo y para asistentes de IA (Copilot). Mantenerlo al día es obligatorio.

_Última actualización: 17/06/2026 — modo Feria (con rango máx/mín de Entre Surcos), parámetros básicos/avanzados, informe PDF, pizarra Entre Surcos, cascada por hectárea, dieta de 3 insumos, modos alquiler/capitalización. La pizarra (`precios.json`) ahora guarda por banda [peso, prom, máx, mín]._
