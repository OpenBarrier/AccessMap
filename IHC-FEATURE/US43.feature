Feature: US43: Carga rápida del mapa

  Como usuario general,
  Quiero que la aplicación cargue la información del mapa en menos de 2 segundos,
  Para obtener respuestas rápidas mientras me desplazo.


  Scenario Outline: E1: Carga inicial de mapa

    Dado que el usuario se encuentra en la pantalla principal
    Cuando el usuario solicita <visualizar>
    Entonces el sistema muestra el <resultado_carga> en menos de 2 segundos.

  Examples: Datos de entrada
    | visualizar         |
    | "visualizar mapa"  |


  Examples: Datos de salida
    | resultado_carga       |
    | "mapa cargado"        |


  Scenario Outline: E2: Carga de información de reportes

    Dado que el usuario se encuentra en el mapa base cargado
    Cuando el sistema procesa los <reportes_recientes>
    Entonces el sistema muestra los <reportes_cargados> en menos de 2 segundos.

  Examples: Datos de entrada
    | reportes_recientes                 |
    | "Ascensor marcado como inactivo"   |
    | "Rampa temporal disponible"        |
    | "Baños accesibles no disponibles"  |


  Examples: Datos de salida
    | reportes_cargados                  |
    | "Ascensor marcado como inactivo"   |
    | "Rampa temporal disponible"        |
    | "Baños accesibles no disponibles"  |


  Scenario Outline: E3: Carga tras desplazamiento en mapa

    Dado que el usuario se encuentra navegando en el mapa
    Cuando realiza un desplazamiento a otra zona
    Entonces el sistema muestra la <area_cargada> en menos de 2 segundos.

  Examples: Datos de salida
    | area_cargada              |
    | "nueva área cargada"      |

