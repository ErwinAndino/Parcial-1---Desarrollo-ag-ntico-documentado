# Informe final

## Resultado

Se implemento la base minima definida en la especificacion: el heroe se mueve con WASD dentro de los limites del mundo, ataca con el clic izquierdo en un arco frontal con enfriamiento, y existe un enemigo con 3 corazones que patrulla su area y persigue al jugador en rango. Al llegar a 0 corazones el enemigo muere, reaparece en otro punto y otorga 5 XP; un HUD muestra la vida del jugador y la XP. Todos los criterios de aceptacion fueron confirmados por prueba manual del estudiante en `npm run dev`, y la compilacion (`npm run build`) fue verificada sin errores.

Sobre esa base se implemento ademas el sistema de progresion: al acumular 25 de XP el jugador sube de nivel, aumenta su cantidad maxima de corazones (+1 por nivel, maximo inicial 3), restaura su vida y aparece un enemigo adicional; el excedente de XP se conserva; los enemigos reaparecen a 240 px o mas del jugador; al llegar al nivel 3 el juego muestra VICTORIA y detiene la partida (R reinicia). El build compila sin errores y la verificacion interactiva de la progresion fue confirmada por la prueba manual del estudiante el 2026-09-15.

## Cambios y decisiones

- Cambios realizados:
  - `src/main.js`: logica de la base minima (constantes de juego, escena `GameScene`, ataque en arco, IA de patrulla/persecucion, respawn, HUD) y refactor a enemigos multiples (`this.enemies[]`) con ataque y colision por enemigo, `randomPointFarFromPlayer` para respawn/spawn lejos del jugador, `checkLevelUp` con excedente de XP, aumento de corazones maximos y curacion, enemigo adicional en niveles 1 y 2, y `triggerVictory` que congela la partida en el nivel 3.
  - Documentacion: `docs/especificacion.md`, `docs/plan.md`, `docs/evidencia-pruebas.md`, `docs/registro-intervencion.md`, `README.md`.
- Decisiones humanas relevantes (Fase 2): +1 corazon maximo por nivel (3, 4, 5); victoria corta antes del spawn del 3.er enemigo; tope de 3 enemigos simultaneos; respawn/spawn a >= 240 px del jugador (margen 40 px, reintentos y fallback); R reinicia tambien tras la victoria; HUD con Vida, Nivel y XP; 25 XP por nivel (victoria en nivel 3 con 50 XP acumulados).
- Decision humana posterior (ajuste de ataque): el barrido de ataque impacta a todos los enemigos dentro del arco (1 golpe por enemigo por ataque) y no solo al primero; se implemento en `updateAttack` con guardas para no mutar la lista durante la iteracion ni seguir dañando al gano/perder.
- Decision humana posterior (arco representativo): el arco dibujado es la zona real de daño. La prueba de impacto paso de usar el centro del enemigo a usar el rectangulo del enemigo contra el sector (`inAttackSector` + `enemyTouchesSector`: jugador dentro del rect, esquinas en el sector y muestreo del contorno del sector), y el daño se resuelve durante todo el barrido de 250 ms (`attackHitSet` por barrido en lugar de un unico frame), de modo que tocar el arco mostrado siempre golpea.
- Acciones del agente aceptadas, rechazadas o corregidas: la implementacion y la documentacion de Fase 2 fueron aceptadas; la prueba manual interactiva de la progresion fue confirmada por el estudiante el 2026-09-15 (checklist `docs/prueba-manual-checklist.md`).

## Fase 3 - Mapa con obstaculos y camara

## Resultado

Se implementaron el mapa expandido, los obstaculos y la camara: el mundo paso de 800x600 a 2000x1500 (canvas 800x600), se agrego un layout predefinido de 24 paredes estaticas con cuerpos arcade y colision contra heroe y enemigos, la camara sigue al heroe con bounds del mundo y el HUD quedo fijo a pantalla; el aim del ataque se convirtio a coordenadas de mundo. La IA de patrulla y persecucion usa un pathfinding A* propio en grilla (40 px, poda por linea de vista, recomputo 300 ms y deteccion de atasco 500 ms) que rodea las paredes, y el spawn/respawn y los patrol targets quedaron validados para no caer dentro de una pared. `npm run build` compila sin errores (7 modulos) y la logica fue verificada con tests automatizados en Node (A* 12 casos, layout 5 casos, conectividad 1699/1699, respawn 2000 simulaciones). La verificacion interactiva en navegador fue confirmada por la prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`).

## Cambios y decisiones (Fase 3)

- Cambios realizados:
  - `src/walls.js` (nuevo): layout de 24 rectangulos estaticos dentro del mundo, sin solapamientos, spawn del heroe libre.
  - `src/pathfinding.js` (nuevo): grilla de navegacion (celda 40 px), A* 4-dir con poda por linea de vista; helpers `worldToCell`, `sameCell`.
  - `src/main.js`: `WORLD_WIDTH/HEIGHT` separados del canvas, paredes estaticas con colliders, camara (`setBounds`, `startFollow`, `setRoundPixels`), HUD con `scrollFactor(0)` y depth 100, aim con `getWorldPoint`, IA con path seguido por waypoints + recomputo/desatasco, spawn/respawn y patrol targets libres de paredes (reintentos + fallback a celda libre).
- Decisiones humanas relevantes (Fase 3): mundo 2000x1500; layout predefinido; pathfinding propio A* en grilla; celda 40 px, recomputo 300 ms, desatasco 500 ms; margen de pared 80 px; padding de spawn 8 px; el arco de ataque no es bloqueado por paredes (no se altera la mecanica de daño).
- Acciones del agente aceptadas, rechazadas o corregidas: la implementacion de la Fase 3 fue aceptada; la prueba manual interactiva (mundo, camara, HUD fijo, aim, rodeo de paredes y regresion) fue confirmada por el estudiante el 2026-09-15.

## Validacion (Fase 3)

- Automatizada (Node, sin navegador): pathfinding (12/12: desvio, bloqueo, misma celda, waypoints libres), layout (24 paredes dentro del mundo, 0 solapamientos, spawn libre), conectividad (1699/1699 celdas libres alcanzables), respawn (0 de 2000 dentro de pared o dentro de 240 px del jugador).
- Build: `npm run build` compila sin errores en ~536-586 ms, 7 modulos transformados; advertencia de tamano de chunk no bloqueante.
- Prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`): mundo explorable, camara en las esquinas, HUD fijo, aim con camara desplazada, patrulla/persecucion que rodean paredes, respawns junto a paredes y regresion base + progresion, todas confirmadas.

## Limites y riesgos pendientes

- La verificacion manual interactiva de la Fase 3 fue confirmada por el estudiante el 2026-09-15 (mundo, camara, obstaculos, rodeo de paredes y regresion).
- El pathfinding es en grilla estatica: los enemigos no perciben bloqueos dinamicos (solo las paredes fijas); es acorde al alcance acordado.
- La advertencia de tamano de chunk de Vite (bundle ~1,39 MB) es no bloqueante; puede optimizarse con code-splitting en una fase posterior.
- La representacion de corazones usa caracteres unicode (`♥`/`♡`) cuyo glifo puede variar segun el navegador; impacto visual menor, sin afectar la logica.

## Validacion

- Camino principal: `npm run build` compila sin errores, `npm run dev` sirve `http://localhost:5173`, y la prueba manual confirmo movimiento WASD, ataque en arco, XP por muerte del enemigo y colision. Pasos reproducibles en `evidencia-pruebas.md`.
- Caso limite: el enfriamiento del ataque, la invulnerabilidad tras el dano, el respawn del enemigo y el reinicio con R funcionaron segun lo esperado en la prueba manual.
- Progresion: build verificado (562 ms, 5 modulos); los casos de nivel, excedente, victoria, reaparicion lejos y regresion quedaron registrados en `evidencia-pruebas.md` y fueron confirmados por la prueba manual del estudiante el 2026-09-15.
- Version validada: sin commit; cambios locales sobre el commit de la base minima. No se publico nada.

## Limites y riesgos pendientes

- La verificacion manual interactiva del sistema de progresion (niveles, excedente, victoria, reaparicion lejos del jugador y regresion de la base minima) fue confirmada por el estudiante el 2026-09-15; sus casos en `evidencia-pruebas.md` estan marcados como confirmados.
- La advertencia de tamano de chunk de Vite (bundle ~1,38 MB) es no bloqueante; puede optimizarse con code-splitting en una fase posterior.
- La representacion de corazones usa caracteres unicode (`♥`/`♡`) cuyo glifo puede variar segun el navegador; impacto visual menor, sin afectar la logica.

## Fase 4 - Escalado de enemigos

## Resultado

Se aumento la cantidad de enemigos sobre la Fase 3: la partida comienza con 5 enemigos (antes 1), cada subida de nivel agrega 2 (antes 1) y el spawn valida distancia a todos los enemigos presentes. Al llegar al nivel 2 hay 7 simultaneos y, como la victoria en el nivel 3 corta antes del spawn, el maximo real es 7 (se dejo sin cap explícito). `npm run build` compila sin errores (7 modulos) y un test en Node sobre la logica de spawn (7 enemigos y 500 respawns) no registro violaciones de distancia a paredes, al jugador ni entre enemigos. La verificacion interactiva (conteo 5 iniciales y 7 en nivel 2, sin apilamiento) fue confirmada por la prueba manual del estudiante el 2026-09-15.

## Cambios y decisiones (Fase 4)

- Cambios realizados (`src/main.js`): `INITIAL_ENEMIES=5`, `ENEMIES_PER_LEVEL=2`, `ENEMY_MIN_SPAWN_DIST=120`; bucle de creacion inicial (5) y por nivel (2); `randomPointFarFromPlayer` valida distancia a todos los enemigos (`distanceToNearestEnemy`) con reintentos (120) y fallback a celda libre de la grilla.
- Decision humana relevante: 5 iniciales, +2 por nivel, sin apilamiento (120 px entre enemigos) y sin cap adicional; esto reemplaza la decision historica de 1 inicial / +1 por nivel / tope 3. No se toco combate, ataque, daño, XP, niveles ni IA.

## Validacion (Fase 4)

- Automatizada (Node): `spawn-multi-test.mjs` con 7 enemigos y 500 respawns; 0 violaciones (celda del mundo, sin pared, >= 240 px del jugador, >= 120 px de otros enemigos).
- Build: `npm run build` compila en ~525 ms, 7 modulos transformados; advertencia de tamano de chunk no bloqueante.
- Prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`): conteo 5 al inicio, 7 al nivel 2, sin enemigos superpuestos y regresion de Fases 1-3, todas confirmadas.

## Limites y riesgos pendientes

- 7 enemigos simultaneos elevan la dificultad percibida; los ajustes finos de cantidad o distancia quedan como ajuste posterior opcional, ya que la prueba manual no registro problemas de apilamiento.
- La verificacion manual interactiva de la Fase 4 (y de la Fase 3) fue confirmada por el estudiante el 2026-09-15.

## Fase 3-II - Correccion del seguimiento del enemigo (vision directa)

## Resultado

El usuario reporto que, al perseguir, los enemigos se sacudian hacia adelante y hacia atras. La causa: la persecucion siempre usaba la ruta A* de la grilla, cuyo primer waypoint es el centro de la celda actual del enemigo y se recalcula cada 300 ms, generando un ida y vuelta entre centros de celdas. Se corrigio para que, cuando hay linea de vision libre hacia el objetivo, el enemigo siga directo (tanto en persecucion como en patrulla) y solo use A* cuando una pared bloquea la linea; ademas, los waypoints ya superados se saltean (`skipWaypointsBehind`). La verificacion interactiva fue confirmada por la prueba manual del estudiante el 2026-09-15.

## Cambios y decisiones (Fase 3-II)

- Cambios realizados (`src/main.js`): en `updateEnemyAI`, si `hasClearLine` a la meta es true se mueve directo (se deja el A* para caminos bloqueados); en `followPath`, `skipWaypointsBehind` evita retomar waypoints superados.
- Cambios realizados (`src/pathfinding.js`): `hasClearLine` usa interseccion exacta de segmento contra rectangulos de muros (antes muestreaba la grilla, con falsos positivos cerca de esquinas); `createNavGrid` ademas marca la celda del centro de cada muro. Esto corrigio un defecto detectado durante la validacion: los muros delgados de 24 px (muros 4 y 11) quedaban entre dos centros de celdas de 40 px y eran invisibles para la IA. El mapa pasa de 1699 a 1697 celdas libres, todas conectadas.
- Decisiones: mantener el collider como freno fisico (el enemigo no atraviesa muros) y mantener el recambio y el desatasco como respaldo.

## Validacion (Fase 3-II)

- Automatizada (Node): `vision-test.mjs` con 30 comprobaciones (linea de vision corta cada una de las 24 paredes, se mantiene libre en campo abierto y los waypoints superados no se retoman). Regresion: `connectivity-test` 1697/1697, `pathfind-test` 12/12, `spawn-test` 2000/2000, `spawn-multi-test` 0 violaciones, `walls-test` 5/5.
- Build: `npm run build` compila en ~547 ms, 7 modulos transformados; advertencia de tamano de chunk no bloqueante.
- Prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`): persecucion directa sin sacudidas en campo abierto, rodeo de pared por pasillo, patrulla sin sacudidas y regresion de Fases 1-4, todas confirmadas.

## Limites y riesgos pendientes

- El seguimiento directo mantiene el compromiso de no atravesar muros por los colliders; un caso limite a vigilar es un muro delgado muy proximo a la linea de vision (el enemigo puede rozar y deslizarse por la pared). La prueba manual (2026-09-15) no registro enemigos que rozaran de forma indeseada ni que atravesaran muros.
- Si el temblor persistiera o un enemigo atravesara una pared en algun caso, se debe frenar y consultar antes de continuar.

## Fase 3-III - Correccion del atasco en el borde de las paredes

## Resultado

El usuario reporto que los enemigos, con una pared en frente, se quedaban atascados en el borde. La causa medida fue que la linea de vision y la poda del A* median el rayo geometrico sin contar el cuerpo del enemigo (32 px): en 200 000 pares aleatorios el rayo decia libre mientras el cuerpo no cabia en ~9 % de los casos, y los atajos podados recortaban esquinas de muros. Se corrigio para que la IA solo use tramos donde el cuerpo cabe (holgura de 18 px) y el desatasco avance en lugar de recomputar en bucle. La verificacion manual del estudiante confirmo el comportamiento el 2026-09-15.

## Cambios y decisiones (Fase 3-III)

- `src/pathfinding.js`: `BODY_CLEARANCE = 16 + 2 = 18 px` (media del cuerpo 16 mas margen anti-rozamiento 2); `prunePath` solo une waypoints si el tramo deja esa holgura (se descartan los atajos que recortan esquinas, conservando los pasos ortogonales entre celdas, cuyo deslizamiento por el collider ya era el comportamiento aceptado); `segmentIntersectsRect` acepta `pad`; `hasClearLine` acepta `pad`.
- `src/main.js`: la vision directa de persecucion y patrulla usa `BODY_CLEARANCE` (solo va directo si el cuerpo cabe; si no, A*); `skipWaypointsBehind` no salta a un waypoint cuya linea recta no deja holgura; `updateStuckTracking` al desatascarse avanza `pathIndex` en vez de solo borrar la ruta (evita el bucle contra el canto).
- Decision: quedo 16+2 (18 px) como holgura; 24 px (16+8) se descarto por invalidar filas libres (p. ej., una fila a 20 px de la cara de un muro es transitable y con 24 quedaba bloqueada).

## Validacion (Fase 3-III)

- Automatizada (Node): `route-test.mjs` con 2000 rutas aleatorias y 0 atajos podados con recorte de esquina (1999/2000 rutas con camino en la re-ejecucion final, 1997 en una corrida previa; el conteo varia levemente por aleatoriedad y ronda >1000 de 2000; camino directo en campo abierto preservado); regresion completa OK (`vision-test` 30/30, `pathfind-test` 12/12, `connectivity-test` 1697/1697, `spawn-test` 2000/2000, `spawn-multi-test` 0 violaciones, `walls-test` 5/5).
- Build: `npm run build` compila en ~523 ms, 7 modulos transformados; advertencia de tamano de chunk no bloqueante.
- Prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`): persecucion y patrulla rodeando paredes sin atascarse en el borde (varios minutos con paredes de frente), y regresion interactiva de Fases 1-4, todas confirmadas.

## Limites y riesgos pendientes

- Los pasos ortogonales entre celdas junto a las caras siguen apoyandose en el deslizamiento del collider; la prueba manual (2026-09-15) no registro enemigos trabados un tiempo significativo, y el desatasco avanza de waypoint para los casos de traba momentanea.
- Si un enemigo llegara a atravesar o quedarse atascado permanentemente en una pared, se debe frenar y consultar.

## Fase 5 - Dash del heroe

## Resultado

Se implemento una esquivada (dash) para el heroe: con Espacio avanza 140 px en 200 ms hacia la ultima direccion de movimiento (default hacia abajo sin input previo) con easing-out y terminacion limpia, enfriamiento de 1 s desde el disparo, invulnerabilidad total durante el tramo, endpoint precalculado contra las 24 paredes (holgura del cuerpo 16+4 px) y contra los bordes del mundo (margen 16 px), y una linea `Dash: listo / recargando x.x s` en el HUD. El dash y el ataque coexisten en ambas direcciones: el dash puede iniciarse durante el barrido y el ataque puede lanzarse durante el dash si su enfriamiento lo permite (el arco se redibuja en la posicion viva del heroe), sin alterar la mecanica del ataque. `npm run build` compila sin errores (8 modulos) y la logica del endpoint fue verificada con un test en Node. La verificacion interactiva fue confirmada por la prueba manual del estudiante el 2026-09-15.

## Cambios y decisiones (Fase 5)

- Cambios realizados:
  - `src/dash.js` (nuevo): `computeDashEnd(startX, startY, dirX, dirY, distance, walls, worldW, worldH, half)` — barrido de 4 px sobre el segmento que recorta el endpoint contra los muros (acepta claves `width`/`height` de Phaser y `w`/`h` del layout) y contra los bordes del mundo.
  - `src/main.js`: constantes `DASH_DISTANCE=140`, `DASH_DURATION=200`, `DASH_COOLDOWN=1000`, `DASH_BODY_HALF=16+4`; tecla `SPACE` con `JustDown`; estado (`dashing`, `dashTimer`, `dashCooldown`, `dashInvuln`, `dashStart/End`); `startDash` y `updateDash` (aplicacion posicional con easing-out y `body.reset`); `handlePlayerMovement` se salta durante el tramo; `damagePlayer` retorna temprano con `dashInvuln`; tint `0x63e6be` durante el dash; linea de recarga en `updateHud`; limpieza del estado del dash en el congelamiento por derrota/victoria.
  - `dash-test.mjs` (nuevo): test Node ad hoc del endpoint (patron de los tests previos, ya versionado en el repositorio).
  - Documentacion: `docs/especificacion.md`, `docs/plan.md`, `docs/evidencia-pruebas.md`, `docs/registro-intervencion.md`, `docs/informe-final.md`, `README.md`.
- Decisiones humanas relevantes (Fase 5): tecla Espacio; direccion = ultima direccion de movimiento (sin input reciente usa la ultima, default abajo); distancia 140 px en 200 ms (tramo corto y rapido); enfriamiento 1000 ms desde el disparo; HUD con linea de dash; invulnerabilidad total durante el tramo; dash y ataque coexisten; el endpoint recortado consume igual el enfriamiento.
- Dato de validacion interno: al implementar se detecto que el endpoint ignoraba los muros definidos con claves `w`/`h`; se normalizo en `blockedAt` y el test de muros paso.

## Validacion (Fase 5)

- Automatizada (Node): `dash-test.mjs` con 8 comprobaciones OK: campo abierto alcanza 140 px exactos (incluida diagonal), dash contra muro termina en la cara sin penetrar, dash a contacto bloqueado queda en el lugar, borde del mundo clampa al margen del cuerpo, 200 dashes aleatorios a distancia plena dentro del mundo y 500 dashes aleatorios que nunca terminan dentro de una pared ni fuera del mundo.
- Build: `npm run build` compila en ~576 ms, 8 modulos transformados; advertencia de tamano de chunk no bloqueante.
- Prueba manual del estudiante (2026-09-15, checklist `docs/prueba-manual-checklist.md`): disparador y cooldown, direccion, recorte contra paredes/bordes, invuln en el tramo, convivencia con el ataque, freno en fin de partida y regresion de Fases 1-4, todas confirmadas.

## Limites y riesgos pendientes

- La verificacion manual interactiva del dash fue confirmada por el estudiante el 2026-09-15.
- El dash termina si se dispara pegado a un muro en esa direccion (recorte a casi 0 px) consumiendo el enfriamiento; es comportamiento documentado y confirmado en la prueba manual.
- Si la prueba manual mostrara que el dash atraviesa un muro, deja al heroe trabado o vuelve la huida ilimitada, se debe frenar y consultar antes de ajustar valores.

## Alcance frente a la consigna y cierre

La consigna pedia una intervencion pequeña con proceso agéntico documentado. El proyecto amplio el alcance en fases consultadas y aprobadas con el estudiante (registradas en `GDD.md`, `docs/especificacion.md` y `docs/plan.md`): base minima, sistema de progresion, mapa con obstaculos y camara, escalado de enemigos, dos correcciones de IA (seguimiento directo y atasco en bordes) y dash del heroe. Cada fase se valido con `npm run build` y con tests automatizados en Node sobre los modulos puros de `src/`; la verificacion interactiva en navegador fue confirmada por la prueba manual del estudiante el 2026-09-15 (checklist `docs/prueba-manual-checklist.md`; casos en `docs/evidencia-pruebas.md` marcados como confirmados).

Limites conocidos y decisiones de la entrega:

- `node_modules/` y `dist/` quedaron trackeados en commits previos (entraron con el commit `9a3ace2`, ~3880 archivos; el historial `.git` pesa 35,44 MB). No se reescribio el historial; desde el commit `8afc53d` el `.gitignore` los excluye (`node_modules/`, `dist/`, `.vite/`, `*.log`) y los commits de cierre no los incluyen.
- De los tests Node citados en la evidencia, solo `dash-test.mjs` estaba versionado; los 7 restantes se recrearon y re-ejecutaron y quedaron versionados en el commit `e86890e`. Los resultados reales de la re-ejecucion del 2026-09-15 estan en `docs/evidencia-pruebas.md`.
- No se instalaron dependencias nuevas ni se uso red durante el desarrollo; el push de la entrega fue autorizado por el estudiante.
- El repositorio no contiene secretos ni credenciales.

Historial de la entrega (`git log --oneline`):

- `8afc53d` Deja de trackear node_modules y dist; agrega reglas al gitignore
- `e86890e` Versiona tests Node de validacion re-ejecutados (pathfinding, walls, conectividad, spawn, vision y rutas)
- `2261ea0` Registra la re-ejecucion de los tests Node y los resultados reales para la entrega
- `3e73e52`..`407495a` desarrollo previo (dash, mapa/pathfinding, docs, base minima e commits iniciales)
- `8c685fb` cierre de documentacion de la entrega (este informe, el README y el registro)
- `514b0e7` cierre definitivo de la entrega (prueba manual de Fases 2-5 confirmada en `docs/evidencia-pruebas.md` y checklist `docs/prueba-manual-checklist.md`)