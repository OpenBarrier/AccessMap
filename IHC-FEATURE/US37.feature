Feature: US37: Modo de navegación para visitantes internacionales

  Como persona con discapacidad motriz permanente,
  Quiero que la plataforma me permita activar un modo de navegación en mi idioma,
  Para entender la información y planificar mis desplazamientos sin barreras lingüísticas durante mi visita.

  Scenario Outline: E1: elección y aplicación de idioma preferido

    Dado que la persona con discapacidad motriz permanente accede a la plataforma
    Y necesita cambiar el idioma
    Y la persona está en la subsección de "Configuración"
    Cuando el usuario selecciona la subsección "Idioma"
    Y elige un <idioma_nuevo> diferente al idioma actual desde la lista de idiomas predefinidos
    Entonces el sistema muestra un <mensaje_confirmacion_idioma>
    Y el sistema actualiza automáticamente todo el contenido de la plataforma al idioma seleccionado y en futuras pantallas.

    Examples: Datos de entrada
      | idioma_nuevo |
      | "Inglés"     |
      | "Portugués"  |
      | "Francés"    |
      | "Italiano"   |

    Examples: Datos de salida
      | mensaje_confirmacion_idioma                  |
      | "El idioma se ha actualizado correctamente." |


  Scenario Outline: E2: Mantener el idioma seleccionado entre sesiones

    Dado que el usuario seleccionó previamente un idioma como <idioma_guardado> en la lista desplegable de Idiomas
    Cuando el usuario cierra completamente la aplicación
    Y la vuelve a abrir
    Entonces la interfaz de la aplicación se carga
    Y se mantiene en el idioma seleccionado <idioma_guardado> por defecto.

    Examples: Datos de entrada
      | idioma_guardado |
      | "Inglés"        |
      | "Portugués"     |
      | "Francés"       |
      | "Italiano"      |

    Examples: Datos de salida
      | idioma_guardado_mantenido |
      | "Inglés"                  |
      | "Portugués"               |
      | "Francés"                 |
      | "Italiano"                |
