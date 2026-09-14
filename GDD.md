# GDD simplificado

## Juego y experiencia

Escena 2D de vista superior en donde el jugador controla el Heroe que debe matar monstruos alrededor del mapa para conseguir experiencia y subir de nivel. El jugador puede atacar con el click izquierdo del mouse para atacar en un arco en frente del personaje con una espada, el jugador puede recibir daño si colisiona contra un monstruo, el jugador cuenta con 3 corazones si su vida llega a 0 pierde y se resetea el nivel los enemigos patrullan un área y se acercan al jugador cuando este esta a su alcance, los enemigos tienen 3 corazones y al llegar a 0 muren y aparece otro en otro punto del mapa, al matar un enemigo el jugador consigue 5 de experiencia al llegar a 25 de XP sube de nivel y aumenta su numero de corazones, al llegar al nivel 3 gana el juego

## Comportamiento a resolver

Crear personaje que se mueva con WASD y ataque con el click izquierda del mouse

## Reglas

- Estados, condiciones o eventos relevantes:
  - El jugador (Heroe) tiene 3 corazones. Si su vida llega a 0 pierde y se resetea el nivel.
  - El jugador ataca con el clic izquierdo del mouse en un arco frente al personaje con una espada.
  - El jugador recibe daño si colisiona contra un monstruo.
  - Los enemigos tienen 3 corazones y patrullan un area.
  - Los enemigos se acercan al jugador cuando este esta a su alcance.
  - Al matar un enemigo, este muere (reaparece en otro punto del mapa) y el jugador consigue 5 de experiencia.
  - Al llegar a 25 de XP el jugador sube de nivel y aumenta su numero de corazones.
  - Al llegar al nivel 3 el jugador gana el juego.
- Accion del jugador o del entorno:
  - El jugador se mueve con las teclas WASD.
  - El jugador ataca con el clic izquierdo del mouse.
  - Los enemigos patrullan su area y persiguen al jugador cuando entra en su alcance.
- Resultado esperado:
  - El Heroe mata monstruos, consigue experiencia, sube de nivel y gana al alcanzar el nivel 3.
  - Si la vida del Heroe llega a 0, se pierde y el nivel se resetea.
- Caso limite: el ataque solo afecta enemigos dentro del arco frontal; los enemigos fuera del arco o del alcance no deben recibir daño, y el Heroe no puede atacar mas alla de esos limites.

## Limites

- Fuera de alcance (fase actual "base minima"):
  - El sistema completo de niveles, victoria en nivel 3 y reset por derrota queda definido en el GDD pero se implementa en una fase posterior.
  - No hay assets externos (imagenes, sonidos ni plugins de terceros); la representacion usa figuras geometricas de Phaser.
- Restricciones tecnicas: Phaser 4.2.1 con Vite 8.3.0, JavaScript en modulos ES, sin dependencias adicionales. No se usa red ni se publican cambios sin autorizacion.
- Criterios de aceptacion: el Heroe se mueve con WASD; el ataque con clic izquierdo golpea en un arco frontal; existe al menos un enemigo con 3 corazones que patrulla y persigue; al morir el enemigo reaparece en otro punto y otorga 5 XP; el juego compila con `npm run build`.

El GDD delimita la intencion de diseno. La especificacion y el plan convierten esa intencion en una intervencion tecnica verificable.
