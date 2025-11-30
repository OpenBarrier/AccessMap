Feature: US23: Compartir información de accesibilidad

  Como persona con discapacidad motriz permanente,
  Quiero compartir rutas accesibles o reportes de barreras en mis redes sociales,
  Para aumentar la conciencia sobre la accesibilidad sobre la importancia de la ciudad y motivar a otros a unirse a la causa.

  Scenario Outline: E1: Compartir reporte de barrera

    Dado que la persona con discapacidad motriz permanente ha accedido a la plataforma 
    Y ha identificado una barrera urbana y esta en la sección mapa.
    Cuando el acompañante ha seleccionado el <boton_reportar_barrera>.
    Entonces el sistema permite compartir el reporte en redes sociales con <descripcion_problema>, <ubicacion_exacta> y <foto_obstaculo>.

    Examples: Datos de entrada
    | boton_reportar_barrera |
    | "Reportar barrera"     |

    Examples: Datos de salida
    | descripcion_problema                      | ubicacion_exacta                     | foto_obstaculo         |
    | "Rampa bloqueada por auto estacionado"    | "Av. Arequipa 1250 - Lima"           | "foto_rampa1.jpg"      |
    | "Vereda destruida impide el paso"         | "Jr. Los Pinos 455 - San Martín"     | "vereda_rota.png"      |
    | "Hueco grande en la pista"                | "Av. Universitaria 3100 - Los Olivos"| "hueco_pista.jpeg"     |

  Scenario Outline: E2: Compartir rutas accesibles

    Dado que la persona con discapacidad motriz permanente ha accedido a la plataforma
    y ha encontrado una ruta accesible a un reporte de barrera 
    Y está en la sección mapa.
    Cuando la persona con discapacidad motriz permanente decide compartir seleccionando el lugar reportado
    y presione el apartado <rutas_alternativas>.
    Entonces el sistema permitirá que la persona comparta información sobre una ruta alternativa
    con <descripcion_clave> y <foto_opcional>.

    Examples: Datos de entrada
    | rutas_alternativas     |
    | "rutas alternativas"   |

    Examples: Datos de salida
    | descripcion_clave                                    | foto_opcional           |
    | "Ruta accesible con rampas continuas"                | "ruta_rampas.jpg"       |
    | "Camino sin escalones y con señalización táctil"     | "señalizacion_tactil.png"|
    | "Vereda amplia con pendiente ligera"                 | "pendiente_ligera.jpeg" |


  Scenario Outline: E3: Eliminación de reportes

    Dado que la persona con discapacidad motriz permanente ha accedido a la plataforma
    Y ha verificado que la barrera ya no está presente 
    Y está en la sección mapa.
    Cuando la persona con discapacidad motriz permanente seleccione el lugar reportado
    Y  presione el <campo>.
    Entonces el sistema contabilizará su reporte y una vez llegado a un <numero_reportes>
    se eliminará el reporte del lugar en la sección mapa.

  Examples: Datos de entrada
    | campo         |
    | "ruta libre"  |

  Examples: Datos de salida
    | numero_reportes |
    | "3"             |