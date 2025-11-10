Feature: US8: Sugerencia de Rutas Inteligentes

  Como persona con movilidad reducida,
  Quiero recibir sugerencias de rutas alternativas basadas en mis preferencias guardadas,
  Para poder desplazarme de manera más segura y cómoda.

  Scenario Outline: E1: Generación de ruta según preferencias guardadas

    Dado que el usuario se encuentra en la "Vista de Planificación de Rutas" y ha configurado sus <preferencias>,
    Cuando solicita una ruta y la configuración del perfil está <estado_perfil>,
    Entonces el sistema genera la <ruta_generada>, filtrando y priorizando elementos según las preferencias guardadas.

  Examples: Datos de entrada
    | preferencias                                |estado_perfil  |
    | Evita pendientes pronunciadas, rampas anchas| activo        |
    | Evita escaleras, prefiere ascensores        | activo        |
    | Minimiza baches y obstáculos                | activo        |

  Examples: Datos de salida
    | ruta_generada                                      |
    | Ruta por Av.Mexico- rampas verificada              |
    | Ruta por Calle Surquillo-  veredas amplias         |
    | Ruta por Calle 28 de Julio -  baches, ascensor     |

  Scenario Outline: No se encuentra ruta compatible con preferencias

    Dado que el usuario se encuentra en la 'Vista de Planificación de Rutas',
    Cuando el sistema no encuentra rutas que cumplan con las <preferencias_usuario>,
    Entonces el sistema muestra el mensaje <mensaje_error>,
    Y se muestran <rutas_alternativas> que ya no cumplen con las preferencias guardadas .

  Examples: Datos de entrada
    | preferencias_usuario                        |
    | Evita pendientes pronunciadas, rampas anchas|
    | Evita escaleras, ascensores                 |
    | zonas vigiladas, baño adaptado              |

  Examples: Datos de salida
    | mensaje_error                                                                                                    | rutas_alternativas                      |
    | No se encontró una ruta que cumpla tus criterios de accesibilidad. A continuación se muestran rutas alternativas | Ruta por Jr. De la Unión -  rampa       |
    | No se encontró una ruta que cumpla tus criterios de accesibilidad. A continuación se muestran rutas alternativas | Ruta por Av. 28 de Julio - escaleras    |
    | No se encontró una ruta que cumpla tus criterios de accesibilidad. A continuación se muestran rutas alternativas | Ruta por Av. Grau - baches menores      |
