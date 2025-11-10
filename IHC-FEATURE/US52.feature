Feature: US52: Zoom accesible en el mapa

  Como usuario con movilidad reducida,
  Quiero poder hacer zoom fácilmente en el mapa,
  Para ver con claridad los detalles de las rutas y barreras.

  Scenario Outline: E1: Zoom in exitoso

    Dado que el usuario ha iniciado sesión en la aplicación
    Y se encuentra visualizando el mapa,
    Cuando el usuario realiza <accion_zoom_in>,
    Entonces el sistema amplía el mapa
    Y muestra con mayor claridad los <resultado_zoom_in>.

  Examples: Datos de entrada
    | accion_zoom_in       |
    | Pellizco hacia afuera|
    | Botón "+"            |

  Examples: Datos de salida
    | resultado_zoom_in                             |
    | Detalles de rutas y barreras más claros       |

  Scenario Outline: E2: Zoom out exitoso

    Dado que el usuario ha iniciado sesión y está visualizando el mapa,
    Cuando realiza el gesto de zoom out <accion_zoom_out>,
    Entonces el sistema reduce el nivel de zoom del mapa
    Y permite visualizar <resultado_zoom_out>.

  Examples: Datos de entrada
    | accion_zoom_out        |
    | Pellizco hacia adentro |
    | Botón "-"              |

  Examples: Datos de salida
    | resultado_zoom_out                        |
    | Área más amplia visible con rutas legibles|

  Scenario Outline: Alcanzar nivel máximo de zoom

    Dado que el usuario hace zoom in repetidamente,
    Cuando el nivel de zoom alcanza el máximo permitido por la aplicación,
    Entonces el sistema muestra una notificación no intrusiva <mensaje_toast> 
    Y desaparece automáticamente.

  Examples: Datos de salida
    | mensaje_toast             |
    | "Nivel máximo de zoom"    |
