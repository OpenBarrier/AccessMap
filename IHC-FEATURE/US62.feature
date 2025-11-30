Feature: US62: Editar mi perfil básico

  Como usuario registrado,
  Quiero poder editar la información básica de mi perfil (cambiar mi nombre de usuario, actualizar mi contraseña),
  Para mantener mis datos actualizados.

  Scenario Outline: E1: Actualización exitosa del nombre de usuario

    Dado que un usuario registrado está en su pantalla principal de "Perfil",
    Cuando el usuario selecciona la opción "Editar Perfil", modifica su <nombre_usuario_nuevo> en el campo de texto de la pantalla "Editar Perfil" y presiona <boton_guardar>
    Entonces el sistema actualiza el nombre de usuario
    Y muestra un <mensaje_exito> en la pantalla "Editar Perfil".

    Examples: Datos de entrada
      | nombre_usuario_nuevo | boton_guardar |
      | "UsuarioNuevo01"     | "Guardar"     |
      | "MiNombre2025"       | "Guardar"     |
      | "TestUserEdit"       | "Guardar"     |
      | "Carmen Maria"       | "Guardar"     |

    Examples: Datos de salida
      | mensaje_exito         |
      | "Perfil actualizado"  |


  Scenario Outline: E2: Error de contraseñas no coincidente
  
    Dado que un usuario registrado está en la pantalla "Editar Perfil" e intenta cambiar su contraseña,
    Cuando ingresa una <contrasena_nueva> en el primer campo y una <contrasena_confirmacion> diferente en el segundo campo
    Entonces el sistema muestra en la pantalla "Editar Perfil" un <mensaje_error>
    Y el <boton_guardar> permanece deshabilitado.

    Examples: Datos de entrada
      | contrasena_nueva | contrasena_confirmacion |
      | "ClaveSegura01"  | "ClaveSegura02"         |
      | "Password2025"   | "Password2024"          |
      | "MiClaveNueva"   | "OtraClave"             |
      | "TestPass123"    | "TestPass321"           |

    Examples: Datos de salida
      | mensaje_error                   | boton_guardar  |
      | "Las contraseñas no coinciden"  | "deshabilitado" |
