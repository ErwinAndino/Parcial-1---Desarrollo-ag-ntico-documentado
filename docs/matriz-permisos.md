# Matriz de permisos

Completa esta matriz antes de habilitar acciones de un agente. Una accion no declarada debe considerarse prohibida hasta consultar.

| Accion | Estado | Alcance o justificacion |
|---|---|---|
| Leer archivos del proyecto | Permitida | Todo el repositorio (codigo, docs, configuracion), sin incluir secretos. |
| Buscar rutas y simbolos | Permitida | `src/`, `docs/`, `index.html`, `package.json` y archivos de configuracion. |
| Editar archivos previstos | Permitida | `GDD.md`, `README.md` y los documentos de `docs/`; en fase de implementacion, `src/main.js` (o modulos nuevos en `src/`). |
| Ejecutar scripts documentados | Permitida | `npm run dev`, `npm run build` y `npm run preview` (solo a partir de la Fase 2 de implementacion). |
| Instalar dependencias | Prohibida | Requiere consulta previa; el proyecto ya tiene `phaser` y `vite` instalados. |
| Usar red | Prohibida | No corresponde al trabajo actual; requiere autorizacion explicita. |
| Publicar o subir cambios | Prohibida | No se commitea ni se hace push sin orden explicita. |
| Acceder a secretos o credenciales | Prohibida | No corresponde al trabajo. |

## Condiciones de detencion

- Ambiguedad de diseno o alcance no definido (por ejemplo, representacion grafica o valores de combate).
- Necesidad de instalar paquetes, usar red, publicar cambios o acceder a secretos.
- Fallo de `npm run build` o comportamiento inesperado durante las pruebas sin causa comprendida.
- Cambio de motor, de estructura del proyecto o de archivos ajenos al alcance aprobado.