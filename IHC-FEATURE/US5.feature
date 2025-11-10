Feature: US5: Elección de rutas accesibles

  Como usuario con movilidad reducida,
  Quiero que la aplicación me sugiera 2 rutas accesibles,
  Para poder elegir la que mejor se adapte a mis necesidades.

Scenario Outline: E1: Sugerencia exitosa de dos rutas accesibles

    Dado que el usuario ha ingresado <origen> y <destino> en la "Barra de Búsqueda" de la pestaña Mapa,
    Cuando el usuario hace clic en "Buscar Rutas",
    Entonces el sistema muestra en la Pantalla "Planificación de Ruta" <ruta_A> y <ruta_B>,
    Y muestra sus atributos de <atributos_comparacion>,
    Y el usuario puede seleccionar una de ellas para iniciar la navegación.

  Examples: Datos de entrada
    | origen       | destino        |
    | Plaza Mayor  | Parque Central |
    | Estación A   | Hospital B     |
    | Casa         | Universidad    |

  Examples: Datos de salida
    | ruta_A                 | ruta_B                  | atributos_comparacion                        |
    | Ruta por Av. Principal | Ruta por Calle Secundaria| Tiempo: 15 min, Distancia: 2 km, Barreras: 1|
    | Ruta por Calle 1       | Ruta por Calle 2        | Tiempo: 20 min, Distancia: 3 km, Barreras: 0|
    | Ruta por Calle X       | Ruta por Calle Y        | Tiempo: 12 min, Distancia: 1.5 km, Barreras: 2|

  Scenario Outline: E2: No se encontraron rutas accesibles

    Dado que el usuario ingresó <destino> en la "Barra de Búsqueda",
    Cuando no existen rutas accesibles disponibles para el destino ingresado,
    Entonces el sistema muestra en la Pantalla "Planificación de Ruta" el <mensaje_error>.

  Examples: Datos de entrada
    | destino       |
    | Parque Central|
    | Hospital B    |
    | Universidad   |

  Examples: Datos de salida
    | mensaje_error                                           |
    | Lo sentimos. No se encontraron rutas accesibles para este destino |
    | Lo sentimos. No se encontraron rutas accesibles para este destino |
    | Lo sentimos. No se encontraron rutas accesibles para este destino |

