Feature: US42: Bajo consumo de batería

  Como usuario general,
  Quiero que la aplicación funcione con un consumo reducido de batería,
  Para poder usarla en recorridos largos sin preocuparme por quedarme sin carga.


  Scenario Outline: E1: Activación del modo ahorro 

    Dado que un usuario está en la sección "Configuración"
    Y ha ingresado a la subsección "Mapas y Datos"
    Cuando el usuario activa la opción <opcion_ahorro>
    Entonces el sistema reduce la frecuencia de geolocalización o animaciones del mapa (sin comprometer la precisión de la ruta activa)
    Y el sistema muestra un <indicador_visual> persistente en pantalla.

  Examples: Datos de entrada
    | opcion_ahorro            |
    | "Modo Ahorro de Batería" |

  Examples: Datos de salida
    | indicador_visual                      |
    | "Icono de batería verde en el header" |
    | "Indicador de optimización en el mapa"|


  Scenario Outline: E2: Notificación de optimización activa

    Dado que el usuario se encuentra en la pantalla principal
    Cuando el modo ahorro de batería está <estado_modo>
    Entonces el sistema muestra un <mensaje_indicador> indicando optimización activa.

  Examples: Datos de entrada
    | estado_modo |
    | "activado"  |

  Examples: Datos de salida
    | mensaje_indicador                 |
    | "Optimización activa"             |


  Scenario Outline: E3: Consumo controlado durante navegación

    Dado que el usuario se encuentra en una ruta activa
    Cuando el modo ahorro de batería está <estado_modo>
    Entonces el sistema mantiene bajo el consumo sin afectar la navegación
    Y el sistema realiza ajustes según la actividad: <ajuste_realizado>

  Examples: Datos de entrada
    | estado_modo |
    | "activado"  |

  Examples: Datos de salida
    | ajuste_realizado                                   |
    | "Actualiza geolocalización cada 12s (caminando)"   |
    | "Reduce animaciones y actualiza cada 7s (bicicleta)"|
    | "Ubicación cada 5s y mapa simplificado (auto)"     |
    | "Suspendido mientras no hay movimiento detectado"  |
    | "Optimización extendida en rutas > 30 min"         |

