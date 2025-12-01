Feature: US10: Reporte de barreras en tiempo real

  Como persona con discapacidad motriz permanente,
  Quiero reportar obstáculos urbanos con foto y ubicación
  Para alertar a otros usuarios y mejorar la precisión del mapa.

  Scenario Outline: E1: Envío exitoso de reporte con foto y ubicación

    Dado que el usuario ha completado los campos requeridos en la vista de creación de reporte,
    Cuando el usuario adjunta una <foto>, escribe un <comentario>, la <ubicacion> es precisa, y presiona <boton_enviar>,
    Entonces el sistema registra el reporte, muestra una <mensaje_confirmacion>, y lo marca como estado_reporte en el historial del usuario.

  Examples: Datos de entrada
    | foto                  | comentario                        | ubicacion                               | boton_enviar |
    | "rampa_obstruida.jpg" | "Rampa bloqueada por auto"        | "av.mexico jr.los olivos"               | "Enviar Reporte"     |
    | "bache_calle.png"     | "Bache grande cerca de la esquina"| "av. 2 de mayo"                         | "Enviar Reporte"     |
    | "escalera.jpg"        | "Escaleras sin rampa de acceso"   | "calle 3 de mayo- av. los jardines"     | "Enviar Reporte"     |
    | "acera_danada.png"    | "Aceras rotas impiden paso"       | "av. los olivos - jr. los jardines"     | "Enviar Reporte"     |

  Examples: Datos de salida
    | mensaje_confirmacion                                                                         | 
    | "¡Gracias! Reporte en procesamiento. Puede seguri su estado en el "Historial del usuario"    |     



  Scenario Outline: E2: Error por falta de ubicación (GPS desactivado)

    Dado que el usuario intenta crear un reporte y tiene <conexion_internet>, pero sus servicios de <gps_estado>,
    Cuando el usuario presiona <boton_enviar>,
    Entonces el sistema <accion_sistema>, y muestra el <mensaje_error>.

  Examples: Datos de entrada
    | conexion_internet | gps_estado         | boton_enviar |
    | "activa"          | "desactivados"     | "Enviar"     |


  Examples: Datos de salida
    | accion_sistema       | mensaje_error                                                                        |
    | "no envía el reporte"| "Se requiere tu ubicación precisa. Por favor, activa el GPS para enviar el reporte." |
   
