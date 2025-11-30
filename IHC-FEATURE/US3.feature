Feature: US3: Guardar y gestionar rutas personalizadas

    Como persona en silla de ruedas,
    Quiero guardar rutas accesibles en mi perfil,
    Para acceder a ellas rápidamente en el futuro, compartirlas y gestionarlas según mi tipo de cuenta.

Scenario Outline: E1: Guardado exitoso de ruta personalizada

    Dado que el usuario Premium está viendo la pantalla "Planificación de Ruta",
    Cuando el usuario hace clic en el <boton_guardar>,
    Entonces el sistema almacena la ruta
    Y la muestra en la pantalla <pantalla_destino> en la subsección <subseccion_rutas>.

    Examples: Datos de entrada
    | boton_guardar  |
    | "Guardar ruta" |

    Examples: Datos de salida
    | pantalla_destino | subseccion_rutas |
    | "Perfil"         | "Rutas Guardadas" |

    Scenario Outline: E2: Límite de guardado para cuenta gratuita

    Dado que un usuario con cuenta gratuita 
    Y ha alcanzado su límite de rutas guardadas (5 rutas),
    Cuando el usuario presiona el <boton_guardar>,
    Entonces el sistema verifica el límite ANTES de solicitar un nombre
    Y muestra directamente el <mensaje_modal>
    Y sin mostrar el <overlay>.

    Examples: Datos de entrada
    | boton_guardar  | 
    | "Guardar Ruta" | 

    Examples: Datos de salida
    | mensaje_modal      | overlay_guardar |
    | "Límite Alcanzado" | "no mostrado"   |

    Scenario Outline: E3: Compartir una ruta guardada

    Dado que el usuario ha guardado previamente una ruta accesible,
    Cuando el usuario va a la pestaña "Perfil" y presiona el <boton_ver_rutas>
    Y selecciona el <boton_compartir> en la subsección de rutas guardadas,
    Entonces la aplicación genera un <enlace_generado> y un <codigo_ruta>
    Y abre una <ventana_compartir> con opciones disponibles.

    Examples: Datos de entrada
    | boton_ver_rutas       | boton_compartir |
    | "Ver Rutas Guardadas" | "Compartir"     |

    Examples: Datos de salida
    | enlace_generado                        | codigo_ruta | ventana_compartir  |
    | https://accessmap.app/ruta/ACX-48291   | ACX-48291   | Facebook           |
    | https://accessmap.app/ruta/RT-9923-FLL | RT-9923-FLL | correo electronico |
    | https://accessmap.app/ruta/RTA-AX44-PE |"RTA-AX44-PE"| Instagram          |