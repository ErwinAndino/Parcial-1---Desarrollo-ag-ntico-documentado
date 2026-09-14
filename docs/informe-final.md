# Informe final

## Resultado

Se implemento la base minima definida en la especificacion: el heroe se mueve con WASD dentro de los limites del mundo, ataca con el clic izquierdo en un arco frontal con enfriamiento, y existe un enemigo con 3 corazones que patrulla su area y persigue al jugador en rango. Al llegar a 0 corazones el enemigo muere, reaparece en otro punto y otorga 5 XP; un HUD muestra la vida del jugador y la XP. Todos los criterios de aceptacion fueron confirmados por prueba manual del estudiante en `npm run dev`, y la compilacion (`npm run build`) fue verificada sin errores.

## Cambios y decisiones

- Cambios realizados:
  - `src/main.js`: reemplazo de la escena "hola mundo" por la logica de la base minima (constantes de juego, escena `GameScene`, ataque en arco, IA de patrulla/persecucion, respawn, HUD).
  - Documentacion: `docs/auditoria-repositorio.md`, `GDD.md`, `docs/especificacion.md`, `docs/plan.md`, `docs/matriz-permisos.md`, `README.md`, `docs/registro-intervencion.md`, `docs/evidencia-pruebas.md` y este informe.
- Decisiones humanas relevantes: se fijo la base minima como alcance (movimiento WASD + ataque + un enemigo para probar); el sistema de niveles, victoria en nivel 3 y reset por derrota queda fuera de esta fase segun la especificacion.
- Acciones del agente aceptadas, rechazadas o corregidas: la documentacion y la implementacion fueron aceptadas; la prueba manual interactiva la confirmo el estudiante y se registro en `evidencia-pruebas.md`.

## Validacion

- Camino principal: `npm run build` compila sin errores, `npm run dev` sirve `http://localhost:5173`, y la prueba manual confirmo movimiento WASD, ataque en arco, XP por muerte del enemigo y colision. Pasos reproducibles en `evidencia-pruebas.md`.
- Caso limite: el enfriamiento del ataque, la invulnerabilidad tras el dano, el respawn del enemigo y el reinicio con R funcionaron segun lo esperado en la prueba manual.
- Version validada: sin commit; cambios locales sobre `Git 9a3ace2` (commit inicial). No se publico nada.

## Limites y riesgos pendientes

- El reset completo de nivel, el sistema de niveles y la victoria en nivel 3 quedan fuera de esta fase y son el proximo paso del GDD.
- La advertencia de tamano de chunk de Vite (bundle ~1,38 MB) es no bloqueante; puede optimizarse con code-splitting en una fase posterior.
- La representacion de corazones usa caracteres unicode (`♥`/`♡`) cuyo glifo puede variar segun el navegador; impacto visual menor, sin afectar la logica.