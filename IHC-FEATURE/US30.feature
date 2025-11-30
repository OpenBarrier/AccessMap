Feature: US30: Filtrar Búsqueda por Atributos Accesibles

  Como usuario al buscar un lugar,
  Quiero filtrar los resultados por atributos accesibles,
  Para encontrar lugares que cumplan criterios como "tiene baño adaptado".


  Scenario Outline: E1: Aplicar filtro de atributo a resultados de búsqueda

    Dado que el usuario ha realizado una búsqueda como "Cafeterías"
    Y está viendo la lista de Resultados de Búsqueda.
    Cuando el usuario selecciona el <boton_filtrar> y elige un <atributo>.
    Entonces la <lista_de_Resultados> se actualiza mostrando únicamente las cafeterías que cumplen con ese atributo.


  Examples: Datos de entrada
    | boton_filtrar | atributo                |
    | "Filtrar"     | "Tiene baño adaptado"   |
    | "Filtrar"     | "Ingreso con rampa"     |

  Examples: Datos de salida
    | lista de resultados                                      |
    | "3 resultados con baño adaptado"                         |
    | "5 resultados con ingreso mediante rampa"                |


  Scenario Outline: E2: Ver indicación de filtros activos

    Dado que el usuario ha aplicado uno o mas <filtro_aplicados> de atributos en la pantalla de Resultados de Búsqueda.
    Cuando el usuario visualiza la lista de resultados filtrada.
    Entonces el sistema muestra un <indicador_filtros> indicando que la vista está restringida.


    Examples: Datos de entrada
    | filtros_aplicados        |
    | Rampa                    |
    | Baño adaptado            |
    | Ascensor - Baño adaptado |

     Examples: Datos de salida
    | indicador_filtros                                       |
    | Filtros aplicados: Baño adaptado                        |
    | Filtros aplicados: Rampa de ingreso                     |
    | Filtros aplicados: Baño adaptado + Asecensor accesible  |


  Scenario Outline: E3: Sin resultados después de aplicar un filtro

    Dado que el usuario está viendo una lista de resultados de búsqueda.
    Cuando el usuario aplica un <filtro_aplicado> que ningún resultado cumple.
    Entonces el sistema vacía la lista de resultados.
    Y el sistema muestra un <mensaje_sin_resultados>.


  Examples: Datos de entrada
    | filtro_aplicado           |
    | "Baño adaptado"           |
    | "Rampa en la puerta"      |
    | "Ascensor accesible"      |

  Examples: Datos de salida
    | mensaje_sin_resultados                          |
    | "No se encontraron lugares con este filtro"      |
    | "No se encontraron lugares con este filtro"      |
    | "No se encontraron lugares con este filtro"      |
