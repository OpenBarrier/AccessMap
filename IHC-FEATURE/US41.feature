Feature: US41 - Personalización de notificaciones

  Como usuario con movilidad reducida temporal,
  Quiero configurar qué tipo de notificaciones recibir (alertas de barreras, actualizaciones de lugares, recordatorios de rutas),
  Para que solo me lleguen las notificaciones que necesito.


  Scenario Outline: E1: Configuración exitosa de tipos de notificaciones

    Dado que el usuario ha iniciado sesión en la aplicación
    Y se encuentra en la sección "Configuración" y ha seleccionado la subsección "Notificaciones"
    Cuando el usuario selecciona <tipos_notificaciones> que desea recibir.
    Y hace clic en <boton_guardar>
    Entonces el sistema guarda las preferencias seleccionadas
    Y muestra un <mensaje_confirmacion>

    Examples: Datos de entrada
      | tipos_notificaciones                               | boton_guardar          |
      | "Alertas de barreras, Recordatorios de rutas"      | "Guardar configuración" |
      | "Actualizaciones de lugares, Alertas de barreras"  | "Guardar configuración" |
      | "Recordatorios de rutas"                           | "Guardar configuración" |
      | "Actualizaciones de lugares"                       | "Guardar configuración" |

    Examples: Datos de salida
      | mensaje_confirmacion                                  |
      | "Configuración de notificaciones actualizada"         |


  Scenario Outline: E2:  Desactivar todas las notificaciones

    Dado que el usuario ha iniciado sesión y está en la sección "Configuración" y ha seleccionado la subsección "Notificaciones"
    Cuando desactiva <todas_las_notificaciones>
    Y hace clic en <boton_guardar>
    Entonces el sistema actualiza la configuración
    Y confirma al usuario <mensaje_confirmacion>

    Examples: Datos de entrada
      | todas_las_notificaciones                | boton_guardar            |
      | "todas las notificaciones desactivadas" | "Guardar configuración" |


    Examples: Datos de salida
      | mensaje_confirmacion                      |
      | "Has desactivado todas las notificaciones" |


  Scenario Outline: E3: Intentar guardar configuración sin cambios

    Dado que el usuario se encuentra en la sección "Configuración" y ha seleccionado la subsección "Notificaciones"
    Y no realiza ningún cambio en las opciones existentes
    Cuando hace clic en <boton_guardar>
    Entonces el sistema mantiene la configuración actual
    Y muestra un <mensaje_confirmacion>

    Examples: Datos de entrada
      | boton_guardar            |
      | "Guardar configuración"  |

    Examples: Datos de salida
      | mensaje_confirmacion                           |
      | "No se realizaron cambios en la configuración" |
   
