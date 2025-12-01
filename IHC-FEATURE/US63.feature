Feature: US63: Aceptación de Términos y Política de Privacidad

  Como nuevo usuario durante el registro,
  Quiero poder leer y aceptar los Términos de Servicio y la Política de Privacidad,
  Para entender cómo se utilizarán mis datos y estar de acuerdo con las reglas de la comunidad.

  Scenario Outline: E1: Aceptar los términos para habilitar el registro

    Dado que un nuevo usuario está en la pantalla de "Crear Cuenta",
    Y el usuario llena su <correo_electronico> y <contrasena> correctamente
    Cuando el usuario marca la casilla de <casilla_aceptacion>,
    Entonces el "Registrarse" esta activo (si los demás campos también son válidos),
    permitiéndole completar el registro.

  Examples: Datos de entrada
    |correo_electronico |contrasena |casilla de aceptacion                               |
    |Hola@gmail.com     | 123#jiji  | "Acepto los Términos del Servicio y la Privacidad" |
    |Lola@gmail.com     | 1234hj#   | "Acepto los Términos del Servicio y la Privacidad" |
    |Susan@gmail.com    |mimmm34%   | "Acepto los Términos del Servicio y la Privacidad" |


  Scenario Outline: E2: Intentar registrarse sin aceptar los términos

    Dado que el nuevo usuario ha llenado sus <correo_electronico> y <contrasena> correctamente en la pantalla de 'Registro',
    Cuando intenta presionar "Registrarse" pero <marca> ha marcado la <casilla_aceptacion>,
    Entonces el boton "Registrarse" permanece no accesible

  Examples: Datos de entrada
   |correo_electronico |contrasena  | marca |casilla de aceptacion                               |
    |Hola@gmail.com     | 123#jiji  |  no   |"Acepto los Términos del Servicio y la Privacidad" |
    |Lola@gmail.com     | 1234hj#   |  no   |"Acepto los Términos del Servicio y la Privacidad" |
    |Susan@gmail.com    |mimmm34%   |  no   | "Acepto los Términos del Servicio y la Privacidad" |

    

