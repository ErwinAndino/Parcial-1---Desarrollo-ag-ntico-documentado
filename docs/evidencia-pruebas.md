# Evidencia de pruebas

Relaciona cada criterio de aceptacion con una prueba o secuencia manual que otra persona pueda repetir.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Movimiento con WASD | Local (sin commit) | `npm run dev` + secuencia manual | 1. `npm run dev`. 2. Abrir `http://localhost:5173`. 3. Mantener W/S/A/D y combinaciones. | El cuadrado azul se mueve en la direccion presionada al mismo largo (velocidad constante) y no sale del mundo. | Confirmado: el heroe se mueve correctamente en las 4 direcciones y en diagonales, sin salir del mundo. | Prueba manual del estudiante en navegador + salida de `npm run build`. |
| Ataque con clic izquierdo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Provocar que el enemigo quede frente al heroe. 2. Clic izquierdo cerca del enemigo. 3. Repetir hasta 0 corazones. | Aparece un abanico dorado frontal; cada golpe quita 1 corazon al enemigo (HUD encima del enemigo bajan de 3 a 2 a 1 a 0). | Confirmado: el abanico aparece y el enemigo pierde un corazon por golpe hasta morir. | Prueba manual del estudiante en navegador. |
| XP por muerte de enemigo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Reducir el enemigo a 0 corazones. | El enemigo reaparece en otro punto con 3 corazones y el HUD suma 5 de XP. | Confirmado: al morir el enemigo reaparece con 3 corazones y el HUD suma 5 de XP. | Prueba manual del estudiante en navegador. |
| Caso limite: colision jugador-enemigo | Local (sin commit) | `npm run dev` + secuencia manual | 1. Acercar el heroe al enemigo hasta tocarlo. | El heroe pierde 1 corazon, parpadea en blanco y no vuelve a recibir daño durante ~1,2 s. | Confirmado: al colisionar el heroe pierde 1 corazon y queda en invulnerabilidad temporal. | Prueba manual del estudiante en navegador. |
| Caso limite: enfriamiento del ataque | Local (sin commit) | `npm run dev` + secuencia manual | 1. Clic izquierdo dos veces seguidas muy rapido. | El segundo clic no dispara hasta que termina el enfriamiento (~600 ms); un enemigo no recibe 2 golpes en un mismo ataque. | Confirmado: el ataque respeta el enfriamiento y no aplica doble golpe por ataque. | Prueba manual del estudiante en navegador. |
| Error: build | Local (sin commit) | `npm run build` | Ejecutar el comando. | Compila sin errores. | Compila en 542 ms, 5 modulos transformados; solo advertencia de chunk > 500 kB (no bloqueante). | Salida completa del comando. |

## Fallos y limites pendientes

- Reproduccion: ninguno; todos los criterios de aceptacion fueron confirmados por prueba manual del estudiante en navegador.
- Impacto: la advertencia de tamano de chunk de Vite (~1,38 MB) no impide ejecutar ni compilar; puede revisarse con code-splitting en una fase posterior.
- Decision: criterios validados; el codigo queda local sin commit hasta que el estudiante decida publicar.