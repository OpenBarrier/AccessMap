Feature: US46: Geolocalización Rápida y Precisa

  Como usuario en movimiento,
  Quiero que la aplicación me geolocalice de forma rápida y con alta precisión
  Para que el cálculo de mi ruta sea exacto en todo momento.

  Scenario Outline: E1: Alta precisión de geolocalización inicial

    Dado que tengo los servicios de ubicación <estado_servicios>
    Cuando abro la aplicación y esta busca mi ubicación actual
    Entonces mi posición en el mapa debe ser identificada con una precisión máxima de <precision_max>
    Y el tiempo de identificación no debe ser mayor a <tiempo_max>

    Examples: Datos de entrada
      | estado_servicios    |
      | activado         |

    Examples: Datos de salida
      | precision_max | tiempo_max |
      | "3 metros"    | "2 segundos" |

    Scenario Outline: E2: Geolocalización fluida en movimiento

    Dado que estoy siguiendo una ruta planificada
    Y me muevo en <tipo_movimiento>
    Cuando la aplicación recibe datos de ubicación en tiempo real
    Entonces la aplicación mantiene mi posición en el centro de la pantalla
    Y debe <recalcular_ruta_actualizar_posicion> de forma fluida y sin demora.

    Examples: Datos de entrada 
      | tipo_movimiento           |
      | "caminando por la ciudad" | 
      | "en bicicleta por parque" |
      | "en autobús urbano"       | 
      | "en tren de cercanías"    |

      Examples: Datos de Salida
      | recalcular_ruta_actualizar_posicion>                                               |
      | "La app detecta que desvié 15 m y recalcula: 'Gira a la izquierda en 10 metros'."  |            
      | "La app genera una ruta nueva al tomar otra calle: 'Ruta alternativa disponible'." |
      | "El sistema ajusta la ruta por tráfico: 'Se ha encontrado un camino más rápido'."   |
      | "La app recalcula por bloqueo vial: 'Desvío detectado, recalculando ruta…'."        |