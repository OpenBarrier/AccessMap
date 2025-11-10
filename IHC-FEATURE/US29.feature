Feature: US29: Búsqueda de lugares accesibles

  Como persona con movilidad reducida,
  Quiero buscar directamente establecimientos accesibles (restaurantes, farmacias, paraderos),
  Para encontrar opciones seguras sin recorrer rutas largas.

  Scenario Outline: E1: Realizar una búsqueda por categoría accesible

    Dado que el usuario está en la pantalla del Mapa y ha accedido a la barra de Búsqueda,
    Cuando ingresa una <categoria> en la barra de Búsqueda y activa el toggle "Solo accesibles",
    Entonces el sistema muestra una lista de Resultados o marcadores en el Mapa de las categorias cercanas calificadas como <resultados_mostrados>.

  Examples: Datos de entrada
    | categoria   |
    | Farmacias   |
    | Restaurantes|
    | Paraderos   |

 Examples: Datos de salida
    | resultados_accesibles                 |
    | "Farmacia San Juan, Farmacia Vida"    |
    | "Restaurante La Esquina, Café Verde"  |
    | "Paradero Central, Paradero Norte"    |

  Scenario Outline: E2: Visualizar resultados de búsqueda

    Dado que el usuario realiza una búsqueda general con el toggle "Solo accesibles" DESACTIVADO,
    Cuando el sistema muestra la lista de Resultados de Búsqueda,
    Entonces el sistema muestra todos los <resultados> con sus <etiquetas_estado>,
    Y los resultados marcados como "Accesibles" aparecen priorizados al inicio de <resultados_destacados>.

 Examples: Datos de entrada y salida
    | resultados                                                     | etiqueta_estado                                         | resultados_destacados                                |
    | "Farmacia San Juan, Farmacia Vida, Farmacia Rápida"            | "Accesible, Precaución, Inaccesible"                    | "Farmacia San Juan, Farmacia Vida, Farmacia Rápida"  |
    | "Restaurante La Esquina, Café Verde, Bistro Central"           | "Precaución, Accesible, Inaccesible"                    | "Café Verde, Restaurante La Esquina, Bistro Central" |
    | "Paradero Central, Paradero Norte, Paradero Sur"               | "Inaccesible, Accesible, Accesible"                     | "Paradero Norte, Paradero Sur, Paradero Central"     |
