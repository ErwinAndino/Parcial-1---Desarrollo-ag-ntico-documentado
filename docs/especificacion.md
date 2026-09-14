# Especificacion

## Problema

El proyecto (videojuego RPG top-down) necesita su primer comportamiento jugable. Hoy solo muestra un texto estatico. El estudiante debe ver un Heroe que se mueve con WASD y ataca con el clic izquierdo del mouse, con al menos un enemigo que permita verificar el ataque. Sin logica de juego no hay entrega verificable del parcial.

## Resultado esperado

Al ejecutar el proyecto, el Heroe se mueve libremente con WASD dentro de los limites del mundo, ataca con el clic izquierdo en un arco frontal, y el ataque reduce los corazones de un enemigo que patrulla su area y persigue al jugador cuando esta en rango. Cuando el enemigo llega a 0 corazones muere, reaparece en otro punto y el jugador obtiene 5 de experiencia. Un HUD muestra los corazones del jugador y la XP.

## Alcance

- Incluye:
  - Heroe desplazable con WASD, con limites de mundo y orientacion segun la direccion del movimiento.
  - Ataque con clic izquierdo del mouse en un arco frontal, con enfriamiento y daño a los enemigos que esten dentro del area de impacto.
  - Un enemigo basico con 3 corazones que patrulla un area y persigue al jugador cuando este entra en su alcance.
  - Colision jugador-enemigo: el jugador pierde un corazon.
  - Muerte del enemigo: al llegar a 0 corazones muere, reaparece en otro punto del mapa y otorga 5 XP.
  - HUD con los corazones del jugador y la experiencia acumulada.
  - Representacion con figuras geometricas de Phaser (sin assets externos).
- No incluye (fase actual):
  - Subida de nivel, aumento de corazones por nivel, victoria en nivel 3 ni reset del nivel por derrota.
  - Multiples tipos de enemigos, menu, sonido, animaciones complejas, mapa con obstaculos ni camara.

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
| Error (build) | Codigo completo | `npm run build` | Compila sin errores; ante fallo se corrige antes de validar | Salida del comando |

## Invariantes

- El Heroe no sale de los limites del mundo.
- Los corazones del jugador y del enemigo nunca bajan de 0.
- El ataque no se re-dispare durante el enfriamiento.
- No se agregan dependencias al proyecto.

## Preguntas abiertas

- Representacion grafica exacta (formas, colores) del Heroe, el enemigo y el arco de ataque.
- Resolucion del canvas (se mantiene 800x600 o se redefine).
- Valores finos del ataque (tamano y angulo del arco, duracion del enfriamiento) y de la patrulla (area, velocidad, alcance).