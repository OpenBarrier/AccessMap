Feature: US51: Modo oscuro

  Como usuario con movilidad reducida permanente,
  Quiero activar el modo oscuro en la aplicación,
  Para poder usarla sin que se canse mi vista.

  Scenario Outline: E1: Activación de modo oscuro exitosa

    Dado que el usuario ha iniciado sesión en la aplicación
    Y se encuentra en la sección "Configuración" y ha seleccionado la subsección "Apariencia"
    Cuando el usuario activa la <opcion>
    Entonces el sistema cambia la interfaz a modo oscuro
    Y muestra un <snackbar_confirmacion> que desaparece automáticamente.

    Examples: Datos de entrada
      | opcion          |
      | "Modo oscuro"   |

    Examples: Datos de salida
      | snackbar_confirmacion        |
      | "Modo oscuro activado."      |
      | "Modo oscuro activado."      |
      | "Modo oscuro activado."      |
      | "Modo oscuro activado."      |


  Scenario Outline: E2: Desactivar modo oscuro

    Dado que el usuario tiene activado el modo oscuro
    Y se encuentra en la sección "Configuración" y ha seleccionado la subsección "Apariencia"
    Cuando el usuario desactiva la <opcion>
    Entonces el sistema cambia la interfaz a <tema_claro>
    Y muestra un <snackbar_confirmacion> que desaparece automáticamente.

    Examples: Datos de entrada
      | opcion          |
      | "Modo oscuro"   |
 
    Examples: Datos de salida
      | tema_claro     | snackbar_confirmacion        |
      | "modo claro"   | "Modo claro activado."       |

