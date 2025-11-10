Feature: US60: Recuperación de contraseña

  Como usuario que olvidó su contraseña,
  Quiero poder solicitar un enlace de recuperación a mi correo electrónico,
  Para poder restablecer mi contraseña y acceder de nuevo a mi cuenta.

  Scenario Outline: E1: Solicitud de recuperación

    Dado que el usuario está en la <pantalla_actual>
    Cuando el usuario hace clic en el <enlace_recuperacion>
    Entonces el sistema oculta la <pantalla_actual>
    Y muestra la <pantalla_recuperacion>.

  Examples: Datos de entrada
    | pantalla_actual       | enlace_recuperacion         |
    | "Inicio de Sesión"    | "¿Olvidaste la contraseña?" |
    | "Cuenta Bloqueada"    | "Restablecer mi contraseña" |

  Examples: Datos de salida
    | pantalla_actual       | pantalla_recuperacion      |
    | "oculta"              | "Recuperar Contraseña"     |


  Scenario Outline: E2: Confirmación de envío (Correo registrado y no registrado)

    Dado que el usuario está en la pantalla de 'recuperacion de contraseña'
    Cuando ingresa un <correo> y presiona <boton_enviar>
    Entonces el sistema muestra un <mensaje_confirmacion>
    Y el usuario puede  el correo y presionar "Enviar enlace" nuevamente si se equivocó. 


  Examples: Datos de entrada
    | correo                   | boton_enviar       | 
    | "usuario1@mail.com"      | "Enviar enlace"    | 
    | "noexiste234@mail.com"   | "Enviar enlace"    | 
    | "miriam_mends2@mail.com" | "Enviar enlace"    | 
    | "test.use12r@mail.com"   | "Enviar enlace"    | 

  Examples: Datos de salida
    | mensaje_confirmacion                                                                                   |
    | "Si este correo está registrado, recibirás un enlace de recuperación."  |                              |
                               


  Scenario Outline: E3: Restablecimiento exitoso de contraseña

    Dado que el usuario ha seguido el enlace de recuperacion de email y se encuentra en la pantalla "Restablecer Contraseña".
    Cuando ingresa una <nueva_contrasena> segura en <campo_nueva_contrasena>
    Y ingresa la misma <confirmar_contrasena> en <campo_confirmar_contrasena>
    Y presiona el <boton_restaurar>
    Entonces el sistema valida que las contrasenas validas y actualiza la contrasena del usuario
    Y muestra la <pantalla_confirmacion>
    Y el <boton_ir_login> redirige al usuario a la <pantalla_login>.

  Examples: Datos de entrada
    | nueva_contrasena | campo_nueva_contrasena | confirmar_contrasena | campo_confirmar_contrasena | boton_restaurar |
    | "ClaveSegura1"   | "Nueva contraseña"     | "ClaveSegura1"      | "Confirmar contraseña"     | "Restablecer contraseña" |
    | "Password123"    | "Nueva contraseña"     | "Password123"       | "Confirmar contraseña"     | "Restablecer contraseña" |
    | "MiClave2025"    | "Nueva contraseña"     | "MiClave2025"       | "Confirmar contraseña"     | "Restablecer contraseña" |
    | "ClaveTest1"     | "Nueva contraseña"     | "ClaveTest1"        | "Confirmar contraseña"     | "Restablecer contraseña" |

  Examples: Datos de salida
    | pantalla_confirmacion      | boton_ir_login          | pantalla_login |
    | "¡Contraseña actualizada!" | "Ir a Inicio de Sesión" | "Inicio de Sesión" |
   


  Scenario Outline: E4: Error por contraseñas no coincidentes

    Dado que el usuario está en la pantalla 'restablecer contraseña'
    Cuando ingresa una <nueva_contrasena> en campo 'nueva contrasena'
    Y ingresa una <confirmar_contrasena> diferente en el campo confirmar contraseña,
    Entonces el sistema muestra un <mensaje_error>
    Y resalta los campos con error
    Y el <boton_restaurar> permanece <estado_boton>.

  Examples: Datos de entrada
    | nueva_contrasena  | confirmar_contrasena | 
    | "ClaveSegura1"    | "ClaveMal1"         | 
    | "Password123"     | "PasswordErr"       |
    | "MiClave2025"     | "MiClaveErr"        | 
    | "ClaveTest1"      | "ClaveErr"          | 

  Examples: Datos de salida
    | mensaje_error                  | boton_restaurar           | estado_boton      |
    | "Las contraseñas no coinciden" | "restablecer contraseña"  | "deshabilitado"  |
   