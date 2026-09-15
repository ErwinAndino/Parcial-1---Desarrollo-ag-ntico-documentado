# Evidencia de pruebas

Relaciona cada criterio de aceptacion con una prueba o secuencia manual que otra persona pueda repetir.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Movimiento con WASD | Local (sin commit) | `npm run dev` + secuencia manual | 1. `npm run dev`. 2. Abrir `http://localhost:5173`. 3. Mantener W/S/A/D y combinaciones. | El cuadrado azul se mueve en la direccion presionada al mismo largo (velocidad constante) y no sale del mundo. | Confirmado: el heroe se mueve correctamente en las 4 direcciones y en diagonales, sin salir del mundo. | Prueba manual del estudiante en navegador + salida de `npm run build`. |
| Ataque con clic izquierdo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Provocar que el enemigo quede frente al heroe. 2. Clic izquierdo cerca del enemigo. 3. Repetir hasta 0 corazones. | Aparece un abanico dorado frontal; cada golpe quita 1 corazon al enemigo (HUD encima del enemigo bajan de 3 a 2 a 1 a 0). | Confirmado: el abanico aparece y el enemigo pierde un corazon por golpe hasta morir. | Prueba manual del estudiante en navegador. |
| XP por muerte de enemigo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Reducir el enemigo a 0 corazones. | El enemigo reaparece en otro punto con 3 corazones y el HUD suma 5 de XP. | Confirmado: al morir el enemigo reaparece con 3 corazones y el HUD suma 5 de XP. | Prueba manual del estudiante en navegador. |
| Caso limite: colision jugador-enemigo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Acercar el heroe al enemigo hasta tocarlo. | El heroe pierde 1 corazon, parpadea en blanco y no vuelve a recibir daño durante ~1,2 s. | Confirmado: al colisionar el heroe pierde 1 corazon y queda en invulnerabilidad temporal. | Prueba manual del estudiante en navegador. |
| Caso limite: enfriamiento del ataque | Local (sin commit) | `npm run dev` + secuencia manual | 1. Clic izquierdo dos veces seguidas muy rapido. | El segundo clic no dispara hasta que termina el enfriamiento (~600 ms); un enemigo no recibe 2 golpes en un mismo ataque. | Confirmado: el ataque respeta el enfriamiento y no aplica doble golpe por ataque. | Prueba manual del estudiante en navegador. |
| Error: build | Local (sin commit) | `npm run build` | Ejecutar el comando. | Compila sin errores. | Compila en 542 ms, 5 modulos transformados; solo advertencia de chunk > 500 kB (no bloqueante). | Salida completa del comando. |

## Fallos y limites pendientes

- Reproduccion: ninguno; todos los criterios de aceptacion de la base minima fueron confirmados por prueba manual del estudiante en navegador.
- Impacto: la advertencia de tamano de chunk de Vite (~1,38 MB) no impide ejecutar ni compilar; puede revisarse con code-splitting en una fase posterior.
- Decision: criterios validados; el codigo queda local sin commit hasta que el estudiante decida publicar.

## Progresion (Fase 2)

Casos nuevos del sistema de progresion. El codigo fue validado por `npm run build` (562 ms, 5 modulos transformados, advertencia de chunk no bloqueante); la verificacion interactiva queda pendiente de prueba manual del estudiante en navegador.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Subida de nivel | Local (sin commit) | `npm run dev` + secuencia manual | 1. Correr el juego. 2. Matar 5 enemigos. | Al totalizar 25 XP: Nivel 2, maximo 4 corazones, vida llena y aparicion de un 2.º enemigo lejos del jugador. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Excedente de XP | Local (sin commit) | `npm run dev` + secuencia manual | 1. Matar enemigos hasta superar un multiplo de 25 de XP. | La XP restante luego de cada nivel queda visible en el HUD. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Victoria en nivel 3 | Local (sin commit) | `npm run dev` + secuencia manual | 1. Matar 10 enemigos desde el inicio de partida. | Aparece "VICTORIA", el combate se detiene (sin daño ni ataques) y R reinicia. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Reaparicion lejos del jugador | Local (sin commit) | `npm run dev` + secuencia manual | 1. Matar un enemigo y observar su reaparicion. 2. Esperar reinicio con R. | El enemigo reaparece a 240 px o mas del jugador, con margen de 40 px del borde. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Golpe multiple en el arco | Local (sin commit) | `npm run dev` + secuencia manual | 1. Enfrentar 2 o 3 enemigos juntos dentro del radio y angulo del arco. 2. Un clic izquierdo. | Todos los enemigos que tocan el arco (rectangulo contra el sector) pierden 1 corazon, incluso los que entran al arco durante el barrido de 250 ms; 1 golpe por enemigo por ataque y enfriamiento respetado. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Regresion base minima | Local (sin commit) | `npm run dev` + secuencia manual | 1. Repetir los casos base (WASD, ataque, colision, enfriamiento, reinicio R). | Ningun comportamiento base se altero con enemigos multiples. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Build | Local (sin commit) | `npm run build` | Ejecutar el comando. | Compila sin errores. | Confirmado: compila en 562 ms, 5 modulos transformados; advertencia de chunk > 500 kB no bloqueante. | Salida completa del comando. |

## Fase 3 - Mapa con obstaculos y camara

Casos nuevos de mapa, paredes, camara e IA sobre obstaculos. El codigo fue validado por `npm run build` (compila, 7 modulos transformados, advertencia de chunk no bloqueante) y por pruebas automatizadas en Node sobre los modulos puros (`src/pathfinding.js`, `src/walls.js`); la verificacion interactiva queda pendiente de prueba manual del estudiante en navegador.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Mundo mayor a la pantalla | Local (sin commit) | `npm run dev` + secuencia manual | 1. Correr el juego. 2. Explorar el mapa con WASD hasta los bordes. | Se recorre un mundo de 2000x1500; camara pegada al borde sin negro; heroe no sale del mundo. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Obstaculos (heroe) | Local (sin commit) | `npm run dev` + secuencia manual | 1. Caminar contra varias paredes (frente, ladera, esquina). | El heroe se detiene y no atraviesa ninguna pared. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Obstaculos (enemigo) | Local (sin commit) | `npm run dev` + secuencia manual | 1. Provocar que un enemigo empuje contra una pared. | El enemigo no atraviesa la pared. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Camara sigue al heroe | Local (sin commit) | `npm run dev` + secuencia manual | 1. Mover el heroe hasta las 4 esquinas del mundo. | La camara lo sigue, se detiene en los bordes del mundo y nunca muestra fuera de el. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| HUD fijo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Explorar con la camara desplazada. | Vida/Nivel/XP permanecen fijos en la esquina de la pantalla. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Aim con camara | Local (sin commit) | `npm run dev` + secuencia manual | 1. Clic izquierdo con la camara desplazada en distintas direcciones. | El arco de ataque apunta al puntero (coordenadas de mundo). | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| IA patrulla rodea pared | Local (sin commit) | `npm run dev` + secuencia manual | 1. Observar patrulla con destinos detras de paredes. | El enemigo rodea las paredes y llega al destino sin atravesarlas. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| IA persecucion rodea pared | Local (sin commit) | `npm run dev` + secuencia manual | 1. Ponerse al otro lado de una pared con un pasillo. 2. Entrar en el rango de agresion. | El enemigo da la vuelta por el pasillo y alcanza al jugador sin atravesar la pared. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Respawn fuera de pared | Local (sin commit) | Test automatizado Node | 1. Ejecutar el test de respawn (`spawn-test.mjs`, 2000 iteraciones). | Ningun respawn cae dentro de una pared ni dentro de `MIN_SPAWN_DIST` del jugador. | Confirmado: 2000 respawns validos (0 en pared, 0 dentro de 240 px). | Salida del test en Node. |
| Pathfinding A* | Local (sin commit) | Test automatizado Node | 1. Ejecutar el test de pathfinding (`pathfind-test.mjs`). | Ruta directa libre, desvio alrededor de una pared, llegada bloqueada null, misma celda null, waypoints en celdas libres. | Confirmado: 12 casos OK. | Salida del test en Node. |
| Layout de paredes | Local (sin commit) | Test automatizado Node | 1. Ejecutar el test de layout (`walls-test.mjs`). 2. Test de conectividad (`connectivity-test.mjs`). | Paredes dentro del mundo, sin superponerse, spawn del heroe libre; todas las celdas libres alcanzables desde el spawn. | Confirmado: 24 paredes, 0 solapamientos, 1697/1697 celdas libres conectadas (2 celdas menos que antes: las celdas de los centros de los muros 4 y 11 ahora quedan bloqueadas). | Salida de los tests en Node. |
| Build | Local (sin commit) | `npm run build` | Ejecutar el comando. | Compila sin errores. | Confirmado: compila en ~536-586 ms, 7 modulos transformados; advertencia de chunk > 500 kB no bloqueante. | Salida completa del comando. |
| Regresion base + progresion | Local (sin commit) | `npm run dev` + secuencia manual | 1. Repetir WASD, ataque, colision, enfriamiento, XP, niveles, victoria y R. | Ningun comportamiento previo se altero (movimiento, ataque, daño, progresion). | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |

## Fase 4 - Escalado de enemigos

El codigo fue validado por `npm run build` (compila, 7 modulos transformados, advertencia de chunk no bloqueante) y por un test automatizado en Node sobre la logica de spawn (`spawn-multi-test.mjs`, 7 enemigos y 500 respawns); la verificacion interactiva queda pendiente de prueba manual del estudiante en navegador.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Conteo inicial | Local (sin commit) | `npm run dev` + secuencia manual | 1. Correr el juego y contar enemigos. | Hay 5 enemigos en el mapa. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Conteo por nivel | Local (sin commit) | `npm run dev` + secuencia manual | 1. Matar enemigos hasta totalizar 25 XP. 2. Contar enemigos al subir a nivel 2. | Aparecen 2 enemigos mas (7 en total). | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Sin apilamiento | Local (sin commit) | Test automatizado Node | 1. Ejecutar `spawn-multi-test.mjs` (crear 7 enemigos y 500 respawns). | Ningun enemigo a menos de 120 px de otro, 240 px del jugador, dentro de pared o fuera del mundo. | Confirmado: 0 violaciones en la creacion inicial y en 500 respawns. | Salida del test en Node. |
| Build | Local (sin commit) | `npm run build` | Ejecutar el comando. | Compila sin errores. | Confirmado: compila en ~525 ms, 7 modulos transformados; advertencia de chunk > 500 kB no bloqueante. | Salida completa del comando. |
| Regresion Fases 1-3 | Local (sin commit) | `npm run dev` + secuencia manual | 1. Repetir mundo, paredes, camara, HUD fijo, aim, rodeo de paredes y progresion. | Ningun comportamiento previo se altero con mas enemigos. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |

## Fase 3-II - Correccion del seguimiento del enemigo (vision directa)

El usuario reporto que los enemigos, al perseguir al jugador, se sacudian hacia adelante y hacia atras en vez de seguirlo directo. Causa: la persecucion siempre usaba la ruta A* de la grilla, que comienza en el centro de la celda actual del enemigo y se recalcula cada 300 ms, provocando ida y vuelta entre centros de celdas. Se corrigio en `src/main.js` y `src/pathfinding.js`:

- Persecucion y patrulla: si hay linea de vision libre entre el enemigo y el objetivo (`hasClearLine`, interseccion exacta de segmento contra rectangulos de muros), el enemigo se mueve directo; A* solo se usa cuando una pared bloquea la linea.
- Anti-retroceso en `followPath`: los waypoints ya superados se saltean en vez de volver a ellos.

Ademas, al validar la linea de vision se detecto que la grilla de pathfinding no marcaba muros delgados (de 24 px, muros 4 y 11) que quedaban entre dos centros de celdas de 40 px, con lo que eran invisibles para la IA; ahora la celda del centro de cada muro tambien queda bloqueada (el mapa pasa de 1699 a 1697 celdas libres, todas conectadas).

El codigo fue validado por `npm run build` dado arriba, por el test `vision-test.mjs` (30 comprobaciones de linea de vision y salto de waypoints) y por la repeticion de los tests previos (`connectivity-test` 1697/1697, `pathfind-test` 12/12, `spawn-test` 2000/2000, `spawn-multi-test` 0 violaciones, `walls-test` 5/5). La verificacion interactiva del movimiento queda pendiente de prueba manual del estudiante en navegador.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Persecucion en campo abierto | Local (sin commit) | `npm run dev` + secuencia manual | 1. Acercarse a un enemigo con el camino libre. 2. Alejarse en linea recta. | El enemigo sigue directo al jugador, sin sacudidas de ida y vuelta. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Persecucion con pared en el camino | Local (sin commit) | `npm run dev` + secuencia manual | 1. Ponerse al otro lado de una pared con pasillo dentro del rango de agresion. | El enemigo rodea la pared por el pasillo y alcanza al jugador sin atravesarla. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Patrulla con vision libre | Local (sin commit) | `npm run dev` + secuencia manual | 1. Observar la patrulla en una zona con vision despejada. | El enemigo va directo a sus destinos de patrulla, sin sacudidas. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Anti-retroceso de waypoints | Local (sin commit) | Test automatizado Node | 1. Ejecutar `vision-test.mjs`. | Los waypoints ya superados no se retoman; la linea de vision corta cada muro real y se mantiene libre en campo abierto. | Confirmado: 30 comprobaciones OK, incluido el cruce de las 24 paredes. | Salida del test en Node. |
| Muros delgados en la grilla | Local (sin commit) | Test automatizado Node | 1. Ejecutar `connectivity-test.mjs` y `pathfind-test.mjs`. | Las celdas de los centros de los muros 4 y 11 quedan bloqueadas; todas las celdas libres siguen alcanzables. | Confirmado: 1697/1697 celdas libres conectadas; 12/12 en pathfinding. | Salida de los tests en Node. |
| Regresion Fases 1-4 | Local (sin commit) | `npm run dev` + secuencia manual | 1. Repetir movimiento, combate, progresion, conteo de enemigos, sin apilamiento y rodeo de paredes. | Ningun comportamiento previo se altero con el seguimiento corregido. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |

## Fase 3-III - Correccion del atasco en el borde de las paredes

El usuario reporto que los enemigos, al tener una pared en frente, se quedaban atascados en el borde sin completar su ruta. Causa medida sobre el codigo: la linea de vision y la poda del A* median el rayo geometrico (espesor 0) y no el cuerpo del enemigo (32 px). En una muestra de 200 000 pares aleatorios, el rayo decia "libre" mientras el cuerpo no cabia en ~9 % de los casos; y los atajos podados del A* recortaban esquinas (rayo libre, cuerpo bloqueado). Corrige en `src/pathfinding.js` y `src/main.js`:

- La poda del A* solo une waypoints si el tramo deja holgura para el cuerpo (`BODY_CLEARANCE = 16 + 2 = 18 px`); los atajos que recortaban esquinas se descartan conservando los pasos ortogonales entre celdas.
- La linea de vision (persecucion y patrulla) usa la misma holgura: el enemigo solo va directo cuando su cuerpo cabe; si no, usa el A*.
- El salto de waypoints (`skipWaypointsBehind`) no salta a un waypoint cuya linea recta no deja holgura.
- El desatasco avanza el indice de la ruta en vez de recomputar en bucle el mismo tramo contra la pared.

`npm run build` compila (523 ms, 7 modulos transformados). El test `route-test.mjs` verifico 2000 rutas aleatorias con 0 atajos podados que recorten esquinas, y se repitieron los tests previos con resultado OK.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Persecucion a traves de una pared | Local (sin commit) | `npm run dev` + secuencia manual | 1. Ponerse al otro lado de una pared con pasillo dentro del rango. 2. Observar. | El enemigo rodea la pared por el pasillo sin quedarse trabado en el borde y alcanza al jugador. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Sin atasco en el borde de la pared | Local (sin commit) | `npm run dev` + secuencia manual | 1. Provocar persecucion y patrulla con paredes de frente por varios minutos. | Ningun enemigo queda atascado contra el canto de una pared; si se traba un instante, avanza para desatascarse. | Pendiente de prueba manual. | Se completa tras la verificacion del estudiante. |
| Rutas sin recorte de esquina | Local (sin commit) | Test automatizado Node | 1. Ejecutar `route-test.mjs` (2000 rutas aleatorias). | Ningun atajo podado deja el cuerpo del enemigo dentro de una pared; los pasos ortogonales entre celdas se conservan. | Confirmado: 1998/2000 rutas con camino, 0 atajos recortados, 6/6 comprobaciones OK. | Salida del test en Node. |
| Vision y salto con holgura | Local (sin commit) | Test automatizado Node | 1. Ejecutar `vision-test.mjs` y `pathfind-test.mjs`. | La linea de vision corta cada pared real; un tramo a 12 px de una pared es libre al rayo pero bloqueado para el cuerpo; la poda directa en campo abierto sigue funcionando. | Confirmado: 30/30 y 12/12. | Salida de los tests en Node. |
| Regresion Fases 1-4 | Local (sin commit) | `npm run dev` + tests Node | 1. Repetir movimiento, combate, progresion, spawn y conectividad. | Ningun comportamiento previo se altero. | Confirmado por tests: conectividad 1697/1697, spawn 2000/2000, spawn-multi 0 violaciones, walls 5/5; la parte manual queda pendiente. | Salida de los tests en Node. |