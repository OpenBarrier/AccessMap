Feature: US12: Notificación de Clasificación por IA

  Como usuario que reporta una barrera con foto,
  Quiero recibir una notificación automática que confirme que la IA ha clasificado mi imagen correctamente,
  Para saber que mi reporte fue procesado con éxito.

  Scenario Outline: E1: Clasificación exitosa y notificación de confirmación

    Dado que el usuario ha enviado un reporte de barrera con una <foto>,
    Cuando el sistema de IA procesa la imagen y la clasifica exitosamente como <categoria_detectada>,
    Entonces el sistema actualiza el estado reporte  en la pestaña Perfil dentro de la <subseccion_contribuciones> a <estado_reporte>,
    Y el sistema envía una notificacion push al usuario confirmando el <mensaje_confirmacion>.

  Examples: Datos de entrada
    | foto                   | categoria_detectada |
    | "rampa_danada.jpg"     | "Rampa dañada"      |
    | "bache_calle.png"      | "Bache en la vía"   |
    | "escalera.jpg"         | "Escalera sin rampa"|
    | "acera_danada.png"     | "Aceras dañadas"    |

  Examples: Datos de salida
    | subseccion_contribuciones | estado_reporte                      | mensaje_confirmacion                                                |
    | "Mis Contribuciones"      | "Clasificado: Rampa dañada"         | "Tu reporte ha sido procesado. Barrera identificada: Rampa dañada." |
    | "Mis Contribuciones"      | "Clasificado: Bache en la vía"      | "Tu reporte ha sido procesado. Barrera identificada: Bache en la vía." |
    | "Mis Contribuciones"      | "Clasificado: Escalera sin rampa"   | "Tu reporte ha sido procesado. Barrera identificada: Escalera sin rampa." |
    | "Mis Contribuciones"      | "Clasificado: Aceras dañadas"       | "Tu reporte ha sido procesado. Barrera identificada: Aceras dañadas." |


  Scenario Outline: E2: Clasificación no concluyente y notificación de revisión

    Dado que el usuario ha enviado un reporte de barrera con una <foto>,
    Cuando el sistema de IA procesa la imagen pero no puede clasificarla con alta confianza,
    Entonces el sistema actualiza el <estado_reporte> en la seccion perfil dentro de la subseccion contribuciones 'Mis contribuciones',
    Y el sistema envía una notificacion push al usuario informando el <mensaje_revision>.

  Examples: Datos de entrada
    | foto                  | 
    | "rampa_danada.jpg"    | 
    | "bache_calle.png"     | 
    | "escalera.jpg"        | 
    | "acera_danada.png"    |

  Examples: Datos de salida
    | estado_reporte         | mensaje_revision |                                                                                   |
    | "Pendiente a revisión" | "Gracias por tu reporte. Necesita revisión adicional por la comunidad para confirmar la barrera."    |
    | "Pendiente a revisión" | "Gracias por tu reporte. Necesita revisión adicional por la comunidad para confirmar la barrera."    |
    | "Pendiente a revisión" |"Gracias por tu reporte. Necesita revisión adicional por la comunidad para confirmar la barrera."     |
    | "Pendiente a revisión" |"Gracias por tu reporte. Necesita revisión adicional por la comunidad para confirmar la barrera."     |
