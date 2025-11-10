Feature: US1: Rutas accesibles por horario

  Como usuario con movilidad reducida,
  Quiero recibir sugerencias de rutas accesibles según la hora del día,
  Para elegir caminos más seguros dependiendo del contexto.

  Scenario Outline: E1: Generación de rutas según hora

    Dado que el usuario ha ingresado <destino> en la Barra de Búsqueda de la pestaña Mapa 
    Y ahora está en la pantalla "Planificación de Ruta".
    Cuando selecciona el <horario> en la pantalla
    Entonces el sistema muestra <rutas_accesibles> rutas accesibles, priorizando la seguridad basada en el contexto horario.


  Examples: Datos de entrada
    | destino           | horario       |
    | "Parque Central"  | "Actual"      |
    | "Museo de Arte"   | " 13:00"      |
    | "Estación Central"| " 14:00"      |
    | "Universidad ABC" | "Actual"      |

  Examples: Datos de salida
    | rutas_accesibles                                                                        |
    | ruta A - accesibilidad: 98% - rampa verificada, veredas amplias, iluminación LED        |
    | ruta B - accesibilidad: 60% - rampa verificada, veredas amplias, sin ascensor           |

  Scenario Outline: E2: Error por falta de información

    Dado que el usuario está en la pantalla de “Planificación de Ruta” 
    Y el usuario ha ingresado <destino>
    Cuando el sistema no puede evaluar el contexto de seguridad para <horario>
    Entonces el sistema muestra <mensaje_alerta>

  Examples: Datos de entrada
    | destino              | horario   |
    | "Parque Norte"       | " 23:00"  |
    | "Centro Comercial X" | " 6:00"   |
    | "Museo de Historia"  | " 2 días" |
    | "Estadio Municipal"  | "1 semana"|

  Examples: Datos de salida
    | mensaje_alerta                                                                 |
    | "Rutas generadas sin datos de seguridad por horario. ¿Deseas ver las rutas accesibles estándar?" |
    
