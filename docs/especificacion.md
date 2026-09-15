# Especificacion

## Problema

El proyecto (videojuego RPG top-down) necesita su primer comportamiento jugable. Hoy solo muestra un texto estatico. El estudiante debe ver un Heroe que se mueve con WASD y ataca con el clic izquierdo del mouse, con al menos un enemigo que permita verificar el ataque. Sin logica de juego no hay entrega verificable del parcial.

## Resultado esperado

Al ejecutar el proyecto, el Heroe se mueve libremente con WASD dentro de los limites del mundo, ataca con el clic izquierdo en un arco frontal, y el ataque reduce los corazones de un enemigo que patrulla su area y persigue al jugador cuando esta en rango. Cuando el enemigo llega a 0 corazones muere, reaparece en otro punto lejos del jugador y el jugador obtiene 5 de experiencia. Un HUD muestra los corazones del jugador, la XP y el nivel. Al acumular 25 de XP el jugador sube de nivel: aumenta su cantidad maxima de corazones, restaura su vida y aparece un enemigo adicional; al llegar al nivel 3 el jugador gana y la partida se detiene.

## Alcance

- Incluye:
  - Heroe desplazable con WASD, con limites de mundo y orientacion segun la direccion del movimiento.
  - Ataque con clic izquierdo del mouse en un arco frontal, con enfriamiento y daño a los enemigos que esten dentro del area de impacto.
  - Enemigos basicos con 3 corazones que patrullan un area y persiguen al jugador cuando este entra en su alcance.
  - Colision jugador-enemigo: el jugador pierde un corazon.
  - Muerte del enemigo: al llegar a 0 corazones muere, reaparece en otro punto del mapa (lejos del jugador) y otorga 5 XP.
  - Progresion: al acumular 25 de XP el jugador sube de nivel, aumenta en 1 su cantidad maxima de corazones, restaura su vida y aparece un enemigo adicional. El excedente de XP se conserva.
  - Victoria: al llegar al nivel 3 el jugador gana y la partida se detiene.
  - HUD con los corazones del jugador, el nivel y la experiencia acumulada.
  - Representacion con figuras geometricas de Phaser (sin assets externos).
- No incluye (fase actual):
  - Tipos de enemigos adicionales, habilidades, menu, sonido, animaciones complejas, mapa con obstaculos ni camara.
  - Creacion de enemigo adicional en el salto al nivel 3: la victoria corta antes del spawn.
  - Cambios al movimiento o al ataque validados en la base minima.

## Restricciones

- Tecnicas: Phaser 4.2.1, Vite 8.3.0, JavaScript en modulos ES, fisica arcade de Phaser. No se agregan dependencias.
- Operativas: no instalar paquetes, no usar red y no publicar cambios sin autorizacion explicita.
- De calidad: `npm run build` debe compilar sin errores; las pruebas manuales se registran en `evidencia-pruebas.md`.

## Casos y criterios de aceptacion

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Camino principal (movimiento) | El juego corre en `npm run dev` | El jugador presiona WASD | El Heroe se mueve en la direccion correspondiente sin salir de los limites del mundo | Prueba manual reproducible en `evidencia-pruebas.md` |
| Camino principal (ataque) | Un enemigo esta dentro del arco frontal del Heroe | El jugador hace clic izquierdo | El enemigo pierde un corazon (3 a 2) y el HUD lo refleja al llegar a 0 reaparece | Prueba manual reproducible |
| Camino principal (XP) | El enemigo llega a 0 corazones | Muere y reaparece en otro punto | El jugador suma 5 de XP y el HUD lo muestra | Prueba manual reproducible |
| Caso limite (colision) | El Heroe colisiona con un enemigo | Ocurre el contacto | El jugador pierde un corazon | Prueba manual reproducible |
| Caso limite (enfriamiento) | El jugador ataca repetidas veces | Clic durante el enfriamiento | El ataque no se repite hasta terminar el enfriamiento | Prueba manual reproducible |
| Progresion (subida de nivel) | El jugador acumula 25 de XP | Mata 5 enemigos | Sube a nivel 2, su maximo de corazones pasa a 4, su vida se restaura y aparece un enemigo adicional | Prueba manual reproducible |
| Progresion (excedente) | El jugador suma XP de mas al nivelar | Mata enemigos superando 25 de XP | El excedente de XP se conserva en el HUD | Prueba manual reproducible |
| Progresion (victoria) | El jugador llega al nivel 3 | Mata 10 enemigos desde el inicio | El juego muestra VICTORIA, se detiene el combate y R reinicia | Prueba manual reproducible |
| Progresion (reaparicion lejos) | Un enemigo muere o reaparece | Se respawnea el enemigo | El enemigo aparece a 240 px o mas del jugador, con margen de 40 px del borde | Prueba manual reproducible |
| Error (build) | Codigo completo | `npm run build` | Compila sin errores; ante fallo se corrige antes de validar | Salida del comando |

## Invariantes

- El Heroe no sale de los limites del mundo.
- Los corazones del jugador y del enemigo nunca bajan de 0.
- El ataque no se re-dispare durante el enfriamiento.
- Durante el barrido (250 ms) el arco mostrado aplica 1 golpe a todo enemigo cuyo rectangulo toque el sector (no solo a su centro); 1 golpe por enemigo por ataque.
- La partida se detiene al ganar.
- No se agregan dependencias al proyecto.
- Valores del GDD: 5 XP por muerte, 25 XP por nivel y victoria en el nivel 3.

## Preguntas abiertas

- Representacion grafica exacta (formas, colores) del Heroe, el enemigo y el arco de ataque.
- Resolucion del canvas (se mantiene 800x600 o se redefine).
- Valores finos del ataque (tamano y angulo del arco, duracion del enfriamiento) y de la patrulla (area, velocidad, alcance).

## Fase 3 - Mapa con obstaculos y camara

## Problema

El mundo coincide con la pantalla (800x600): no hay exploracion, ni obstaculos que limiten el movimiento, ni camara que siga al heroe. Con la base y la progresion estables, el objetivo de diseno de esta fase es que quien juegue explore un mapa mayor a la pantalla con paredes que limiten el movimiento, y que la camara siga al heroe.

## Resultado esperado

El jugador explora un mundo de 2000x1500 con paredes estaticas (rectangulos Phaser, sin assets) que bloquean al heroe y a los enemigos; la camara sigue al heroe, muestra solo la zona visible y no sale del mundo; el HUD permanece fijo en pantalla; los enemigos rodean las paredes con pathfinding A* propio en patrulla y persecucion; los enemigos nunca aparecen ni patrullan dentro de una pared.

## Alcance de la Fase 3

- Incluye:
  - Mundo separado del canvas: `WORLD_WIDTH=2000`, `WORLD_HEIGHT=1500`, canvas 800x600.
  - Layout predefinido de paredes estaticas (`src/walls.js`) con cuerpos arcade y colliders contra heroe y enemigos.
  - Camara: bounds del mundo, follow al heroe, `setRoundPixels`, HUD con `scrollFactor(0)`, aim del ataque convertido de pantalla a mundo (`getWorldPoint`).
  - Pathfinding propio en grilla (`src/pathfinding.js`): grilla 40 px, A* 4-dir con poda por linea de vista, integrado a patrulla y persecucion con recomputo periodico (300 ms o cambio de celda del jugador) y deteccion de atasco (500 ms).
  - Spawn/respawn y patrol targets libres de paredes: validacion AABB con padding, reintentos acotados y fallback a celda libre de la grilla.
- No incluye: imagenes, sonidos, plugins o dependencias; cambios a ataque, daño, enfriamiento, XP, niveles o victoria (salvo adaptar colisiones y el aim del ataque); pathfinding en tiempo real sobre objetos en movimiento.

## Restricciones adicionales

- Fisica arcade de Phaser para colisiones; los obstaculos son rectangulos estaticos.
- `npm run build` sin errores; advertencia de tamano de chunk existente no bloqueante.

## Casos y criterios de aceptacion (Fase 3)

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Mundo mayor a la pantalla | El juego corre en `npm run dev` | El heroe explora | Se recorre un mundo de 2000x1500; los bordes del mundo limitan a heroe y enemigos | Prueba manual reproducible en `evidencia-pruebas.md` |
| Obstaculos | Existen paredes estaticas | El heroe o un enemigo las toca | Ni heroe ni enemigos las atraviesan | Prueba manual reproducible |
| Camara sigue al heroe | La camara tiene bounds y follow | El heroe se mueve hasta un borde | La camara muestra la zona visible y nunca muestra fuera del mundo | Prueba manual reproducible |
| HUD fijo | La camara se desplaza | El heroe se mueve por el mapa | El HUD de Vida/Nivel/XP permanece fijo en pantalla | Prueba manual reproducible |
| Aim con camara | La camara esta desplazada | El jugador hace clic izquierdo | El arco apunta hacia el puntero en coordenadas de mundo | Prueba manual reproducible |
| IA respeta paredes (patrulla) | El destino de patrulla esta detras de una pared | El enemigo patrulla | El enemigo rodea la pared y llega al destino | Prueba manual reproducible |
| IA respeta paredes (persecucion) | El jugador y el enemigo estan separados por una pared | El enemigo persigue | El enemigo rodea la pared y alcanza al jugador | Prueba manual reproducible |
| Respawn fuera de pared | Un enemigo muere junto a paredes | Se respawnea | El enemigo aparece fuera de toda pared, a 240 px o mas del jugador | Prueba manual reproducible + test automatizado |
| Error (build) | Codigo completo | `npm run build` | Compila sin errores | Salida del comando |

## Invariantes (Fase 3)

- El mundo es mayor a la pantalla (2000x1500 > 800x600); la camara se centra en el heroe con world bounds mayor a 800x600.
- Los obstaculos son rectangulos estaticos; heroe y enemigos no los atraviesan.
- Los enemigos respetan paredes en patrulla y persecucion.
- Ningun enemigo spawnea ni patrulla dentro de una pared.
- El HUD permanece en pantalla (no scrollea con la camara).
- Se mantienen los invariantes previos: corazones nunca bajan de 0, el ataque respeta su enfriamiento, la partida se detiene al ganar y no se agregan dependencias.

## Preguntas abiertas (Fase 3)

- Valores finos de pathfinding: tamano de celda (40 px), frecuencia de recomputo (300 ms), umbral de atasco (500 ms).
- Follow estricto vs. deadzone; se adopto un lerp suave (0.12).
- Si las paredes deben bloquear el arco de ataque (se mantiene que NO: no se altera la mecanica de daño).

## Fase 4 - Escalado de enemigos

## Problema

Con el mapa, las paredes y la camara establecidos, la cantidad de enemigos heredada (1 inicial, +1 por nivel, tope 3) queda baja para un mundo de 2000x1500.

## Resultado esperado

La partida comienza con 5 enemigos y cada subida de nivel agrega 2 enemigos: al llegar al nivel 2 hay 7 simultaneos; al llegar al nivel 3 la victoria corta antes del spawn, por lo que el maximo real es 7. Los enemigos no quedan apilados: cada aparicion (inicial, por nivel o respawn) queda a 120 px o mas de cualquier otro enemigo y a 240 px o mas del jugador, sin paredes y dentro del mundo.

## Alcance de la Fase 4

- Incluye:
  - `INITIAL_ENEMIES: 5` en la creacion de la escena (`src/main.js`).
  - `ENEMIES_PER_LEVEL: 2` en cada subida de nivel (`checkLevelUp`).
  - `ENEMY_MIN_SPAWN_DIST: 120` validado contra todos los enemigos ya presentes en la creacion inicial, en la creacion por nivel y en el respawn, con reintentos (120) y fallback a celdas libres de la grilla.
- No incluye: cambios a `MAX_LEVEL`, XP, corazones, daño, ataque, IA de patrulla/persecucion ni a la Fase 3 (mapa, paredes, camara).

## Casos y criterios de aceptacion (Fase 4)

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Conteo inicial | El juego arranca | Entra la escena | Hay 5 enemigos en el mapa | Prueba manual reproducible |
| Conteo por nivel | El jugador llega a 25 XP | Sube a nivel 2 | Aparecen 2 enemigos mas (7 en total) | Prueba manual reproducible |
| Sin apilamiento | Se crean o respawnean enemigos | Aparece un nuevo enemigo | Queda a 120 px o mas de cualquier otro y a 240 px o mas del jugador | Test automatizado Node + prueba manual |
| Fuera de paredes | Existen paredes | Aparece un enemigo | No cae dentro de una pared ni fuera del mundo | Test automatizado Node |
| Error (build) | Codigo completo | `npm run build` | Compila sin errores | Salida del comando |

## Invariantes (Fase 4)

- Ningun enemigo aparece a menos de 120 px de otro enemigo, a menos de 240 px del jugador, dentro de una pared ni fuera del mundo (los reintentos y el fallback a celda libre lo garantizan).
- Se mantienen los invariantes de las Fases 1-3 (mundo > pantalla, paredes estaticas, enemigos las respetan, camara, HUD, corazones, enfriamiento, no dependencias).

## Preguntas abiertas (Fase 4)

- Valores finos de las distancias si la prueba manual muestra apilamiento o dispersion excesiva con 7 enemigos.

## Fase 5 - Dash del heroe

## Problema

El heroe se desplaza a velocidad constante (200 px/s) y solo esquiva el daño saliendo del alcance de contacto. No existe una accion dedicada para esquivar ataques ni para desplazarse rapido por el mapa: quien juega no puede reaccionar con un movimiento corto y rapido, y el avance sobre el mapa grande (2000x1500) es lento.

## Resultado esperado

El heroe puede ejecutar una esquivada (dash) corta y rapida con la tecla Espacio: avanza 140 px en 200 ms hacia la ultima direccion de movimiento (invariante: siempre definida, con default hacia abajo), recortada contra paredes y bordes del mundo (nunca la atraviesa), con enfriamiento de 1 s para evitar el uso continuo, invulnerabilidad total durante el tramo para esquivar el daño por contacto, y una linea en el HUD que muestra la recarga. El dash convive con el ataque en ambas direcciones (puede iniciarse durante el barrido y el ataque puede lanzarse durante el dash si su enfriamiento lo permite) sin alterar el combate, la progresion, el spawn, las paredes, la camara ni la IA ya verificadas.

## Alcance de la Fase 5

- Incluye:
  - Tecla dedicada: Espacio (`KeyCodes.SPACE`), disparo con `JustDown` (patron de R), con guardas de partida (no durante `gameOver`/`victory`), de dash activo y de enfriamiento.
  - Direccion: `this.facing` (ultima direccion de movimiento, que persiste al soltar las teclas; default `(0,1)` al inicio). No hay caso de sin direccion.
  - Distancia/duracion/velocidad: `DASH_DISTANCE=140 px`, `DASH_DURATION=200 ms`, interpolacion con easing-out (terminacion limpia, sin saltos ni cortes); `setVelocity(0)` durante el tramo.
  - Enfriamiento: `DASH_COOLDOWN=1000 ms` desde el disparo (patron de `attackCooldown`); HUD con linea `Dash: listo / recargando x.x s`.
  - Paredes y bordes: endpoint precalculado en modulo puro `src/dash.js` (`computeDashEnd`) que recorta el segmento contra las 24 paredes (holgura del cuerpo 16+4 px) y contra los bordes del mundo (margen 16 px); el dash nunca atraviesa muros ni queda trabado (termina en la cara del muro).
  - Combate: invulnerabilidad total durante el dash (`dashInvuln` gatea `damagePlayer`); no se toca la invuln post-dano (1,2 s) ni `Math.max(0, hp)`; el ataque conserva su enfriamiento y su barrido.
  - Feedback visual: el heroe cambia a un tint verde agua durante el dash.
- No incluye: cambios a `walls.js`, `pathfinding.js`, la IA, el combate base (arcos, dano, corazones), la progresion (XP, niveles, victoria), el spawn de enemigos, la camara ni `index.html`; ni assets, sonidos o plugins.

## Restricciones adicionales

- Fisica arcade de Phaser se mantiene para colisiones; el dash es geometrico (posicion interpolada) y no modifica colliders.
- `npm run build` sin errores; advertencia de tamano de chunk existente no bloqueante.

## Casos y criterios de aceptacion (Fase 5)

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Disparador | El juego corre en `npm run dev` | El jugador pulsa Espacio | El heroe ejecuta un dash por pulsacion; mantener la tecla no encadena | Prueba manual reproducible |
| Direccion | El heroe se movio con WASD | El jugador pulsa Espacio sin mover | El dash avanza hacia la ultima direccion de movimiento; sin input previo, hacia abajo (default) | Prueba manual reproducible |
| Distancia | Campo abierto | El jugador hace dash | El heroe recorre ~140 px en ~200 ms con parada suave | Prueba manual reproducible + test Node |
| Enfriamiento | El jugador hizo un dash | Pulsa Espacio antes de 1 s | El segundo dash no se dispara hasta terminar la recarga; el HUD muestra `Dash: recargando x.x s` | Prueba manual reproducible |
| Paredes | Hay un muro en la direccion del dash | El jugador hace dash contra el muro | El heroe termina en la cara del muro, no lo atraviesa y no queda trabado | Prueba manual reproducible + test Node |
| Limites del mundo | El heroe esta cerca de un borde | El jugador hace dash hacia el borde | El heroe no sale del mundo (margen de su cuerpo) | Prueba manual reproducible + test Node |
| Combate (invuln) | Un enemigo esta en contacto | El jugador hace dash atravesandolo | El heroe no pierde corazones durante el tramo; tras el dash, el daño normal vuelve a aplicar | Prueba manual reproducible |
| Convivencia con ataque | El dash esta activo o el barrido esta en curso | El jugador hace dash y ataca | Ambos coexisten: el dash puede iniciar durante el barrido y el ataque durante el dash si su enfriamiento lo permite; el arco sigue al heroe | Prueba manual reproducible |
| Fin de partida | Game over o victoria | El jugador pulsa Espacio | El dash no se dispara; uno en curso queda congelado | Prueba manual reproducible |
| Error (build) | Codigo completo | `npm run build` | Compila sin errores | Salida del comando |

## Invariantes (Fase 5)

- El dash avanza como maximo 140 px, no atraviesa paredes y no saca al heroe del mundo.
- El dash consume siempre su enfriamiento, aun recortado o bloqueado por un muro.
- Los corazones nunca bajan de 0; el ataque conserva su enfriamiento y su barrido.
- El heroe es invulnerable al daño por contacto solo durante el tramo del dash.
- Se mantienen los invariantes de las Fases 1-4 (mundo > pantalla, paredes estaticas, camara, HUD fijo, corazones, enfriamiento del ataque, no dependencias).
- No se agregan dependencias; no se tocan paredes, camara, IA, spawn ni progresion.

## Preguntas abiertas (Fase 5)

- Valores finos del dash (distancia 140, duracion 200 ms, cooldown 1 s, holgura 4 px) si la prueba manual los muestra muy cortos, muy lentos o demasiado frecuentes.
- Si el dash recortado a casi 0 px por un muro debe consumir igual el enfriamiento (se mantiene SI por simplicidad y castigo tactico, hasta evidencia manual en contrario).