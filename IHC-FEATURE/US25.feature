Feature: US25: Unirse a grupos de usuarios locales

  Como persona con movilidad reducida circunstancialmente,
  Quiero unirme a grupos locales dentro de la plataforma,
  Para poder intercambiar información sobre barreras y accesibilidad específica de mi comunidad.


  Scenario Outline: Escenario 1: Unirse a un grupo local

    Dado que una persona con movilidad reducida circunstancialmente está en la pestaña "Comunidad"
    Y ha seleccionado la subsección Grupos y encuentra un grupo local que le interesa.
    Cuando la persona hace clic en el <boton_unirse>.
    Entonces el sistema permitirá que la persona se una al grupo
    Y reciba <notificaciones> de nuevas actividades.

    Examples: Datos de entrada
    | boton_unirse     |
    | "Unirse al grupo |
   
  Examples: Datos de salida
    | notificaciones                                                   |
    | "Notificación: Nuevo reporte de rampa dañada en tu zona"         |
    | "Notificación: Nueva discusión abierta sobre veredas bloqueadas" |


  Scenario Outline: E2: Notificaciones del grupo

    Dado que una persona con movilidad reducida circunstancialmente es miembro de un grupo local.
    Cuando la persona realice algún reporte de algún obstáculo, va a tener la opción de <opcion_envio> con un casillero de búsqueda de grupos debajo.
    Entonces el sistema mostrará el <reporte_generado> y enviará una <notificacion> a las personas del grupo.

    Examples: Datos de entrada
    | opcion_envio                  | 
    | "Enviar reporte a Grupo(s)"   | 

    Examples: Datos de salida
    | reporte_generado                                           | notificacion                                                   |
    | "Reporte: Vereda rota frente al Parque Kennedy"            | "Alerta: Se registró un nuevo obstáculo en tu zona"            |
    | "Reporte: Ascensor fuera de servicio en Estación Angamos"  |"Notificación: Un miembro reportó un problema de accesibilidad" |


  Scenario Outline: Escenario 3: Dejar un grupo local

    Dado que una persona con movilidad reducida circunstancialmente es miembro de un grupo local
    y está en la subsección “Grupos”.
    Cuando la persona decide dejar el grupo presionando el <boton_abandonar>.
    Entonces el sistema eliminará a la persona del grupo <grupo_abandonado>
    y dejará de enviarle notificaciones relacionadas a ese grupo.

    Examples: Datos de entrada
    | boton_abandonar    |
    | "Abandonar grupo"  |

    Examples: Datos de salida
    | grupo_abandonado                   |
    | "Grupo 'Accesibilidad Miraflores'" |
    | "Grupo 'Lima Centro Accesible'"    |