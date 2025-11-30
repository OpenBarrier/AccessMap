Feature: US54: Acceder a una sección de ayuda

  Como usuario,
  Quiero acceder a una sección de preguntas frecuentes (FAQ) dentro de la aplicación,
  Para resolver dudas sobre su funcionamiento sin tener que salir de ella.

  Scenario Outline: E1: Acceder y consultar una pregunta 

    Dado que el usuario está en la sección de "Configuración",
    Cuando el usuario selecciona la subsección de "Ayuda (FAQs)"
    Entonces el sistema muestra una <lista_preguntas>
    Y al seleccionar una <pregunta>, el sistema despliega la <respuesta> correspondiente.

    Examples: Datos de entrada
      | pregunta                            |
      | "¿Cómo iniciar una ruta?"           |
      | "¿Qué hago si no hay conexión?"     |
      | "¿Cómo reportar un obstáculo?"      |
      | "¿Puedo cambiar mi contraseña?"     |

    Examples: Datos de salida
      | lista_preguntas                                | respuesta                                   |
      | "¿Como iniciar una ruta"                       | "Para iniciar una ruta, debes..."           |
      | "¿Que hago si no tengo conexion a internet"    | "Si no tienes conexión, intenta..."         |
      | "¿Como reporto obstáculos?"                    | "Para reportar obstáculos, usa..."          |
      | "¿Donde puedo cambiar mi contraseña?"          | "Puedes cambiar la contraseña desde..."     |


  Scenario Outline: E2: Filtrado de preguntas mediante palabra clave

    Dado que el usuario está en la subsección de "Ayuda (FAQs)",
    Cuando el usuario escribe una <palabra_clave> en la barra de búsqueda
    Entonces la <lista_preguntas> se filtra para mostrar únicamente las preguntas que contienen esa palabra.

    Examples: Datos de entrada
      | palabra_clave |
      | "ruta"        |
      | "conexion"    |
      | "obstáculo"   |
      | "contraseña"  |

    Examples: Datos de salida
      | lista_preguntas_filtrada              |
      | "¿Cómo iniciar una ruta?"           |
      | "¿Qué hago si no hay conexión?"     |
      | "¿Cómo reportar un obstáculo?"      |
      | "¿Puedo cambiar mi contraseña?"     |
