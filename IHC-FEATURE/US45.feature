Feature: US45: Rendimiento de Carga de Rutas

  Como usuario,
  Quiero que la app cargue las rutas en menos de 3 segundos,
  Para no perder tiempo en la planificación.


  Scenario Outline: E1: Carga de ruta simple en condiciones óptimas

    Dado que el usuario tiene una conexión a internet estable <tipo_conexion>
    Cuando el usuario solicita una <tipo_ruta>
    Entonces el sistema muestra la <ruta_sugerida> en menos de 3 segundos.

  Examples: Datos de entrada
    | tipo_conexion | tipo_ruta                               |
    | "4G"          | "ruta corta (menos de 5 km)"            |
    | "Wifi"        | "ruta corta (menos de 10 km)"           |


  Examples: Datos de salida
    | ruta_sugerida  |
    | Ruta A         |
    | Ruta B         |


  Scenario Outline: E2: Carga de ruta con conexión lenta

    Dado que el usuario tiene una conexión a internet lenta <tipo_conexion_lenta>
    Cuando el usuario solicita una <solicitud_ruta>
    Entonces el sistema muestra un <indicador_carga> visible
    Y la <ruta_aparece> en un tiempo razonable sin que la app se bloquee.

  Examples: Datos de entrada
    | tipo_conexion | solicitud_ruta                        |
    | 3G            | "ruta corta (menos de 5 km)"          |
    | 3G            | "ruta corta (menos de 10 km)"         |

  Examples: Datos de salida
    | indicador_carga     | ruta_aparece                   |
    | "spinner visible"   | "ruta cargada sin bloqueos"    |


  Scenario Outline: E3: Falla en el cálculo de la ruta

    Dado que el usuario solicita una ruta entre 2 puntos no conectables
    Cuando el sistema no puede calcular una ruta válida
    Entonces el sistema muestra un <mensaje_error_amigable>.

  Examples: Datos de salida
    | mensaje_error_amigable              |
    | "No se pudo encontrar una ruta"     |

