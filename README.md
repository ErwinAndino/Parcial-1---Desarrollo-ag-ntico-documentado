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
- Estado: En desarrollo. Base minima implementada y validada por prueba manual en navegador (movimiento WASD, ataque con clic izquierdo y enemigo); el sistema de niveles es el proximo paso.

## Descripcion

Videojuego RPG de vista superior (top-down) en 2D. El jugador controla un Heroe que se mueve con WASD y ataca con el clic izquierdo del mouse en un arco frontal, para matar monstruos que patrullan el mapa. La base minima esta implementada: el Heroe ataca a un enemigo con corazones que patrulla y persigue, y al matarlo obtiene 5 XP. El sistema de niveles, la victoria y el reset por derrota son el proximo paso.

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