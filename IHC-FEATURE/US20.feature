Feature: US20: Ver el perfil de otro colaborador

  Como usuario activo,
  Quiero poder ver un perfil básico de otros colaboradores (número de reportes validados, nivel de contribución),
  Para aumentar la confianza en los reportes de la comunidad.


    Scenario Outline: E1: Acceso a perfil desde reporte

    Dado que el usuario está en la pestaña "Comunidad" y ha seleccionado la subsección "Ranking de Colaboradores"
    Cuando el usuario selecciona el <nombre_colaborador>
    Entonces el sistema muestra el <perfil_publico>

    Examples: Datos de entrada
    | nombre_colaborador   |
    | Maria Garcia         |
    | Carlos Mendoza       |
    | Ana Torres           |

    Examples: Datos de salida
    | perfil_publico                                         |
    | Maria Garcia - 3470 puntos - 234 reportes validados    |
    | Carlos Mendoza - 1350 puntos - 222 reportes validados  |
    | Ana Medieval - 190 puntos - 50 reportes validados      |


    Scenario Outline: E2: Acceso a perfil desde ranking

    Dado que el usuario se encuentra en la pestaña de Comunidad y está en la subseccion Ranking de Colaboradores.
    Cuando el usuario selecciona un <colaborador_seleccionado>.
    Entonces el sistema muestra el <perfil_publico>.
    Examples: Datos de entrada
    | nombre_colaborador   |
    | Maria Garcia         |
    | Carlos Mendoza       |
    | Ana Medieval          |

    Examples: Datos de salida
    | perfil_publico                                         |
    | Maria Garcia - 3470 puntos - 234 reportes validados    |
    | Carlos Mendoza - 1350 puntos - 222 reportes validados  |
    | Ana Torres - 190 puntos - 50 reportes validados      |
   

    Scenario Outline: Escenario 3: Visualización de contribuciones

    Dado que el usuario se encuentra en el Perfil Público de un colaborador.
    Cuando el sistema presenta el nivel contribucion y reportes  validados.
    Entonces el sistema muestra el nivel de Contribución: <Reportes_Validados>, <Reportes_Solucionados> e <Insignias>.

    Examples: Datos de salida
    | reportes_validados | reportes_solucionados | insignias                  |
    | 234                | 156                   | "Explorador, Verificador"  |
    | 222                | 123                   | "Experto, ProActivo"       |
    | 123                | 34                    | "Nuevo colaborador"        |
