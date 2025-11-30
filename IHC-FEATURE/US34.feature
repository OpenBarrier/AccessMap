Feature: US34: Visualización de estadísticas de accesibilidad en mi ciudad

  Como ciudadano preocupado,
  quiero ver estadísticas e indicadores clave sobre la accesibilidad de mi entorno (distrito/ciudad),
  para comprender los desafíos y el progreso de la comunidad en la gestión de barreras.



  Scenario Outline: E1: Acceder al resumen de estadísticas de accesibilidad

    Dado que la persona con discapacidad motriz permanente está autenticado en la app.
    Y el usuario está en la pestaña "Home".
    Y la pantalla "Home" muestra una sección de "Estadísticas de Accesibilidad"
    que contiene un <resumen>.
    Cuando el usuario hace clic en el <boton_ver_mas_detalle> dentro de esa sección.
    Entonces el sistema le muestra la nueva pantalla "Detalle de estadistica de Accesibilidad".
    Y esta nueva pantalla muestra <datos_completos_distrito> por defecto.

  Examples: Datos de entrada
    | resumen                                         | boton_ver_mas_detalle |
    | "Gráfico circular: 62% accesibilidad en Lima"   | "Ver más detalle"     |
    | "Indicador: 48% accesibilidad en Miraflores"    | "Ver más detalle"     |
    | "Gráfico de barras: Accesibilidad promedio 55%" | "Ver más detalle"     |

  Examples: Datos de salida
    | datos_completos_distrito                                                      |
    | "52% reportes solucionados, barreras comunes: rampas dañadas y veredas rotas" |
    | "61% reportes solucionados, barreras comunes: cruces sin semáforo sonoro"     |
    | "47% reportes solucionados, barreras comunes: ascensores fuera de servicio"   |




  Scenario Outline: E2: Filtrar estadísticas por distrito o tipo de barrera

    Dado que el usuario está en la pantalla de "Detalle de Estadísticas de Accesibilidad".
    Cuando el usuario utiliza las opciones de filtro desplegables para seleccionar <distrito> o <tipo_barrera>.
    Entonces el sistema actualiza <graficos_actualizados> y <datos_actualizados> en la misma pantalla.

  Examples: Datos de entrada
    | distrito        | tipo_barrera                |
    | "San Isidro"    | "Rampas en mal estado"      |
    | "San Juan"      | "Veredas dañadas"           |
    | "Miraflores"    | "Ascensores inoperativos"   |

  Examples: Datos de salida
    | graficos_actualizados                         | datos_actualizados                                               |
    | "Gráfico actualizado para San Isidro"         | "35% accesibilidad, principal barrera: rampas en mal estado"     |
    | "Gráfico actualizado para San Juan"           | "22% accesibilidad, principal barrera: veredas dañadas"          |
    | "Gráfico actualizado para Miraflores"         | "61% accesibilidad, principal barrera: ascensores inoperativos"  |
