---
id: WISETAX-DESKTOP-AGENTS-001
type: agent-guide
document_id: WISETAX-DESKTOP-AGENTS-001
version: 0.1.0
status: Draft
created: 2026-10-01
last_reviewed: 2026-10-01
---

# WiseTax Desktop Agent Guide

Leer primero el [workspace](../AGENTS.md), su registro, lock y estándares bajo ../.saas/framework. Después leer [docs/DESKTOP_STANDARDS.md](docs/DESKTOP_STANDARDS.md), la Product Spec y Technical Spec asignadas y el código afectado.

- Rol lógico desktop; no usar app ni asumir móvil.
- Mantener producto en ../product y todas las Technical Specs e intake en ../engineering.
- Respetar la separación entre interfaz, dominio del workflow, automatización y persistencia.
- El propietario autorizó la nueva estructura y el núcleo simulado de purchases: seguir EN-WTX-001 y TS-WTX-001. No implementar operaciones tributarias a partir del borrador de descubrimiento.
- Nunca introducir secretos, sesiones, datos tributarios o constancias reales en Git.
- No conectar al SIN, crear una base con datos reales ni ejecutar declaraciones como parte de los checks.
- No instalar navegadores o seleccionar framework UI/driver SQLite sin la decisión técnica aplicable.
- Confirmar estado Git independiente y preservar cambios ajenos. No hacer commits ni pushes sin solicitud explícita.
- Después de metadatos y specs: npm ci y npm run validate desde el workspace; desde desktop para sus cambios locales.
