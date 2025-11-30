Feature: US9: Opción de compartir mi ubicación

    Como persona con movilidad reducida,
    Quiero compartir mi ubicación en tiempo real con un grupo de confianza,
    Para que puedan monitorear mi ruta y auxiliarme en caso de emergencia.

Scenario Outline: E1 : Compartición exitosa de ubicación en tiempo real

    Dado que el usuario se encuentra en la Vista de Navegación Activa 
    Y presiona la opción <boton_compartir>.
    Cuando el usuario selecciona un <grupo_destino> y confirma la compartición.
    Entonces el sistema envía al grupo un <enlace_unico> (por SMS o App) para ver la ubicación del usuario en un mapa en tiempo real durante la ruta activa.

    Examples: Datos de entrada
    | boton_compartir           | grupo_destino |
    | "Compartir Ubicación/SOS" |  Familia      |
    | "Compartir Ubicación/SOS" |  Pareja       |
    | "Compartir Ubicación/SOS" |  Asistente    |

    Examples: Datos de salida
    | enlace_unico                         |
    |  https://accessmap.app/track/82KD9Q  | 
    |  https://accessmap.app/track/GH72PL  |
    |  https://accessmap.app/track/ML90TR  | 

Scenario Outline: E2: Solicitud de permiso

    Dado que el usuario intenta compartir su ubicación por primera vez y la app no tiene permisos.
    Cuando el usuario presiona <boton_compartir>.
    Entonces el sistema invoca la solicitud de permiso de ubicación nativa del sistema operativo (iOS/Android).
    Y si el usuario <decision_usuario>, se comparte la ubicación. Si rechaza, se muestra un <mensaje_rechazo>.

    Examples: Datos de entrada
    | boton_compartir | decision_usuario |
    | "Compartir Ubicación/SOS" | "acepta" |
    | "Compartir Ubicación/SOS" | "rechaza" |

    Examples: Datos de salida
    | permiso_resultado | mensaje_rechazo                                            |
    | "rechazado"       | "Activa los permisos de ubicación para compartir tu ruta." |
    | "aceptado"        |                                                        
    