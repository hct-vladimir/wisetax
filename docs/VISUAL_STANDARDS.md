---
id: WISETAX-VISUAL-STANDARDS-001
type: repository-standards
document_id: WISETAX-VISUAL-STANDARDS-001
version: 0.1.0
status: Draft
created: 2026-10-01
last_reviewed: 2026-10-01
---

# Dirección visual de WiseTax Desktop

## Estado y fuente

Propuesta Draft para refinar junto con el contador. Base: [STD-VISUAL-DESIGN](../../.saas/framework/standards/design/VISUAL_DESIGN_BASELINE.md) y [STD-ACCESSIBILITY](../../.saas/framework/standards/design/ACCESSIBILITY_BASELINE.md). Se define un patrón operacional local; no se adopta por ello el perfil SaaS de ClientWS.

El diseño no depende de Angular, React u otra biblioteca UI. La selección de componentes y su implementación se registra en Technical Spec después de revisar el flujo.

## Composición

- Cliente, identidad tributaria y período visibles durante el trabajo.
- Navegación limitada a las capacidades disponibles; no crear dashboard con métricas decorativas.
- Compras: tabla de revisión, selección de factura, detalle y propuesta con evidencia/motivo.
- Propuesta no equivale a decisión ni a tratamiento aplicado en el SIN.
- Acción primaria única por región: revisar una decisión o aprobar el lote según el contexto.
- Aprobación local, aplicación en el portal, consolidación y presentación tienen etiquetas y confirmaciones distintas.
- Mostrar bloqueo con motivo y qué falta; nunca tratar un período parcial como completo.

Mesa de trabajo es la composición recomendada para el piloto; revisión guiada es la alternativa por evaluar.

## Tokens propuestos

| Token            | Claro   | Oscuro de referencia |
| ---------------- | ------- | -------------------- |
| canvas           | #F4F6FA | #141922              |
| surface          | #FFFFFF | #1C2330              |
| text             | #182337 | #EDF2FA              |
| muted-text       | #526176 | #ACB9CE              |
| border           | #DCE2EC | #354154              |
| primary          | #254FA0 | #A9C8FF              |
| on-primary       | #FFFFFF | #14294C              |
| selected-surface | #EAF0FC | #263650              |
| success-text     | #246647 | #92D6AE              |
| warning-text     | #765300 | #EFCD80              |

Completar tokens danger, focus y disabled y verificar sus contrastes antes de implementación. Tema claro es la propuesta inicial; soporte oscuro definitivo por decidir y validar de forma completa. Las variantes del boceto siguen el tema del host para exploración, sin comprometer el alcance de temas del MVP.

Tipografía: sistema/Segoe UI; cuerpo 14px, etiquetas 12px, metadata mínimo 11px, títulos 20–24px. Importes alineados a la derecha con cifras tabulares y Bs explícito. IDs y fechas no se truncan sin acceso al valor completo.

Espaciado basado en 4px; preferir 8/12/16/24px. Radios contenidos de 6–8px. Jerarquía mediante alineación, espacios y contraste antes de sombras o contenedores adicionales.

## Componentes iniciales

Selectores de cliente/período; tabla de compras; estado textual; detalle de factura; selector de tratamiento (opciones del SIN por acordar); observación; resumen de lote; confirmación de aprobación; mensajes de estado y recuperación.

No fijar el modelo tributario mediante un checkbox genérico de elegible. El contador debe definir opciones, condiciones y respaldo necesarios.

## Estados obligatorios del recorrido

| Estado             | Comportamiento                                                           |
| ------------------ | ------------------------------------------------------------------------ |
| Inicial            | Elegir cliente y período; no presentar datos de otro contexto            |
| Cargando           | Indicar la operación; evitar doble activación                            |
| Vacío              | Distinguir ausencia de compras de error de extracción                    |
| Pendiente          | Mostrar falta de revisión o evidencia; bloquear aprobación incompleta    |
| Revisado           | Registrar tratamiento concreto; no implicar ejecución externa            |
| Aprobado local     | Indicar versión y quién aprobó; invalidar ante cambios materiales        |
| Error local        | Mostrar error de lectura/guardado sin afirmar que el cambio se persistió |
| Sesión vencida     | Ofrecer acceso/intervención y revalidar contexto al continuar            |
| Resultado incierto | Solicitar verificación/reconciliación; no ofrecer reintento ciego        |
| Verificado         | Mostrar evidencia del resultado en el SIN cuando exista integración      |

## Reflujo y accesibilidad

Desktop/laptop son el destino inicial. Al estrechar la ventana, detalle pasa debajo de tabla; tablas realmente bidimensionales permiten scroll horizontal controlado. No reducir tipografía para hacer caber columnas. NIT, período y acción principal permanecen accesibles.

Teclado para todas las acciones, foco visible y conservación de foco al actualizar filas. Confirmaciones modales con foco contenido y retorno al disparador. Etiquetas persistentes; estado por texto y color. Anuncios discretos de cambios importantes y errores asociados al control.

## Evidencia antes de aceptar UI

Verificar la app implementada con datos representativos y sintéticos: 20–30 filas, proveedor/nombre largo, varios pendientes y observaciones, carga/vacío/error, reanudación, teclado, zoom 200/400%, reflujo, contraste y temas seleccionados. Añadir checks automatizados de accesibilidad y revisión manual con lector de pantalla.

El boceto interactivo solo valida la composición y algunas interacciones simuladas; no sustituye esta evidencia.
