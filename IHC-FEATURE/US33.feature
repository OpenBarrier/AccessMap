Feature: US33: Alertas por zonas críticas

  Como usuario con movilidad reducida,
  Quiero que la aplicación me muestre áreas con alta densidad de reportes recientes,
  Para decidir si debo evitar esa zona.

  Scenario Outline: E1: Visualizar zonas críticas en el mapa

    Dado que el usuario está explorando la pantalla del Mapa principal,
    Cuando el usuario activa el filtro "Mostrar Zonas Críticas" desde el menú "Filtros del Mapa",
    Entonces el sistema resalta visualmente en el Mapa con un sombreado rojo las áreas con alta concentración de reportes recientes <zonas_resaltadas>.

  Examples: Datos de salida
    | zonas_resaltadas                       |
    | Zonas con alta concentración de reportes recientes |

  Scenario Outline: E2: Recibir advertencia al planificar ruta por zona crítica

    Dado que el usuario está en el Mapa principal 
    Y en la sección de Planificación de Ruta habiendo ingresado <origen> y <destino>,
    Cuando la ruta sugerida atraviesa una "Zona Crítica",
    Entonces el sistema muestra una advertencia en línea <mensaje_advertencia>, sin obstruir los controles de navegación.

  Examples: Datos de entrada
    | origen            | destino       |
    | Plaza Mayor       | Parque Central|
    | Estación Angamos  | Hospital ESSALUD  |

  Examples: Datos de salida
    | mensaje_advertencia                        |
    | "Ruta A: Ruta atraviesa una zona crítica"           |
    | "Ruta B: Ruta atraviesa una zona crítica"           |
