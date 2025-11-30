Feature: US40: Lista de lugares favoritos

  Como persona con movilidad reducida,
  Quiero guardar una lista de mis lugares accesibles favoritos,
  Para acceder de manera rápida.


  Scenario Outline: E1: Agregar un lugar a favoritos exitosamente

    Dado que el usuario ha iniciado sesión en la aplicación
    Y ha finalizado la ruta
    Cuando el usuario hace clic en <boton_agregar_favoritos>
    Entonces el sistema guarda el lugar en su lista de favoritos dentro del Perfil en la subsección "Mis lugares favoritos"
    Y muestra un <mensaje_confirmacion>

    Examples: Datos de entrada
      | boton_agregar_favoritos    |
      | "Agregar a favoritos"      |

    Examples: Datos de salida
      | mensaje_confirmacion              |
      | "Lugar agregado a favoritos"      |


  Scenario Outline: E2: Eliminar un lugar de favoritos

    Dado que el usuario ha agregado previamente un lugar a favoritos
    Y se encuentra en la subsección "Ver Lugares Favoritos" dentro del Perfil
    Cuando hace clic en <icono_corazon>
    Entonces el sistema elimina el lugar de la lista en esa pantalla <accion>.

    Examples: Datos de entrada
      | icono_corazon       |
      | "Ícono de corazón"  |
   

    Examples: Datos de salida
      | accion                         |
      | Lugar eliminado de favoritos   |
      

  Scenario Outline: E3: Visualizar lista de favoritos

    Dado que el usuario ha guardado uno o más lugares favoritos
    Y se encuentra en la pestaña de "Perfil"
    Cuando hace clic en la <subseccion>
    Entonces el sistema muestra en la pantalla "Mis Lugares Favoritos" todos los lugares guardados
    Y permite al usuario ver detalles o iniciar la navegación hacia ellos

    Examples: Datos de entrada
      | subseccion              |
      | "Mis lugares favoritos" |

    Examples: Datos de salida
      | lista_favoritos_mostrada |                   
      | "Parque Central"         | 
      | "Museo de Arte"          |
      | "Plaza Norte"            | 
      | "Biblioteca Municipal"   | 