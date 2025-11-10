Feature: US58: Inicio de sesión

  Como usuario registrado,
  Quiero poder iniciar sesión con mi correo y contraseña,
  Para acceder a mi cuenta.

  Scenario Outline: E1: Inicio de sesión exitoso

    Dado que un usuario registrado está en la  pantalla de "Inicio de Sesión",
    Cuando el usuario ingresa su <correo> y <contrasena> correctos y presiona <boton_login>
    Entonces el sistema verifica las credenciales y autentica al usuario
    Y el sistema oculta el formulario_login y muestra un <mensaje_exito> con un <boton_continuar>.

  Examples: Datos de entrada
    | correo                | contrasena     | boton_login       |
    | "usuario1@mail.com"   | "ClaveSegura1" | "Iniciar Sesión"  |
    | "usuario2@mail.com"   | "Password123"  | "Iniciar Sesión"  |
    | "test.user@mail.com"  | "MiClave2025"  | "Iniciar Sesión"  |
    | "prueba@mail.com"     | "ClaveTest1"   | "Iniciar Sesión"  |

  Examples: Datos de salida
    | mensaje_exito          | boton_continuar |
    | "Verificación exitosa" | "Continuar"     |
    | "Verificación exitosa" | "Continuar"     |
    | "Verificación exitosa" | "Continuar"     |
    | "Verificación exitosa" | "Continuar"     |


  Scenario Outline: E2: Credenciales incorrectas (Intentos 1 a 4)

    Dado que un usuario registrado está en la pantalla de "Inicio de Sesión",
    Cuando el usuario ingresa un <correo> o <contrasena> incorrectos en el <numero_intento>
    Entonces el sistema muestra un <mensaje_error>
    Y permanece en la pantalla de "Inicio de Sesión".


  Examples: Datos de entrada
    | correo                | contrasena    | intento |
    | "usuario1@mail.com"   | "ClaveMal1"   | 1       |
    | "usuario2@mail.com"   | "PasswordErr" | 2       |
    | "test.user@mail.com"  | "123456"      | 3       |
    | "prueba@mail.com"     | "ClaveErr"    | 4       |

  Examples: Datos de salida
    | mensaje_error                                                                     |
    | "El correo o la contraseña son incorrectos"                                       |
    | "El correo o la contraseña son incorrectos"                                       |
    | "El correo o la contraseña son incorrectos"                                       |
    | "¡Te queda 1 intento! Si fallas de nuevo, tu cuenta se bloqueará por 15 minutos." |


  Scenario Outline: Bloqueo de cuenta (Intento 5)

    Dado que un usuario está en la  pantalla de "Inicio de Sesión" y ya ha fallado 4 intentos
    Cuando el usuario ingresa una <contrasena> incorrecta por 5ta vez
    Entonces el sistema oculta el <formulario_login>
    Y muestra la <pantalla_bloqueo> indicando <tiempo_bloqueo>
    Y muestra un <boton_accion> como acción principal.

  Examples: Datos de entrada
    | contrasena      |
    | "ClaveMal5"     |
    |  "PasswordErr5" |
    | "123456Err"     |
    | "ClaveIncorrecta" |

  Examples: Datos de salida
    | formulario_login | pantalla_bloqueo                    | tiempo_bloqueo | boton_accion                |
    | "oculto"         | "Cuenta bloqueada temporalmente"    | "15 minutos"   | "Restablecer mi contraseña" |

