Feature: US55: Encuesta de satisfacción del usuario

  Como persona con discapacidad motriz permanente,
  Quiero recibir encuestas de satisfacción para proporcionar mi retroalimentación sobre la plataforma,
  Para ayudar a mejorar la accesibilidad y la experiencia general del servicio para mí y otros usuarios.

  Scenario Outline: E1: Recibir y completar la encuesta tras una ruta

    Dado que una persona con discapacidad motriz permanente ha finalizado una ruta guiada por la app,
    Cuando el usuario llega a su destino y abre la app
    Entonces el sistema muestra una encuesta con <calificacion_estrellas> y un campo de <comentarios>
    Y el usuario completa la encuesta y presiona <boton_enviar>
    Y el sistema registra su respuesta en la <base_datos>.

    Examples: Datos de entrada
      | calificacion_estrellas | comentarios                             | boton_enviar |
      | 5                      | "Ruta muy accesible y precisa."         | "Enviar"     |
      | 4                      | "En general bien, algunos obstáculos."  | "Enviar"     |
      | 3                      | "La ruta funcionó pero podría mejorar." | "Enviar"     |
      | 2                      | "Tuve dificultades con accesibilidad."  | "Enviar"     |

    Examples: Datos de salida
      | base_datos              |
      | "respuesta registrada"  |


  Scenario Outline: E2: Omitir encuesta

    Dado que el usuario recibe la notificación de la encuesta de satisfacción al finalizar su ruta,
    Cuando el usuario presiona el <boton_omitir>
    Entonces la encuesta se cierra
    Y el sistema no vuelve a solicitarla durante la misma sesion.

    Examples: Datos de entrada
      | boton_omitir |
      | "Omitir"     |

