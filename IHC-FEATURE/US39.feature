Feature: US39: Recordatorio de rutas frecuentes

  Como usuario con movilidad reducida temporal,
  Quiero recibir un recordatorio de mis rutas frecuentes,
  Para poder iniciar mi ruta con un solo clic.


  Scenario Outline: E1: Iniciar navegación desde notificación

    Dado que el usuario tiene una ruta frecuente guardada como <nombre_ruta> con un <horario>
    Cuando se acerca la hora, el sistema envía una notificación push
    Y el usuario toca el botón <boton_iniciar>
    Entonces la aplicación AccessMap se abre
    Y carga directamente la pantalla de Navegación para esa ruta.

    Examples: Datos de entrada
      | nombre_ruta             | horario     | boton_iniciar   |
      | "Casa a Terapia"        | "08:00 AM"  | "Iniciar Ruta"  |
      | "Casa a Rehabilitación" | "03:30 PM"  | "Iniciar Ruta"  |
      | "Trabajo a Terapia"     | "06:10 PM"  | "Iniciar Ruta"  |
      | "Casa al Hospital"      | "09:45 AM"  | "Iniciar Ruta"  |


  Scenario Outline: E2: Cancelación o posposición del recordatorio

    Dado que el usuario ha recibido un recordatorio de una ruta frecuente
    Cuando el usuario hace clic en <accion_recordatorio>
    Entonces el sistema detiene la acción de iniciar la navegación automáticamente <accion>.

    Examples: Datos de entrada
      | accion_recordatorio |
      | "Cancelar"          |
      | "Posponer"          |

    Examples: Datos de salida
      | accion                      |
      | navegación detenida         |


  Scenario Outline: E3 - Visualizar rutas frecuentes en Home

    Dado que el usuario ha iniciado sesión
    Y tiene rutas guardadas como "frecuentes"
    Cuando el usuario accede a la pantalla "Home"
    Y visualiza la sección "Tus Rutas Frecuentes"
    Entonces el sistema muestra un resumen de las <rutas_relevantes> con un <boton_iniciar_ahora>
    Y el sistema muestra un boton_ver todas que redirige a la subsección "Mis Rutas Guardadas", abriendo directamente la pestaña "Frecuentes"


    Examples: Datos de salida
      | resumen_rutas           | boton_iniciar    |
      | "Casa a Terapia"        | "Iniciar ahora"  | 
      | "Casa a Rehabilitación" | "Iniciar ahora"  | 
      | "Trabajo a Terapia"     | "Iniciar ahora"  | 
    
