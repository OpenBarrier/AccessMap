Feature: US19: Sistema de Puntuación de Usuarios Colaboradores

  Como usuario que contribuye,
  Quiero un sistema de puntos o nivel que reconozca la calidad y cantidad de mis reportes validados,
  Para motivarme a seguir colaborando con información precisa.


Scenario Outline: E1: Otorgamiento de puntos por contribución válida

    Dado que un usuario ha enviado un reporte o validación de barrera.
    Cuando el reporte es validado como <preciso> o cuando completa una validación comunitaria.
    Entonces el perfil (visible en Perfil > Mis Logros > Mis Puntos y Nivel) debe recibir la cantidad predefinida de <puntos_otorgados>.
    Y su <nivel_actualizado> de colaborador debe actualizarse automáticamente.

    Examples: Datos de entrada
    | preciso                 |
    | "Clasificación por IA"  |
    | "Marcado como Resuelto" |
    | "Validación comunitaria"|

    Examples: Datos de salida
    | puntos_otorgados       | nivel_actualizado |
    | +10 por clasificación  |  Nivel 2"         |
    | +20 por resolución     |  Nivel 3"         |
    | +2 por validación      |  Nivel 1"         |


Scenario Outline: E2: Visualización de nivel y progresión

    Dado que el usuario accede a su pantalla principal de Perfil.
    Cuando el usuario navega a "Mis Logros" y luego va al apartado "Mis Puntos y Nivel".
    Entonces el sistema debe mostrar su <puntos_totales>, <nivel_actual> y <puntos_para_siguiente_nivel>.

    Examples: Datos de salida
    | puntos_totales | nivel_actual | puntos_para_siguiente_nivel |
    | "120"          | "Nivel 3"    | "30"                        |
    | "45"           | "Nivel 1"    | "5"                         |
    | "200"          | "Nivel 4"    | "50"                        |


Scenario Outline: E3: Notificación de nuevo nivel o logro

    Dado que el usuario acumula suficientes puntos para un nuevo nivel o logro.
    Cuando el usuario completa el hito.
    Entonces el sistema le envía una <notificacion>.
    Y actualiza la información en Perfil > Mis Logros > Mis Puntos y Nivel.

    Examples: Datos de salida
    | notificacion              |
    | "¡Subiste de Nivel!"      |
    | "¡Logro completado!"      |
