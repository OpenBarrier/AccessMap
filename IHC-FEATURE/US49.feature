Feature: US49: Visualización de iconografía intuitiva

  Como usuario,
  Quiero que la información y los elementos clave de la aplicación (barreras, rutas, lugares) se representen con iconografía clara, universal y consistente,
  Para que pueda interpretar el mapa rápidamente sin depender del texto.

  Scenario Outline: E1: Claridad de iconos de barreras

    Dado que el usuario está viendo el mapa de accesibilidad
    Cuando encuentra un ícono que representa una <barrera>
    Entonces el ícono debe ser <icono_claro> e intuitivo para identificar la barrera sin necesidad de leer una etiqueta o leyenda.

    Examples: Datos de entrada
      | barrera              | icono_claro             |
      | "Escalera"           | "Símbolo escalera universal" |
      | "Obstáculo en acera" | "Cono de advertencia"       |
      | "Puerta pesada"      | "Símbolo de puerta con peso"|
      | "Rampas ausentes"    | "Símbolo de rampa tachada"  |


  Scenario Outline: E2: Consistencia visual en el mapa

    Dado que la aplicación muestra diferentes tipos de barreras
    Cuando los íconos se muestran en pantalla para una rápida distinción
    Entonces cada tipo de barrera debe tener un <icono_distinto> y consistente en <color_forma> para una distinción visual inmediata.

    Examples: Datos de salida
      | icono_distinto         | color_forma               |
      | "Escalera"             | "gris, forma escalón"     |
      | "Obstáculo en acera"   | "naranja, forma cono"     |
      | "Puerta pesada"        | "azul, forma puerta con peso" |
      | "Rampas ausentes"      | "rojo, rampa tachada"     |
