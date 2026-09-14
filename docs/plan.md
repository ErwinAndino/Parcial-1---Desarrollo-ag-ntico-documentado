# Plan de intervencion

## Objetivo del plan

Satisfacer los criterios de aceptacion de la "base minima" definida en la especificacion sin ampliar el alcance: dejar la documentacion de proceso completa con evidencia real (Fase 1) y, en una fase posterior, implementar el comportamiento minimo y registrar sus pruebas (Fases 2 y 3). Cada fase solo avanza si la anterior queda verificada.

## Cambios propuestos

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Completar la auditoria con hechos del repositorio | `docs/auditoria-repositorio.md` | Revision del texto contra rutas, versiones y comandos reales | Bajo: solo redaccion | Datos sin verificar |
| 2 | Completar GDD, especificacion, plan, matriz de permisos y README | `GDD.md`, `docs/especificacion.md`, `docs/plan.md`, `docs/matriz-permisos.md`, `README.md` | Revision del estudiante; consistencia con el alcance acordado | Medio: alcance puede ampliarse | Ambiguedad de diseno o alcance no acordado |
| 3 | Implementar la base minima (Heroe WASD, ataque con clic izquierdo, enemigo basico, HUD) | `src/main.js` (o modulos en `src/`), `index.html` sin cambios | `npm run build` sin errores y `npm run dev` con el juego visible | Alto: logica de combate y fisica | Fallo de build sin causa comprendida |
| 4 | Probar los criterios de aceptacion en `npm run dev` | Ninguno | Pruebas manuales reproducibles | Medio: comportamiento imprevisible | Comportamiento no esperado |
| 5 | Completar registro de intervencion, evidencia de pruebas e informe final | `docs/registro-intervencion.md`, `docs/evidencia-pruebas.md`, `docs/informe-final.md` | Contraste de lo escrito con lo realmente ejecutado | Medio: evidencia inventada | Informacion no verificada |

## Orden de implementacion

La Fase 1 (pasos 1-2) no requiere tocar codigo ni ejecutar comandos de build: se valida por revision directa del estudiante. Recien con la especificacion y el plan aprobados se habilita la Fase 2 (paso 3, implementacion), y solo cuando `npm run build` compile se ejecutan las pruebas manuales de la Fase 3 (pasos 4-5). La evidencia se escribe despues de observar, nunca antes.

## Fuera de alcance

- Sistema completo de niveles, victoria en nivel 3 y reset del nivel por derrota (definido en el GDD, implementado en una fase posterior).
- Assets externos, sonido, menu, multiples tipos de enemigos y mapa con obstaculos.
- Cambio de motor, instalacion de dependencias, uso de red o publicacion de cambios.