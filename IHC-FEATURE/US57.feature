Feature: US57: Registro de nuevo usuario

  Como visitante nuevo,
  Quiero poder registrarme en la aplicación usando mi correo electrónico y una contraseña,
  Para crear una cuenta personal y acceder a todas las funcionalidades.


Scenario Outline: E1: Registro exitoso

    Dado que un visitante nuevo está en la pantalla de "Registro",
    Cuando el visitante ingresa un correo <correo_valido>, una contraseña <contrasena_valida> que cumple los requisitos,
    Y la confirmación de contraseña <confirmacion> coincide,
    Y acepta los <terminos>,
    Y presiona el botón "Registrarse" (que ahora está activo),
    Entonces el sistema crea su cuenta,
    Y lo autentica,
    Y le muestra un mensaje de <mensaje_exito>,
    Y lo redirige a la pantalla de <pantalla_redireccion>.

  Examples: Datos de entrada
    | correo_valido                | contrasena_valida    | confirmacion        | terminos      |
    | "mariajimenez1@mail.com"     | "ClaveSegura123"     | "ClaveSegura123"    | "Aceptados"   |
    | "luciana78@mail.com"         | "maria2024"          | "maria2024"         | "Aceptados"   |
    | "maferbri34@mail.com"        | "juventus123"        | "juventus123"       | "Aceptados"   |
    | "cuentarandom34@mail.com"    | "belladurmiente23"   | "belladurmiente23"  | "Aceptados"   |

  Examples: Datos de salida
    | mensaje_exito        | pantalla_redireccion         |
    | "Registro exitoso"   | "Personalización de perfil"  |
    | "Registro exitoso"   | "Personalización de perfil"  |
    | "Registro exitoso"   | "Personalización de perfil"  |
    | "Registro exitoso"   | "Personalización de perfil"  |


Scenario Outline: E2: Correo electrónico ya existente

    Dado que el visitante está en la pantalla de "Registro",
    Cuando ingresa un correo <correo_existente> que ya está registrado y sale del campo (pierde el foco),
    Entonces el sistema muestra un mensaje de error <mensaje_error>,
    Y el botón "Registrarse" permanece <estado_boton>.

  Examples: Datos de entrada
    | correo_existente                 |
    | "maria2024@mail.com"             |
    | "luciana78@mail.com"             |
    | "piter_macalister12@mail.com"    |
    | "correoexistente23@mail.com"       |

  Examples: Datos de salida
    | mensaje_error                                              | estado_boton |
    | "Este correo ya está en uso. ¿Quieres iniciar sesión?"     | "inactivo"   |
    | "Este correo ya está en uso. ¿Quieres iniciar sesión?"     | "inactivo"   |
    | "Este correo ya está en uso. ¿Quieres iniciar sesión?"     | "inactivo"   |
    | "Este correo ya está en uso. ¿Quieres iniciar sesión?"     | "inactivo"   |


Scenario Outline: E3: Datos de contraseña inválidos

    Dado que el visitante está en la pantalla de "Registro" llenando los campos de contraseña,
    Cuando la contraseña <contrasena> no cumple los requisitos de seguridad (ej. "8+ caracteres", "1 mayúscula", "1 número"),
    O cuando el campo "Confirmar contraseña" <confirmacion> no coincide con la contraseña ingresada,
    Entonces el sistema muestra un mensaje de error específico <mensaje_error>,
    Y el botón "Registrarse" permanece <estado_boton>.

  Examples: Datos de entrada
    | contrasena      | confirmacion   |
    | "clave"         | "clave"        |
    | "password"      | "password"     |
    | "clave123"      | "clave567"     |
    | "Segura2024"    | "Segura2025"   |

  Examples: Datos de salida
    | mensaje_error                                       | estado_boton |
    | "Debe tener al menos 8 caracteres."                 | "inactivo"   |
    | "Debe incluir al menos un número y una mayúscula."  | "inactivo"   |
    | "Las contraseñas no coinciden."                     | "inactivo"   |
    | "Las contraseñas no coinciden."                     | "inactivo"   |


  Scenario Outline: E4: Primera vez en Home

    Dado que un usuario nuevo completa su registro,
    Cuando el usuario es redirigido a la pantalla de <pantalla_inicio> por primera vez,
    Entonces el sistema muestra una <tarjeta_bienvenida> que lo invita a <accion_invitacion> para <objetivo_invitacion>.

  Examples: Datos de entrada
    | pantalla_inicio |
    | "Inicio"        |

  Examples: Datos de salida
    | tarjeta_bienvenida | accion_invitacion                | objetivo_invitacion                     |
    | "Bienvenida"        | "reportar su primera barrera"    | "desbloquear su primera medalla"       |        |

