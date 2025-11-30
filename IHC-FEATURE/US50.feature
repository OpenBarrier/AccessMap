Feature: US50: Adaptabilidad a distintas resoluciones de pantalla

  Como usuario con un teléfono de pantalla pequeña o grande,
  Quiero que la aplicación se adapte correctamente a mi resolución,
  Para que todos los elementos sean visibles y funcionales sin distorsión.

  Scenario Outline: E1: Uso en pantallas pequeñas

    Dado que el usuario accede a la aplicación desde un dispositivo con <resolucion_pequena>
    Cuando navega por la interfaz
    Entonces todos los elementos deben escalar y reubicarse correctamente
    Y deben ser <visibles_funcionales> sin necesidad de scroll horizontal o distorsión.

    Examples: Datos de entrada
      | resolucion_pequena  |
      | "480x800 px"        |
      | "540x960 px"        |
      | "600x1024 px"       |
      | "720x1280 px"       |

    Examples: Datos de salida
      | visibles_funcionales            | 
      | "visibles y funcionales"        | 


  Scenario Outline: E2: Uso en pantallas grandes

    Dado que el usuario accede a la aplicación desde un dispositivo con <resolucion_grande>
    Cuando visualiza el mapa y los paneles de información de ruta
    Entonces el diseño debe aprovechar el espacio adicional
    Y debe mostrar el <mapa> y los <detalles_ruta> simultáneamente en paneles divididos para una mejor usabilidad.

    Examples: Datos de salida
      | mapa        | detalles_ruta                | 
      | "visible"   | "Ruta hacia Mall del Sur"    | 
