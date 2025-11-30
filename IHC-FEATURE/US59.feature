Feature: US59: Cerrar sesión

  Como usuario,
  Quiero poder cerrar sesión de forma segura,
  Para proteger mi información en un dispositivo compartido.

  Scenario Outline: E1: Cierre de sesión exitoso

    Dado que un usuario está autenticado en la app,
    Cuando el usuario navega a la pantalla de "Perfil" o despliega el menú de hamburguesa y presiona el <boton_cerrar_sesion>
    Entonces el sistema cierra su sesión activa
    Y lo redirige a la pantalla de <pantalla_destino>.

    Examples: Datos de entrada
      | boton_cerrar_sesion |
      | "Cerrar Sesión"     |

    Examples: Datos de salida
      | pantalla_destino     |
      | "Inicio de Sesión"   |

  Scenario Outline: E2: Protección de sesión cerrada (Navegación hacia atrás)

    Dado que el usuario ha presionado "Cerrar Sesión" y está en la pantalla de "Inicio de Sesión",
    Cuando presiona el <boton_atras> del sistema operativo del móvil
    Entonces la aplicación se <comportamiento_app> sin mostrar ninguna pantalla anterior que requiera autenticación.

    Examples: Datos de entrada
      | boton_atras    |
      | "Atrás"        |
     
    Examples: Datos de salida
      | comportamiento_app  |
      | cierra              |
    