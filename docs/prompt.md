Trabajamos sobre "Videojuego rpg top down" (repositorio Parcial-1---Desarrollo-ag-ntico-documentado, Phaser 4.2.1 + Vite 8.3.0, JavaScript ES modules).

Quiero analizar y proponer mejoras para el sistema de movimiento del heroe: un dash o esquivada con direccion, distancia acotada y enfriamiento.

Objetivo de diseño:
Que quien juega pueda esquivar ataques y desplazarse rapido por el mapa con una esquivada corta, sin poder atravesar paredes y sin que se vuelva una huida ilimitada.

Explorá primero docs/especificacion.md, docs/evidencia-pruebas.md, docs/informe-final.md, docs/registro-intervencion.md, docs/plan.md, GDD.md, README.md, AGENTS.md, src/main.js, src/pathfinding.js, src/walls.js, index.html y package.json.
Si necesitás ampliar el contexto, buscá rutas relacionadas. No modifiques archivos ni ejecutes comandos.

Determiná el estado actual del proyecto con evidencia. Indicá qué capacidades ya existen, cuáles no, y qué rutas y símbolos respaldan cada afirmación. Separá evidencia, supuestos y preguntas abiertas.

A modo de referencia, el estado verificado es: heroe con WASD y limites del mundo; ataque en arco frontal con clic izquierdo, enfriamiento y golpe multiple contra el arco; enemigos (5 iniciales, +2 por nivel) que patrullan y persiguen con linea de vision directa y pathfinding A* en grilla de 40 px con holgura del cuerpo; spawn/respawn a >= 240 px del jugador y >= 120 px de otros enemigos; mundo de 2000x1500 con 24 paredes estaticas y camara que sigue al heroe con HUD fijo; XP por muerte, niveles cada 25 XP (corazon extra) y victoria en nivel 3; reinicio con R. Todo verificado por `npm run build` y tests en Node; la prueba manual de Fases 3-4 queda pendiente de verificacion.

Luego elaborá una propuesta para:

1. Disparador: definir que accion activa el dash (p. ej., una tecla dedicada o doble toque) manteniendo WASD y el ataque con clic izquierdo.
2. Direccion: hacia dónde avanza el heroe (la ultima direccion de movimiento o el puntero) y cómo se resuelve cuando no hay input reciente.
3. Distancia, duracion y velocidad: un tramo corto y rapido con terminacion limpia, sin saltos bruscos ni cortes del movimiento.
4. Enfriamiento: un tiempo minimo entre dashes para evitar uso continuo, visible o no en el HUD.
5. Interaccion con las paredes: el dash no debe permitir atravesar paredes ni dejarlo trabado contra un borde.
6. Interaccion con el combate: si durante el dash se recibe daño o no (invulnerabilidad parcial o total) y cómo convive con el ataque y la camara.

Para cada propuesta indicá estado inicial, evento, guarda, comportamiento esperado, informacion permitida y prohibida, capas o archivos involucrados, prueba principal, caso limite, riesgos y condiciones para detenerse.

Respetá estas restricciones:

- Arquitectura: Phaser 4.2.1 con fisica arcade, modulos ES, representacion con figuras geometricas y texto; no agregar imagenes, sonidos ni plugins.
- Acciones prohibidas: instalar dependencias, usar red, y commitear o publicar cambios sin autorizacion explicita; no eliminar archivos ni modificar configuracion fuera del alcance aprobado.
- Limite de alcance: solo el dash del heroe; no alterar el combate base (arcos, dano, corazones), la progresion (XP, niveles, victoria), el spawn de enemigos, las paredes, la camara ni las correcciones de IA ya verificadas.
- Reglas de diseno e invariantes: mundo 2000x1500 y canvas 800x600; las paredes estaticas bloquean a heroe y enemigos; la camara sigue al heroe con HUD fijo; los corazones nunca bajan de 0; el dash no atraviesa paredes; el ataque conserva su enfriamiento; la partida se detiene al ganar o perder.

Presentá el resultado en este orden:

1. Evidencia encontrada.
2. Supuestos y preguntas abiertas.
3. Propuesta de comportamiento.
4. Plan por hitos.
5. Estrategia de pruebas.
6. Archivos posiblemente afectados.
7. Condiciones para detenerse y consultar.

No implementes todavía.