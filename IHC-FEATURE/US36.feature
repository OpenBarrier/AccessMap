Feature: US36 - Perfil de Accesibilidad Personalizado

  Como persona con movilidad reducida quiero registrar en mi perfil mi condición de accesibilidad
  (ej: silla de ruedas, andador, coche de bebé, muletas) de la lista predefinida
  para que la app me sugiera rutas adaptadas a mis necesidades.


  Scenario Outline: E1: Registro inicial de preferencias de accesibilidad

    Dado que el usuario recién está registrado en la app.
    Y el sistema lo redirige a la subsección de "Perfil de Accesibilidad"
    Y presiona el botón "Editar" que está en la pestaña “Perfil”.
    Cuando el usuario selecciona <condiciones> y presiona “Guardar”,
    Entonces el sistema almacena las preferencias
    Y muestra un <mensaje_confirmacion>.

  Examples: Datos de entrada (reales)
    | condiciones           |
    | "silla de ruedas"     |
    | "coche de bebé"       |
    | "muletas"             |
    | "andador"             |
    | "silla de ruedas y muletas" |
    | "coche de bebé y andador"   |

  Examples: Datos de salida (reales)
    | mensaje_confirmacion                                        |
    | "Tus preferencias de accesibilidad han sido guardadas."     |


  Scenario Outline: E2: Actualización y persistencia de preferencias

    Dado que el usuario ya tiene sus condiciones guardadas,
    Cuando el usuario se dirige a la sección Perfil y luego a Perfil de Accesibilidad,
    Y hace clic en Editar preferencias
    Y el usuario modifica sus condiciones de accesibilidad seleccionando <nuevas_condiciones>
    Y guarda los cambios,
    Entonces el sistema actualiza la información en su perfil
    Y muestra las opciones seleccionadas correctamente en Perfil de Accesibilidad.

  Examples: Datos de entrada (reales)
    | nuevas_condiciones         |
    | "silla de ruedas"          |
    | "muletas"                  |
    | "andador"                  |
    | "coche de bebé"            |
    | "silla de ruedas y andador"|
    | "coche de bebé y muletas"  |

  Examples: Datos de salida (reales)
    | nuevas_condiciones         |
    | "silla de ruedas"          |
    | "muletas"                  |
    | "andador"                  |
    | "coche de bebé"            |
    | "silla de ruedas y andador"|
    | "coche de bebé y muletas"  |
