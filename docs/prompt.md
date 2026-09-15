Trabajamos sobre "Videojuego rpg top down" (repositorio Parcial-1---Desarrollo-ag-ntico-documentado,
Phaser 4.2.1 + Vite 8.3.0, JavaScript ES modules).

Quiero analizar y proponer mejoras para el sistema de progresion del juego: experiencia,
subida de nivel, aumento de corazones y condicion de victoria.

Objetivo de diseño:
Que quien juega sienta progreso al matar enemigos: al acumular 25 de experiencia sube de
nivel y aumenta su numero de corazones, y al llegar al nivel 3 gana el juego.

Explorá primero docs/especificacion.md, docs/evidencia-pruebas.md, docs/informe-final.md,
docs/registro-intervencion.md, docs/plan.md, GDD.md, README.md, src/main.js e index.html.
Si necesitás ampliar el contexto, buscá rutas relacionadas. No modifiques archivos ni
ejecutes comandos.

Determiná el estado actual del proyecto con evidencia. Indicá qué capacidades ya existen,
cuáles no, y qué rutas y símbolos respaldan cada afirmación. Solo a modo de referencia,
la base minima implementada es: heroe con WASD, ataque en arco con clic izquierdo, un
enemigo que patrulla y persigue, 3 corazones por bando, XP fija en 5 por muerte con HUD
mostrando solamente Vida y XP, y reinicio manual con R tras la derrota (no verificado como
real a priori; contrastalo contra src/main.js).
Separá evidencia, supuestos y preguntas abiertas.

Luego elaborá una propuesta para:

1. Acumular XP (ya parcial: verificar que el HUD la refleje y que permita alcanzar 25).
2. Al llegar a 25 de XP: subir un nivel, aumentar los corazones maximos del jugador y
   restaurar su vida, mostrando el cambio en el HUD.
3. Al llegar al nivel 3: mostrar la condicion de victoria y detener la partida.
4. Al subir de nivel se conserva el excendente de experiencia y aparece un enemigo adicional.
   Al resetearse la partida el enemigo aparece en una ubicacion aleatoria lejos del jugador

Para cada propuesta indicá estado inicial, evento, guarda, comportamiento esperado,
informacion permitida y prohibida, capas o archivos involucrados, prueba principal, caso
limite, riesgos y condiciones para detenerse.

Respetá estas restricciones:

- Arquitectura: Phaser 4.2.1 con fisica arcade, modulos ES, representacion con figuras
  geometricas y texto; no agregar imagenes, sonidos ni plugins.
- Acciones prohibidas: instalar dependencias, usar red, y commitear o publicar cambios sin
  autorizacion explicita.
- Limite de alcance: solo progresion (XP, niveles, corazones y victoria); no agregar nuevos
  enemigos, habilidades ni menus; no alterar la logica de movimiento ni de ataque ya probada.
- Reglas de diseno e invariantes: los corazones nunca bajan de 0; el ataque respeta su
  enfriamiento; la partida se detiene al ganar; los valores clave del GDD se mantienen
  (5 XP por muerte, 25 XP por nivel, victoria en nivel 3).

Presentá el resultado en este orden:

1. Evidencia encontrada.
2. Supuestos y preguntas abiertas.
3. Propuesta de comportamiento.
4. Plan por hitos.
5. Estrategia de pruebas.
6. Archivos posiblemente afectados.
7. Condiciones para detenerse y consultar.

No implementes todavía.
