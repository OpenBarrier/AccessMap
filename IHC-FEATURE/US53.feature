Feature: US53: Ajuste del tamaño del texto

  Como usuario con movilidad reducida con sensibilidad visual,
  Quiero poder ajustar el tamaño del texto en la aplicación,
  Para leer cómodamente sin forzar la vista.

  Scenario Outline: E1: Configuración de tamaño de texto exitoso

    Dado que el usuario ha iniciado sesión en la aplicación
    Y el usuario se encuentra en la sección "Configuración" y ha seleccionado la subsección "Apariencia"
    Y el usuario selecciona la opción "Ajuste de tamaño de texto"
    Cuando el usuario desliza la barra de tamaños a su <tamano_preferido>
    Entonces el sistema incrementa el tamaño de la fuente en toda la aplicación
    Y muestra el <cambio_inmediato>.

    Examples: Datos de entrada
      | tamaño_preferido |
      | "Tamaño Grande"  |
      | "Tamaño Muy Grande" |
      | "Tamaño Mediano" |
      | "Tamaño Extra Grande" |

    Examples: Datos de salida
      | cambio_inmediato      |
      | "Tamaño Grande"       |
      | "Tamaño Muy Grande"   |
      | "Tamaño Mediano"      |
      | "Tamaño Extra Grande" |


  Scenario Outline: E2: Restablecer tamaño de texto a predeterminado

    Dado que el usuario se encuentra en la sección "Configuración" y ha seleccionado la subsección "Apariencia"
    Y el usuario ha modificado el tamaño del texto previamente
    Cuando el usuario presiona el <boton_restaurar>
    Entonces el sistema revierte el tamaño de la fuente en toda la aplicación
    Y muestra el <cambio_inmediato>.

    Examples: Datos de entrada
      | boton_restaurar               |
      | "Restablecer a predeterminado"|

    Examples: Datos de salida
      | cambio_inmediato      |
      | "Tamaño Grande"       |
      | "Tamaño Muy Grande"   |
      | "Tamaño Mediano"      |
      | "Tamaño Extra Grande" |