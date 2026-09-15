# Checklist de prueba manual en navegador

Guia para verificar interactivamente los casos que en `docs/evidencia-pruebas.md` estan marcados como "Pendiente de prueba manual". Se completa despues de observar: la evidencia se escribe despues de probar, nunca antes.

## Como ejecutar

1. `npm run build` tiene que compilar sin errores.
2. `npm run dev` y abrir `http://localhost:5173`.
3. Recorrer los casos en orden; marcar `[x]` y anotar el resultado real en "Resultado / Notas".

## Protocolo ante un fallo

- Reproducir el caso al menos dos veces para confirmar.
- Anotar: como se reproduce, el impacto y si queda corregido o como limite pendiente.
- No reemplazar una validacion por una captura aislada ni por una afirmacion de la herramienta.
- Si algo falla de forma no comprendida o rompe una invariante (p. ej., el heroe atraviesa una pared), frenar y consultar antes de ajustar.

## Valores esperados del juego (referencia)

| Concepto                    | Valor                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Mundo / canvas              | 2000x1500 / 800x600                                                                                               |
| Enemigos                    | 5 iniciales, +2 por subida de nivel (7 en nivel 2)                                                                |
| XP por muerte / por nivel   | 5 XP / 25 XP (victoria en nivel 3 al acumular 50 XP)                                                              |
| Corazones maximos por nivel | 3, 4, 5 (vida llena al subir)                                                                                     |
| Spawn/respawn               | a 240 px o mas del jugador, margen 40 px del borde, a 120 px o mas de otros enemigos                              |
| Ataque                      | arco frontal con clic izquierdo, cooldown ~600 ms, barrido ~250 ms, 1 golpe por enemigo por ataque                |
| Colision heroe-enemigo      | -1 corazon e invulnerabilidad ~1,2 s                                                                              |
| Dash                        | Espacio, 140 px en 200 ms, cooldown 1 s, ultima direccion de movimiento (default abajo), invulnerable en el tramo |
| Reinicio                    | R reinicia tras derrota y tras victoria                                                                           |

---

## A. Base minima (regresion)

- [x] `A1` WASD: el heroe se mueve en las 4 direcciones y en diagonales, a velocidad constante y sin salir del mundo.
- [x] `A2` Ataque con clic izquierdo: aparece el abanico frontal; cada golpe quita 1 corazon al enemigo (3 → 2 → 1 → 0).
- [x] `A3` Muerte del enemigo: reaparece en otro punto con 3 corazones y el HUD suma 5 XP.
- [x] `A4` Colision heroe-enemigo: pierde 1 corazon, parpadea y no recibe daño durante ~1,2 s.
- [x] `A5` Enfriamiento del ataque: un segundo clic muy rapido no dispara hasta terminar el cooldown; un enemigo no recibe 2 golpes en el mismo ataque.

Resultado / Notas:

Sistemas básicos funcionan correctamente

## B. Progresion (Fase 2)

- [x] `B1` Subida de nivel: matar hasta totalizar 25 XP → Nivel 2, maximo 4 corazones, vida llena y aparicion de 2 enemigos mas (7 en total).
- [x] `B2` Excedente de XP: al superar un multiplo de 25, la XP restante queda visible en el HUD.
- [x] `B3` Victoria en nivel 3: matar hasta totalizar 50 XP → aparece "VICTORIA", el combate se detiene (sin daño ni ataques) y R reinicia.
- [x] `B4` Reaparicion lejos del jugador: el enemigo reaparece a 240 px o mas del jugador y con margen de 40 px del borde (probar matando junto a una pared y cerca de un borde).
- [x] `B5` Golpe multiple en el arco: 2 o 3 enemigos juntos dentro del radio y angulo del arco; un clic los golpea a todos (1 golpe por enemigo) incluso si entran al arco durante el barrido; el cooldown se respeta.

Resultado / Notas:

Sistemas de progresión funcionan correctamente

## C. Mapa con obstaculos y camara (Fase 3)

- [x] `C1` Mundo mayor a la pantalla: se recorre un mundo de 2000x1500; la camara se pega a los bordes sin negro y el heroe no sale del mundo.
- [x] `C2` Obstaculos (heroe): caminando de frente, por la ladera y por esquinas contra varias paredes, el heroe se detiene y no las atraviesa.
- [x] `C3` Obstaculos (enemigo): provocar que un enemigo empuje contra una pared; no la atraviesa.
- [x] `C4` Camara sigue al heroe: al mover el heroe hasta las 4 esquinas, la camara lo sigue, se detiene en los bordes del mundo y nunca muestra fuera de el.
- [x] `C5` HUD fijo: con la camara desplazada, Vida/Nivel/XP permanecen fijos en la esquina de la pantalla.
- [x] `C6` Aim con camara: con la camara desplazada, el clic apunta al puntero (coordenadas de mundo), no a la esquina de la pantalla.
- [x] `C7` IA patrulla rodea pared: el enemigo alcanza destinos de patrulla detras de paredes rodeandolas sin atravesarlas.
- [x] `C8` IA persecucion rodea pared: ponerse al otro lado de una pared con un pasillo dentro del rango de agresion → el enemigo da la vuelta por el pasillo y alcanza al jugador sin atravesar la pared.
- [x] `C9` Respawn junto a paredes: matar al enemigo en distintos puntos (junto a paredes y bordes); nunca reaparece dentro de una pared.

Resultado / Notas:

---

## D. Seguimiento directo, vision libre (Fase 3-II)

- [x] `D1` Persecucion en campo abierto: acercarse y alejarse en linea recta de un enemigo con el camino libre → el enemigo sigue directo al jugador, sin sacudidas de ida y vuelta.
- [x] `D2` Persecucion con pared en el camino: ponerse al otro lado de una pared con pasillo dentro del rango → el enemigo rodea por el pasillo y alcanza al jugador sin atravesarla.
- [x] `D3` Patrulla con vision libre: el enemigo va directo a sus destinos de patrulla cuando tiene vision despejada, sin sacudidas.

Resultado / Notas:

---

## E. Sin atasco en el borde de las paredes (Fase 3-III)

- [x] `E1` Persecucion a traves de una pared: ponerse al otro lado de una pared con pasillo dentro del rango → el enemigo rodea por el pasillo sin quedarse trabado en el borde y alcanza al jugador.
- [x] `E2` Sin atasco en el canto: provocar persecucion y patrulla con paredes de frente durante varios minutos → ningun enemigo queda atascado contra el canto; si se traba un instante, avanza para desatascarse.

Resultado / Notas:

---

## F. Escalado de enemigos (Fase 4)

- [x] `F1` Conteo inicial: al correr el juego hay 5 enemigos en el mapa.
- [x] `F2` Conteo por nivel: al subir a nivel 2 hay 7 enemigos simultaneos.
- [x] `F3` Sin apilamiento: los enemigos no aparecen superpuestos ni pegados entre si (a 120 px o mas).

Resultado / Notas:

---

## G. Dash del heroe (Fase 5)

- [x] `G1` Disparador y cooldown: pulsar Espacio varias veces seguidas → un dash por pulsacion, espera de 1 s antes del siguiente y el HUD muestra `Dash: listo` / `recargando x.x s`.
- [x] `G2` Direccion: mover con WASD y soltar, pulsar Espacio → dash hacia la ultima direccion; sin input previo en partida nueva → hacia abajo.
- [x] `G3` Recorte contra paredes y bordes: dash de frente contra varias paredes y contra los bordes del mundo → el heroe termina en la cara del muro/borde sin atravesarlo ni quedar trabado.
- [x] `G4` Invulnerabilidad en el tramo: dash atravesando un enemigo y esperar el fin del dash en contacto → sin perdida de corazones durante el tramo; tras el dash el daño normal vuelve a aplicar (respetando la invuln de 1,2 s).
- [x] `G5` Convivencia con el ataque: dash durante un barrido y atacar durante un dash → ambos coexisten, el arco sigue al heroe y el ataque conserva su cooldown.
- [x] `G6` Freno en fin de partida: ganar o perder y pulsar Espacio → el dash no se dispara; uno en curso queda congelado (R reinicia).

Resultado / Notas:

---

## H. Regresion general

- [x] `H1` Con todo verificado, repetir un pase rapido de A (movimiento, ataque, colision, XP, reinicio) y B3 (victoria): ningun comportamiento previo se altero.

Resultado / Notas:

---

## Cierre de la prueba

Completar tras el pase manual:

1. En `docs/evidencia-pruebas.md`: pasar cada caso verificado de "Pendiente de prueba manual" a "Confirmado" (columna "Resultado observado" y "Evidencia") y corregir la fila de F2 (B1) para reflejar el comportamiento actual (+2 enemigos en nivel 2 → 7 en total).
2. Quitar la frase "queda pendiente de prueba manual" de la fecha de revisado en `docs/informe-final.md` y del "Estado" en `README.md`.
3. Registrar el pase en `docs/registro-intervencion.md`.
4. Commitear el cierre e identificar el commit final para completar la entrega en la plataforma.
