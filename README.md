# Plantilla PIAPC para repositorios individuales

Esta plantilla prepara un repositorio publico e individual para proyectos academicos de videojuegos. Es independiente del motor, lenguaje y tipo de juego.

## Como usarla

1. Crea un repositorio individual desde esta plantilla y conserva el commit inicial.
2. Completa los datos de este archivo y de `GDD.md` cuando la consigna defina el problema de diseno.
3. Agrega el proyecto creado con el motor elegido, sin mezclar archivos de otros motores.
4. Incorpora al `.gitignore` las reglas oficiales o recomendadas para ese motor.
5. Completa los documentos de `docs/` en el orden indicado por `docs/README.md`.
6. Conserva commits pequenos y revisables durante el desarrollo.

## Datos del proyecto

- Estudiante: Erwin Andino
- Materia, comision y anio: Programacion de Inteligencia Artificial y Patrones de Comportamiento (PIAPC); Comision VJ; 2026
- Nombre del proyecto: Videojuego rpg top down
- Motor y version: Phaser 4.2.1 con Vite 8.3.0
- Estado: En desarrollo. Base minima validada por prueba manual (movimiento WASD, ataque con clic izquierdo, enemigo patrulla/persigue) y sistema de progresion implementado (XP, subida de nivel con corazones extra y victoria en nivel 3). Fase 3 (mapa con obstaculos y camara) implementada: mundo de 2000x1500 con paredes estaticas, camara que sigue al heroe con HUD fijo, y enemigos que siguen directo al objetivo cuando tienen vision libre y usan pathfinding A* para rodear las paredes; la poda de rutas y la linea de vision respetan la holgura del cuerpo del enemigo para no recortar esquinas ni trabarse en los bordes. Fase 4 (escalado de enemigos) implementada: 5 enemigos iniciales y +2 por subida de nivel, con distancia minima entre enemigos. Fase 5 (dash del heroe) implementada: Espacio dispara una esquivada de 140 px en 200 ms hacia la ultima direccion de movimiento, con enfriamiento de 1 s, invulnerabilidad total durante el tramo, recorte contra paredes y bordes, y HUD con indicador de recarga. Compila con `npm run build` y su logica fue verificada con tests en Node. Para la entrega los 8 tests Node estan versionados y fueron re-ejecutados el 2026-09-15 sobre la rama `main` (conectividad 1697/1697, pathfinding 12/12, paredes 5/5, respawn 2000/2000, spawn-multi 0 violaciones, vision 30/30, rutas 1997-1999/2000 con 0 recortes de esquina, dash 8/8). La verificacion manual del sistema de progresion y de las Fases 3-5 queda pendiente de prueba en navegador.

## Descripcion

Videojuego RPG de vista superior (top-down) en 2D. El jugador controla un Heroe que se mueve con WASD y ataca con el clic izquierdo del mouse en un arco frontal, para matar monstruos que patrullan el mapa. La base minima esta implementada: el Heroe ataca a un enemigo con corazones que patrulla y persigue, y al matarlo obtiene 5 XP. El sistema de progresion (tambien implementado) suma 25 XP por nivel, aumenta los corazones maximos con cada nivel, agrega un enemigo por nivel y termina en victoria al llegar al nivel 3. La Fase 3 agrega un mundo de 2000x1500 con paredes estaticas que bloquean a heroe y enemigos, una camara que sigue al heroe (HUD fijo en pantalla) y enemigos que siguen directo al objetivo cuando tienen vision libre y rodean las paredes con pathfinding A* cuando estan bloqueados. La Fase 4 escala la cantidad de enemigos: 5 al inicio y 2 mas por subida de nivel (7 en nivel 2), con distancia minima entre enemigos. La Fase 5 agrega un dash con Espacio: esquivada corta de 140 px hacia la ultima direccion de movimiento, invulnerable durante el tramo y con enfriamiento de 1 s, que no atraviesa paredes y muestra su recarga en el HUD.

## Requisitos y ejecucion

- Node.js con npm (usado para ejecutar Vite y Phaser).
- Version de motor: Phaser 4.2.1; build tool: Vite 8.3.0.

Pasos para ejecutar:

```
npm install
npm run dev
```

Para compilar a produccion: `npm run build`.

## Controles

- WASD: mover al Heroe.
- Clic izquierdo del mouse: atacar en un arco frontal.
- Espacio: dash/esquivada en la ultima direccion de movimiento, con enfriamiento.
- R: reiniciar la escena tras la derrota.

## Creditos

Sin assets de terceros. La representacion usa figuras geometricas generadas con Phaser. No hay sonidos, imagenes, tipografias ni plugins externos.

## Entrega o demostracion

Repositorio: `https://github.com/ErwinAndino/Parcial-1---Desarrollo-ag-ntico-documentado` (rama `main`; push final al commit `<HASH>`).

Herramienta agentica: opencode (agente CLI de codigo). El proceso completo (auditoria, GDD, especificacion, plan, matriz de permisos, registro de intervencion, evidencia de pruebas e informe final) esta documentado en `docs/` y todo el desarrollo fue por fases aprobadas.

Verificacion con resultados reales de la re-ejecucion del 2026-09-15:

- `npm run build`: compila sin errores (solo advertencia de tamano de chunk, no bloqueante).
- Tests en Node (`node <nombre>-test.mjs`): paredes 5/5, pathfinding 12/12, conectividad 1697/1697, respawn 2000/2000, spawn-multi 0 violaciones, vision 30/30, rutas 1997-1999/2000 con 0 recortes de esquina, dash 8/8.
- `npm run dev`: el juego corre en `http://localhost:5173` (WASD, ataque con clic izquierdo, dash con Espacio, R reinicia).

Declaracion: el repositorio no contiene secretos ni credenciales. `node_modules/` y `dist/` estan excluidos por `.gitignore` y no forman parte del commit de entrega. Toda la evidencia automatizada fue observada (build y tests re-ejecutados); la verificacion interactiva en navegador queda pendiente de prueba manual.