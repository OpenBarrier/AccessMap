Feature: US6: Notificaciones de alertas
  Como persona con discapacidad motriz permanente,
  Quiero recibir alertas en tiempo real sobre nuevos obstáculos en mi ruta
  Para poder desviarme a tiempo y evitar accidentes.

Scenario Outline: E1: Recepción de alerta en tiempo real

    Dado que el usuario se encuentra en la "Vista de Navegación Activa" y tiene las <notificaciones>
    Cuando el sistema recibe un <reporte_obstaculo> a menos de <distancia> de la posición actual
    Entonces el sistema emite una <alerta audible y visual> en la vista navegacion
    Y pregunta si el usuario desea <accion_usuario>

  Examples: Datos de entrada
    | notificaciones        | reporte_obstaculo        | distancia   |
    | "activadas"           | "Rampa dañada"           | "50 metros" |
    | "activadas"           | "Bache profundo"         | "30 metros" |
    | "activadas"           | "Escalera sin rampa"     | "80 metros" |
    | "activadas"           | "Obstáculo en vía"       | "90 metros" |

  Examples: Datos de salida
    | alerta audible y visual                                        | accion_usuario|   
    | "alerta audible y banner visual: Rampa dañada, 50 metros"      | "no Recalcular" |
    | "alerta audible y banner visual: Bache profundo, 30 metros"    | "no Recalcular" |
    | "alerta audible y banner visual: Escalera sin rampa, 80 metros"| "Recalcular"    |
    | "alerta audible y banner visual: Obstáculo en vía, 90 metros"  | "Recalcular"    |


Scenario Outline: E2: Alerta de notificaciones desactivadas

    Dado que el usuario intenta iniciar una ruta desde la pantalla "Planificación de ruta"
    Cuando el sistema detecta que los <permisos_notificacion> están desactivados
    Entonces el sistema muestra un <mensaje_sistema> al iniciar la vista de navegacion

  Examples: Datos de entrada
    | permisos_notificacion |
    | "desactivados"        |
  Examples: Datos de salida
    | mensaje_sistema                                                                                                       | 
    | "Notificaciones de Alerta Desactivadas. Actívalas en la configuración para recibir avisos de peligro en tiempo real." | 
    
