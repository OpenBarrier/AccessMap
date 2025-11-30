Feature: US35: Filtrado por Accesibilidad Temporal

  Como usuario,
  Quiero poder ver las barreras que se han reportado en las últimas 24 horas o la última semana,
  Para saber si un obstáculo es nuevo o temporal.

  Scenario Outline: E1: Visualización de barreras urgentes (últimas 24 horas)

    Dado que el usuario está visualizando la pantalla del Mapa principal,
    Cuando el usuario accede a las opciones de Filtro del mapa y selecciona <filtro_urgente>,
    Entonces el sistema muestra en el mapa únicamente las barreras reportadas en las últimas 24 horas,
    Y las resalta con un color de alta visibilidad que indique su urgencia <barreras_mostradas>.

  Examples: Datos de entrada
    | filtro_urgente                   |
    | Reportes Urgentes (Últimas 24h)  |

  Examples: Datos de salida
    | barreras_mostradas                               |
    | Solo barreras reportadas en las últimas 24 horas |

  Scenario Outline: E2: Análisis de actividad reciente (última semana)

    Dado que el usuario desea conocer las tendencias de accesibilidad a corto plazo 
    Y está visualizando la pantalla del Mapa principal,
    Cuando el usuario accede a las opciones de Filtro del mapa y selecciona <filtro_urgente>,
    Entonces el Mapa se actualiza mostrando los iconos de las barreras reportadas en los últimos 7 días,
    Y oculta automáticamente los reportes no validados o que superen ese periodo <barreras_mostradas>.

  Examples: Datos de entrada
    | filtro_urgente                    |
    | Actividad Reciente (Última Semana)|

  Examples: Datos de salida
    | barreras_mostradas                          |
    | Barreras reportadas en los últimos 7 días   |
