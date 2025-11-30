Feature: Planificacion de rutas conjuntas
    Como acompañante de una persona con discapacidad,
    Quiero planificar rutas conjuntas en la app,
    Para asegurar que ambos sigamos el mismo trayecto accesible.

Scenario Outline: E1: Creación exitosa de ruta conjunta

    Dado que el acompañante ha planificado una ruta y está viendo la pantalla "Planificación de Ruta",
    Cuando selecciona la <opcion> en esta pantalla
    Y el usuario con discapacidad acepta la invitación haciendo clic en el <boton_aceptar>,
    Entonces la ruta accesible se guarda
    Y se muestra como <estado_ruta_conjunta> en la "vista activa de navegacion" de ambos usuarios.

    Examples: Datos de entrada
    | opcion                    | boton_aceptar |
    | "Compartir Ruta Conjunta" | "Aceptar" |

    Examples: Datos de salida
    | estado_ruta_conjunta   | 
    | "Ruta Conjunta Activa" | 

Scenario Outline: E2: Fallo en la creación de ruta conjunta

    Dado que el acompañante ha enviado la invitación para ruta conjunta desde la pantalla "Planificación de Ruta",
    Cuando el usuario con discapacidad rechaza la invitación mediante el <boton_rechazar>,
    Entonces el sistema notifica al acompañante con un <mensaje_error_rechazo>.

    Examples: Datos de entrada
    | boton_rechazar |
    | "Rechazar" |

    Examples: Datos de salida
    | mensaje_error_rechazo |
    | "[Nombre del amigo] ha rechazado la invitación." |

Scenario Outline: E3: Fallo en la creación de la rua conjunta por conexión fallida

    Dado que el acompañante ha enviado la invitación para ruta conjunta desde la pantalla "Planificación de Ruta",
    Cuando ocurre una <falla_conexion>,
    Entonces el sistema notifica al acompañante mediante un <mensaje_error_conexion>.

    Examples: Datos de entrada
    | falla_conexion |
    | "Conexión inestable" |

    Examples: Datos de salida
    | mensaje_error_conexion |
    | "No fue posible establecer la ruta. Revisa tu conexión e inténtalo de nuevo." |