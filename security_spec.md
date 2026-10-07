# Especificación de Seguridad de Reglas Firestore: CIB-IMS (República de Panamá)

## 1. Invariantes de Datos y Cadena de Custodia Forense

1. **Invariante de Dominio Institucional:**
   Únicamente usuarios autenticados con dirección de correo electrónico institucional válida `@cib.gob.pa` pueden leer expedientes, evidencias y normativas.

2. **Invariante de Inmutabilidad de Prueba y Sellado Forense:**
   Cualquier expediente (`/cases/{caseCode}`) cuyo estado sea `CERRADO` o `EN_AUDITORIA` queda inmediatamente bloqueado contra cualquier operación de actualización (`update`) o borrado (`delete`). La manipulación post-cierre viola la cadena de custodia forense y es rechazada a nivel de reglas de base de datos.

3. **Invariante de Jerarquía en Subcolecciones:**
   Las subcolecciones `/evidence`, `/timeline` y `/interrogations` dependen del estado del caso padre. Si el caso no se encuentra en estado `ABIERTO`, ninguna subcolección puede ser modificada.

4. **Invariante de Integridad del Código de Caso:**
   El campo `codigo` del documento debe coincidir estrictamente con el ID del documento `{caseCode}` para evitar colisiones o secuestros de llaves.

## 2. Escenarios de Ataque ("The Dirty Dozen" Payloads)

| # | Vector de Ataque | Payload Objetivo | Resultado Esperado |
|---|---|---|---|
| 1 | Intento de lectura no autenticado | `GET /cases/CIB-2026-001-TG` sin token | `PERMISSION_DENIED` |
| 2 | Intento con dominio externo | Usuario autenticado `hacker@gmail.com` intenta leer `/cases` | `PERMISSION_DENIED` |
| 3 | Modificación de caso cerrado | `UPDATE /cases/CIB-2026-001-TG` seteando `title: 'Hacked'` | `PERMISSION_DENIED` |
| 4 | Modificación de caso en auditoría | `UPDATE /cases/CIB-2026-002-PC20` cuando `status == 'EN_AUDITORIA'` | `PERMISSION_DENIED` |
| 5 | Inyección de artefacto en caso cerrado | `POST /cases/CIB-2026-001-TG/evidence/EV-999` | `PERMISSION_DENIED` |
| 6 | Alteración de bitácora sellada | `UPDATE /cases/CIB-2026-003-PE/timeline/3` | `PERMISSION_DENIED` |
| 7 | Borrado no autorizado de caso abierto | Agente normal intenta `DELETE /cases/CIB-2026-002-PC20` | `PERMISSION_DENIED` (Solo director) |
| 8 | Creación de caso con código discordante | `POST /cases/CIB-2026-999` con payload `{ codigo: 'OTHER-CODE' }` | `PERMISSION_DENIED` |
| 9 | Forzado de auto-promoción de rol | Cadete intenta modificar su rol a `COMISIONADO_DIRECTOR` en `/users` | `PERMISSION_DENIED` |
| 10| Alteración de marco normativo | Agente intenta sobrescribir `/regulations/LEY-81-2019` | `PERMISSION_DENIED` (Solo director) |
| 11| Intento de reabrir caso sellado | Enviar `UPDATE` a caso cerrado cambiando `status: 'ABIERTO'` | `PERMISSION_DENIED` |
| 12| Spoofing de identidad en auditoría | Intentar escribir como `usuario1@cib.gob.pa` desde otra cuenta | `PERMISSION_DENIED` |
