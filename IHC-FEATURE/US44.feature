Feature: US44: Uso offline

  Como usuario premium de AccessMap,
  Quiero que la app funcione incluso sin conexión a internet básica,
  Para poder seguir rutas descargadas previamente en modo offline.


  Scenario Outline: E1: Descarga previa de mapa

    Dado que el usuario Premium se encuentra en la sección de "Configuración" del menú de hamburguesa
    Y ha seleccionado la subsección "Mapas y Datos"
    Cuando selecciona la <opcion_descarga>
    Entonces el sistema permite usar la <zona_descargada> sin conexión.

  Examples: Datos de entrada
    | opcion_descarga                     |
    | "Descargar Zona para Uso Offline"   |

  Examples: Datos de salida
    | zona_descargada                      |
    |  ruta hacia el parque de la amistad  |


  Scenario Outline: E2: Navegación offline activa

    Dado que el usuario Premium se encuentra sin conexión a internet
    Cuando inicia la navegación con <rutas_descargadas>
    Entonces el sistema permite seguir la <navegacion_offline>

  Examples: Datos de entrada
    | rutas_descargadas        |
    | mall del Sur             |
    | Cafeteria Princess       |
    | Hospital Bienaventura    |

  Examples: Datos de salida
    | navegacion_offline        |
    | "ruta disponible offline" |


  Scenario Outline: E3: Alerta de ausencia de conexión

    Dado que el usuario Premium se encuentra en la aplicación sin conexión a internet
    Cuando solicita una <nueva_ruta> sin información descargada
    Entonces el sistema muestra una <alerta_offline> indicando que no es posible calcular la ruta sin conexión.

  Examples: Datos de entrada
    | nueva_ruta         |
    | Cefeteria Rosita   |


  Examples: Datos de salida
    | alerta_offline                                       |
    | "No es posible calcular la ruta sin conexión"         |

