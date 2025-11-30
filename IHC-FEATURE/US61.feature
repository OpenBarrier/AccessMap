Feature: US61: Ver mi perfil básico

  Como usuario registrado,
  Quiero poder ver la información básica de mi perfil (nombre de usuario, correo),
  Para confirmar mis datos.

  Scenario Outline: E1: Visualización exitosa del perfil

    Dado que un usuario ha iniciado sesión,
    Cuando el usuario navega a la pestaña "Perfil" en la Tab Bar
    Entonces el sistema muestra en la pantalla principal de "Perfil" el <nombre_usuario> y el <correo> asociados a su cuenta.

    Examples: Datos de salida
      | nombre_usuario   | correo                 |
      | "UsuarioDemo01"  | "usuario1@mail.com"    |
      | "MiPerfil2025"   | "perfil2025@mail.com"  |
      | "TestUser"       | "test.user@mail.com"   |
      | "CuentaActiva"   | "cuenta@mail.com"      |


  Scenario Outline: E2: Error al cargar el perfil por falta de conexión

    Dado que un usuario ha iniciado sesión pero pierde la conexión a internet,
    Cuando el usuario intenta navegar a la pestaña "Perfil"
    Entonces el sistema muestra en la pantalla de "Perfil" un <mensaje_error>
    Y un <boton_reintentar> como acción principal.

    Examples: Datos de salida
      | mensaje_error                                           | boton_reintentar |
      | "No se pudo cargar tu perfil. Revisa tu conexión"        | "Reintentar"     |
