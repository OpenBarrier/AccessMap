Feature: US15: Guardado de Reportes en Modo Offline

  Como usuario en una zona sin conexión a internet,
  quiero poder crear un borrador de un reporte de barrera,
  para que se envíe automáticamente una vez que recupere la conexión.

  Scenario Outline: Guardado automático de borrador al enviar offline (Sin duplicados)

    Dado que el usuario ha completado los <campos_reporte> en la pantalla reporte de barrera pero se encuentra sin conexión.
    Y el sistema no detecta un borrador duplicado pendiente para esa ubicacion
    Cuando el usuario hace clic en el <boton_enviar>
    Entonces el sistema detecta la falta de <conexion>
    Y guarda el reporte localmente en <seccion_borradores>
    Y muestra un <mensaje_sistema>.

  Examples: Datos de entrada
    | campos_reporte                | boton_enviar |
    | "todos los campos completos"  | "Enviar"     |
    | "todos los campos completos"  | "Enviar"     |
    | "todos los campos completos"  | "Enviar"     |
    | "todos los campos completos"  | "Enviar"     |

  Examples: Datos de salida
    | conexion       | seccion_borradores      | mensaje_sistema                                                   |
    | "desconectado" | "Borradores pendientes" | "Sin conexión. Tu reporte se ha guardado como borrador y se enviará automáticamente." |
    | "offline"      | "Borradores pendientes" | "Sin conexión. Tu reporte se ha guardado como borrador y se enviará automáticamente." |



  Scenario Outline: E2: Visualización de borradores offline pendientes

    Dado que el usuario ha guardado uno o más reportes offline
    Y el usuario desea revisar sus reportes pendientes
    Cuando el usuario accede a la <seccion_mis_contribuciones> y selecciona la pestaña <pestana>
    Entonces el sistema muestra <reportes_guardados>
    Y indica el <estado_envio> de cada uno.

  Examples: Datos de entrada
    | seccion_mis_contribuciones | pestana |
    | "Mis Contribuciones"       | "Borradores Pendientes"  |


  Examples: Datos de salida
  | reportes_guardados                                 | estado_envio   |
  | "Reporte 1: Rampa dañada"                          | "Pendiente"    |
  | "Reporte 2: Bache, Reporte 2: Escalera sin rampa"  | "Enviando"     |
  | "Reporte 3: Acera dañada                           | " Error"       |