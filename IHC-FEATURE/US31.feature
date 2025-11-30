Feature: US31: Verificación de accesibilidad en eventos públicos

  Como acompañante de una persona con discapacidad,
  quiero que la plataforma me brinde información sobre la accesibilidad de eventos públicos,
  para saber si puedo asistir con la persona que acompañe sin dificultades
  y asegurarme de que disfrutemos de la experiencia.


  Scenario Outline: E1: Consulta y visualización de eventos accesibles

    Dado que el acompañante de una persona con discapacidad busca un evento en la plataforma,
    Cuando ingresa <nombre_evento> o <ubicacion_evento> y selecciona <opcion_busqueda>,
    Entonces el sistema muestra un <listado_eventos_relacionados> junto con su <info_accesibilidad>


  Examples: Datos de entrada
    | nombre_evento        | ubicacion_evento | opcion_busqueda |
    | "Festival Cultural"  | "Parque Central" | "Buscar"        |
    | "Feria Escolar"      | "Plaza Mayor"    | "Buscar"        |
    | "Concierto Solidario"| "Anfiteatro Sur" | "Buscar"        |

  Examples: Datos de salida
    | listado_eventos_relacionados                       | info_accesibilidad           |
    | "Festival Cultural (2 resultados)"                 | "Rampa, ascensor"           |
    | "Feria Escolar (1 resultado)"                      | "Baños accesibles"          |
    | "Concierto Solidario (3 resultados)"               | "Ascensor en mantenimiento" |


  Scenario Outline: E2: Actualización de información de accesibilidad en tiempo real

    Dado que el acompañante consulta los detalles de un evento,
    Cuando el sistema recibe <reporte_nuevo> sobre el estado del lugar 
    Entonces la plataforma actualiza la información 
    Y muestra los cambios al usuario en el <campo_detalles_accesibilidad>


  Examples: Datos de entrada
    | reporte_nuevo                                |
    | "Ascensor fuera de servicio"                 |
    | "Nueva rampa temporal instalada"             |
    | "Baños accesibles cerrados por mantenimiento"|

  Examples: Datos de salida
    | campo_detalles_accesibilidad       |
    | "Ascensor marcado como inactivo"   |
    | "Rampa temporal disponible"        |
    | "Baños accesibles no disponibles"  |
