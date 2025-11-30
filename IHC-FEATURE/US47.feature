Feature: US47: Modo ahorro de datos

  Como usuario con plan limitado de internet,
  Quiero activar un modo de bajo consumo de datos,
  Para seguir usando la app sin gastar demasiado.

  Scenario Outline: E1: Activación de modo ahorro de datos

    Dado que el usuario ha iniciado sesión en la aplicación
    Y el usuario tiene la app instalada y está conectado a internet
    Cuando el usuario accede a la sección de "Configuración" del menú de hamburguesa
    Y el usuario selecciona la subsección "Mapas y Datos"
    Y el usuario activa la opción <modo_ahorro>
    Entonces el sistema reduce el consumo de datos de la aplicación
    Y muestra un mensaje indicando <mensaje_activacion>

    Examples: Datos de entrada
      | modo_ahorro           |
      | "Modo de ahorro de datos" |

    Examples: Datos de salida
      | mensaje_activacion               |
      | "Modo de ahorro de datos activado" |


  Scenario Outline: E2: Desactivación de modo ahorro de datos

    Dado que el usuario ha iniciado sesión en la aplicación
    Y el usuario tiene activado el modo ahorro
    Cuando accede a la sección de configuración
    Y desactiva la opción <estado_ahorro>
    Entonces el sistema vuelve al consumo normal de datos
    Y muestra un mensaje indicando <mensaje_desactivacion>

    Examples: Datos de entrada
      | estado_ahorro              |
      | "Desactivado" |

    Examples: Datos de salida
      | mensaje_desactivacion                |
      | "Modo de ahorro de datos desactivado" |


  Scenario Outline: E3: Recordatorio de modo ahorro

    Dado que el usuario ha iniciado sesión en la aplicación
    Y utiliza regularmente la app con un plan de datos limitado
    Cuando el sistema detecta que el consumo de datos está <consumo_alto>
    Entonces envía un <recordatorio> al usuario sugiriendo activar el modo ahorro

    Examples: Datos de entrada
      | consumo_alto |
      | "alto"       | 

    Examples: Datos de salida
      | recordatorio                                                         |
      | "Se sugiere activar el Modo de ahorro de datos para reducir consumo" |
