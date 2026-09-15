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
- Estado: En desarrollo. Base minima validada por prueba manual (movimiento WASD, ataque con clic izquierdo, enemigo patrulla/persigue) y sistema de progresion implementado (XP, subida de nivel con corazones extra y victoria en nivel 3). Fase 3 (mapa con obstaculos y camara) implementada: mundo de 2000x1500 con paredes estaticas, camara que sigue al heroe con HUD fijo, y enemigos que siguen directo al objetivo cuando tienen vision libre y usan pathfinding A* para rodear las paredes; la poda de rutas y la linea de vision respetan la holgura del cuerpo del enemigo para no recortar esquinas ni trabarse en los bordes. Fase 4 (escalado de enemigos) implementada: 5 enemigos iniciales y +2 por subida de nivel, con distancia minima entre enemigos. Compila con `npm run build` y su logica fue verificada con tests en Node. La verificacion manual del sistema de progresion y de las Fases 3-4 queda pendiente de prueba en navegador.

## Descripcion

Videojuego RPG de vista superior (top-down) en 2D. El jugador controla un Heroe que se mueve con WASD y ataca con el clic izquierdo del mouse en un arco frontal, para matar monstruos que patrullan el mapa. La base minima esta implementada: el Heroe ataca a un enemigo con corazones que patrulla y persigue, y al matarlo obtiene 5 XP. El sistema de progresion (tambien implementado) suma 25 XP por nivel, aumenta los corazones maximos con cada nivel, agrega un enemigo por nivel y termina en victoria al llegar al nivel 3. La Fase 3 agrega un mundo de 2000x1500 con paredes estaticas que bloquean a heroe y enemigos, una camara que sigue al heroe (HUD fijo en pantalla) y enemigos que siguen directo al objetivo cuando tienen vision libre y rodean las paredes con pathfinding A* cuando estan bloqueados. La Fase 4 escala la cantidad de enemigos: 5 al inicio y 2 mas por subida de nivel (7 en nivel 2), con distancia minima entre enemigos.

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
- R: reiniciar la escena tras la derrota.

## Creditos

Sin assets de terceros. La representacion usa figuras geometricas generadas con Phaser. No hay sonidos, imagenes, tipografias ni plugins externos.

## Entrega o demostracion

[PENDIENTE - agregar compilacion, video o publicacion cuando la entrega lo requiera.]