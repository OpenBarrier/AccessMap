Feature: US63: Aceptación de Términos y Política de Privacidad

  Como nuevo usuario durante el registro,
  Quiero poder leer y aceptar los Términos de Servicio y la Política de Privacidad,
  Para entender cómo se utilizarán mis datos y estar de acuerdo con las reglas de la comunidad.

  Scenario Outline: E1: Aceptar los términos para habilitar el registro

    Dado que un nuevo usuario está en la pantalla de <pantalla_registro>,
    Cuando el usuario marca la casilla de <casilla_aceptacion>,
    Entonces el <boton_registro> se <estado_boton> (si los demás campos también son válidos),
    permitiéndole completar el registro.

  Examples: Datos de entrada
    | pantalla_registro | casilla_aceptacion                            |
    | "Registro"        | "Acepto los Términos y la Política de Privacidad" |
    | "Registro"        | "Acepto los Términos del Servicio y la Privacidad" |


  Examples: Datos de salida
    | boton_registro   | estado_boton |
    | "Registrarse"    | "activo"     |
    | "Registrarse"    | "activo"     |


  Scenario Outline: E2: Intentar registrarse sin aceptar los términos

    Dado que el nuevo usuario ha llenado sus <datos_registro> en la pantalla de 'Registro',
    Cuando intenta presionar <boton_registro> pero no ha marcado la <casilla_aceptacion>,
    Entonces el <boton_registro> permanece <estado_boton>,
    Y la casilla de aceptación se resalta con un <borde_resaltado> para indicar que es un campo obligatorio.

  Examples: Datos de entrada
    | datos_registro            | boton_registro | casilla_aceptacion  |
    | "correo y contraseña"     | "Registrarse"  | "No marcado"        |
    | "todos los campos llenos" | "Registrarse"  | "No marcado"        |
    | "correo y clave seguras"  | "Registrarse"  | "No marcado"        |
    | "datos válidos completos" | "Registrarse"  | "No marcado"        |

  Examples: Datos de salida
    | boton_registro | estado_boton | borde_resaltado |
    | "Registrarse"  | "inactivo"   | "rojo"          |
    | "Registrarse"  | "inactivo"   | "rojo"          |
    | "Registrarse"  | "inactivo"   | "rojo"          |
    | "Registrarse"  | "inactivo"   | "rojo"          |
