Feature: US28: Filtros de accesibilidad

  Como persona en silla de ruedas,
  Quiero filtrar el mapa por tipo de barrera (rampas, ascensores, veredas),
  Para encontrar la información que más se ajuste a mis necesidades.

  Scenario Outline: Aplicar un filtro de tipo de barrera

    Dado que el usuario está visualizando la pantalla de 'Mapa principal',
    Cuando accede a la opción "Filtros" en un icono en el mapa y selecciona un <tipo_barrera> de la lista predefinida,
    Entonces el sistema actualiza la vista del Mapa para mostrar únicamente los <marcadores_mostrados> a ese tipo de barrera.

  Examples: Datos de entrada
    | tipo_barrera          |
    | Rampas dañadas        |
    | Escaleras sin rampa   |
    | Obstrucciones en Via  |

  Examples: Datos de salida
    | marcadores_mostrados        |
    | Solo rampas dañadas         |
    | Solo Escaleras sin rampa    |
    | Solo Obstrucciones en vía   |

  Scenario Outline: Desactivar filtros de barrera

    Dado que el usuario tiene filtros de barrera activos en la pantalla del Mapa,
    Cuando el usuario accede nuevamente a "Filtros" y selecciona la opción "Mostrar todo" o desmarca los filtros activos,
    Entonces el sistema vuelve a mostrar todos los tipos de marcadores de barreras reportadas en la pantalla del Mapa <marcadores_mostrados>.

  Examples: Datos de salida
    | marcadores_mostrados        |
    | Solo rampas dañadas         |
    | Solo Escaleras sin rampa    |
    | Solo Obstrucciones en vía   |
    | Aceras estrechas            |
    | baches                      |
