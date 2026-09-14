# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios.

## Rutas y simbolos relevantes

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `index.html` | Carga la aplicacion como modulo ESM: `<script type="module" src="/src/main.js">`. Idioma `es`, titulo "Parcial 1 - Phaser". | Lectura directa del archivo (11 lineas). |
| `src/main.js` | Crea `new Phaser.Game(config)` con una escena inline de una sola capa que dibuja el texto estatico "PHASER FUNCIONANDO" (canvas 800x600, fondo `#222222`). No hay `update`, entrada, fisica ni assets. | Lectura directa (19 lineas): lineas 3-17 config, linea 19 instancia del juego. |
| `package.json` | Declara `type: "module"`, scripts `dev`, `build` y `preview` (Vite), dependencia `phaser: ^4.2.1` y devDependency `vite: ^8.3.0`. | Lectura directa del archivo. |
| `node_modules/phaser/package.json` | Version realmente instalada de Phaser: `4.2.1`. | `node -e "console.log(require('./node_modules/phaser/package.json').version)"`. |
| `node_modules/vite/package.json` | Version realmente instalada de Vite: `8.3.0`. | Mismo procedimiento con el paquete de Vite. |
| `.gitignore` | Solo reglas genericas (`.DS_Store`, `Thumbs.db`, `.env`). No incorpora reglas oficiales de motor ni de Vite/node (no ignora `dist/` ni `node_modules/`). | Lectura directa del archivo. |
| `README.md` | Plantilla PIAPC sin completar: estudiante, materia, nombre y motor en `[PENDIENTE]`. | Lectura directa (40 lineas). |
| `GDD.md` | Define la experiencia (heroe, monstruos, XP, niveles, victoria en nivel 3) y el "Comportamiento a resolver": movimiento WASD + ataque con clic izquierdo del mouse. | Lectura directa; ademas `git status` lo marca como modificado y `git diff` muestra el contenido escrito por el estudiante. |
| `node_modules/` | Dependencias instaladas. No esta ignorada en `.gitignore`. | Directorio presente en el arbol; verificar que git la excluya. |

## Flujo observado

`index.html` carga `src/main.js`. El modulo importa Phaser y crea un juego con una escena cuyo hook `create()` agrega un objeto de texto centrado. No existen capas de entrada, actualizacion de estado ni fisica: el comportamiento observable se limita a una imagen estatica por frame. No hay ruta de assets, estados de escena, ni logica de juego.

## Pruebas y comandos disponibles

| Comando o prueba | Que verifica | Resultado inicial |
|---|---|---|
| `npm run dev` | Levanta el servidor de desarrollo de Vite para probar `index.html` y `src/main.js`. | No ejecutado en esta fase (solo-lectura). |
| `npm run build` | Compila el proyecto a produccion; detecta errores de sintaxis o resolucion de modulos. | No ejecutado en esta fase (solo-lectura). |
| `npm run preview` | Sirve el build generado para verificacion local. | No ejecutado en esta fase (solo-lectura). |
| Pruebas automatizadas | No existen scripts de test ni framework de testing declarado. | No aplica. |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados:
  - Motor instalado: Phaser `4.2.1` con Vite `8.3.0`, JavaScript ES modules.
  - El codigo actual es una escena "hola mundo" sin logica de juego ni assets.
  - El GDD define la experiencia completa y la base minima a resolver (WASD + ataque con clic izquierdo).
  - `docs/` contiene plantillas de proceso mayormente sin completar.
  - Git tiene 2 commits; `main` esta adelante 1 commit de `origin/main`; `GDD.md` tiene cambios sin commitear.
  - No hay scripts de prueba ni version publicada de entrega.
- Supuestos por verificar:
  - El alcance acordado es el minimo del GDD: movimiento WASD, ataque con clic izquierdo y al menos un enemigo para verificar el ataque.
  - La orientacion del ataque se definira en la especificacion (direccion del ultimo movimiento o hacia el puntero).
- Preguntas para consultar:
  - Representacion grafica de heroe, enemigos y arco de ataque (figuras geometricas de Phaser, sin assets externos).
  - Resolucion del canvas (se mantiene 800x600 o se redefine).
  - Detalles del ataque (tamano del arco, enfriamiento) y de la patrulla enemiga.