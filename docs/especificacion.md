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