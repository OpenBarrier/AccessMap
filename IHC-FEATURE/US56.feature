Feature: Privacidad de Datos de Geolocalización
  Como usuario de AccessMap,
  quiero que mis datos de geolocalización y mi historial de rutas se mantengan privados y no se compartan con terceros sin mi consentimiento explícito,
  para asegurar mi anonimato.

Scenario Outline: E1: Consentimiento informado al solicitar permiso de ubicación

    Dado que la app necesita usar la ubicación del usuario por primera vez,
    Cuando el sistema solicita el permiso de ubicación,
    Entonces antes de la solicitud del sistema, la app le explica al usuario por qué la necesita <motivo_uso_ubicacion>,
    Y asegura que su historial es <tipo_historial>,
    Y requiere que el usuario presione <accion_usuario> para continuar con la solicitud de permiso del sistema operativo.

  Examples: Datos de entrada
    | motivo_uso_ubicacion                                       | tipo_historial  | accion_usuario |
    | "calcular rutas más accesibles"                            | "privado"       | "Aceptar"      |
    | "mostrar rutas seguras y rápidas"                          | "anónimo"       | "Aceptar"      |    |

  Examples: Datos de salida
    | resultado_solicitud                             | estado_datos                |
    | "Permiso de ubicación otorgado"                 | "historial privado"         |
    | "Permiso aceptado por el usuario"               | "datos anónimos"            |
    


Scenario Outline: E2: Gestionar privacidad y uso de datos en configuración

    Dado que el usuario quiere revisar sus ajustes de privacidad,
    Cuando el usuario accede a la sección <seccion> y hace click en la subsección <subseccion>,
    Entonces el usuario puede ver y activar o desactivar la opción <opcion_privacidad> (con opción para <accion_usuario>),
    Y se muestra el mensaje explicativo <mensaje_privacidad>.

  Examples: Datos de entrada
    | seccion          | subseccion            | opcion_privacidad             | accion_usuario |
    | "Configuración"  | "Cuenta y Privacidad" | "Guardar historial de rutas"  | "borrarlo"     |
    | "Configuración"  | "Cuenta y Privacidad" | "Guardar historial de rutas"  | "activarlo"    |
    | "Configuración"  | "Cuenta y Privacidad" | "Guardar historial de rutas"  | "desactivarlo" |
    | "Configuración"  | "Cuenta y Privacidad" | "Guardar historial de rutas"  | "mantenerlo"   |

  Examples: Datos de salida
    | mensaje_privacidad                                                                                                  | estado_historial         |
    | "Los datos agregados son anónimos para mejorar el servicio y no se comparten sus datos personales con terceros sin su permiso explícito." | "guardado"               |
    | "Historial activado correctamente. Tus datos serán tratados de forma privada."                                     | "guardado"               |
    | "Historial desactivado. No se almacenarán datos de tus recorridos."                                                | "no guardado"            |
    | "No se realizaron cambios en la configuración de privacidad."                                                      | "sin cambios"            |