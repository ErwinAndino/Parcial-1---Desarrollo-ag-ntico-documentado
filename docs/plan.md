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

## Fase 2 - Sistema de progresion (aprobada)

Responde al objetivo de diseno: que el jugador sienta progreso al matar enemigos. Decisiones acordadas con el estudiante: +1 corazon maximo por nivel (3, 4, 5); victoria corta antes del spawn en el salto al nivel 3; tope de 3 enemigos simultaneos (1 inicial, +1 en nivel 1, +1 en nivel 2); respawn/spawn a 240 px o mas del jugador (margen 40 px, con reintentos y fallback); R reinicia tambien tras la victoria; HUD con Vida, Nivel y XP; modelo de XP de 25 por nivel (sube a nivel 2 en 25 y a nivel 3 en 50; victoria en nivel 3).

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Refactor a enemigos multiples: `this.enemies[]`, overlap por enemigo, ataque en arco por enemigo, respawn/spawn lejos del jugador | `src/main.js` | `npm run build` + regresion manual de la base minima | Medio: refactor de la entidad enemiga | Cambiar la IA de movimiento o ataque probada |
| 2 | Estado de progresion: `playerLevel`, XP con excedente (`while xp >= 25`), HUD `Vida/Nivel/XP` | `src/main.js` | `npm run build` | Bajo: variables nuevas | Modelo de XP distinto al acordado |
| 3 | Efectos de nivel: +1 corazon maximo, vida llena, enemigo adicional en niveles 1 y 2 | `src/main.js` | `npm run build` + prueba manual | Medio: curacion y conteo de enemigos | Otra cantidad de corazones o tope de enemigos |
| 4 | Victoria en nivel 3: congelar partida, texto, guardas en ataque/daño/movimiento | `src/main.js` | `npm run build` + prueba manual | Bajo: flag analogo a derrota | R no debe reiniciar tras victoria |
| 5 | Pruebas manuales y documentacion | `docs/evidencia-pruebas.md`, `docs/registro-intervencion.md`, `docs/informe-final.md`, `README.md` | Contraste de lo escrito con lo probado | Medio: evidencia inventada | Resultados no verificados |

## Fase 3 - Mapa con obstaculos y camara (aprobada)

Responde al objetivo de diseno: que quien juegue explore un mapa mayor a la pantalla con paredes/bloques que limiten el movimiento del heroe y de los enemigos, con camara que siga al heroe. Decisiones acordadas con el estudiante: mundo 2000x1500 (canvas 800x600); layout predefinido de paredes (rectangulos estaticos, margen de borde 80 px); enemigos con pathfinding en grilla A* propio (celda 40 px, recomputo 300 ms, desatasco 500 ms); spawn/respawn y patrol targets libres de paredes (AABB + padding 8 px, reintentos y fallback a celda libre); HUD fijo (`scrollFactor(0)`); aim del ataque en coordenadas de mundo (`getWorldPoint`).

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Mundo expandido: `WORLD_WIDTH/WORLD_HEIGHT=2000/1500` separados del canvas; `setBounds` del mundo; clamps de spawn/patrol sobre el mundo | `src/main.js` | `npm run build` | Bajo: constantes | Clamps quedando fijados en 800x600 |
| 2 | Paredes estaticas: layout en `src/walls.js`, cuerpos estaticos arcade, colliders heroe y enemigos vs paredes | `src/walls.js`, `src/main.js` | `npm run build` + no atravesar | Medio: bodies estaticos | Collider que no frena sin causa comprendida |
| 3 | Camara: `setBounds`, `startFollow`, `setRoundPixels`, HUD `scrollFactor(0)`, aim con `getWorldPoint` | `src/main.js` | `npm run build` + esquinas, HUD fijo, aim con camara | Medio: aim y scroll | Camara fuera del mundo o HUD scrolleando |
| 4 | Pathfinding: grilla + A* con poda en `src/pathfinding.js`; integracion en patrulla/persecucion; recomputo y desatasco | `src/pathfinding.js`, `src/main.js` | `npm run build` + test automatizado node + rodeo manual | Alto: logica de A* | Enemigo que atraviesa pared o queda pegado sin causa |
| 5 | Spawn seguro: validacion de paredes en spawn/respawn y patrol targets con reintentos y fallback | `src/main.js` | `npm run build` + test automatizado node + kills repetidos | Medio: convergencia | Reintentos sin convergencia o spawn dentro de pared |
| 6 | Regresion y documentacion | `src/main.js`, docs y README | Build + regresion base/progresion + actualizar evidencia | Medio: evidencia inventada | Resultados no verificados |

## Fase 4 - Escalado de enemigos (aprobada)

Cambia la cantidad de enemigos sobre la Fase 3 estable: 5 iniciales en vez de 1, +2 por nivel en vez de +1 y, al validar la distancia entre enemigos, se elimina el tope previo de 3 (el maximo real queda en 7 porque la victoria en nivel 3 corta antes del spawn).

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Config: `INITIAL_ENEMIES=5`, `ENEMIES_PER_LEVEL=2`, `ENEMY_MIN_SPAWN_DIST=120` | `src/main.js` | `npm run build` | Bajo: constantes | Valores fuera de lo acordado |
| 2 | Bucles de creacion inicial y por nivel (crear 5 al inicio, 2 por subida) | `src/main.js` | `npm run build` + conteo manual | Bajo: bucles | Crear enemigos de mas en el salto a nivel 3 |
| 3 | Spawn con distancia a otros enemigos (reintentos 120 + fallback a celda libre) | `src/main.js` | `npm run build` + test automatizado Node + manual | Medio: apilamiento | Aparecer enemigos apilados sin causa comprendida |
| 4 | Documentacion | `docs/especificacion.md`, `docs/plan.md`, `docs/evidencia-pruebas.md`, `docs/registro-intervencion.md`, `docs/informe-final.md`, `README.md` | Contraste de lo escrito con lo probado | Medio: evidencia inventada | Resultados no verificados |