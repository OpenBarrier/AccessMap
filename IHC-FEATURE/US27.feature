Feature: US27: Calificación de establecimientos

  Como persona en silla de ruedas,
  Quiero calificar la accesibilidad de locales y servicios
  Para ayudar a otros a elegir lugares confiables.

Scenario Outline: E1: Enviar una calificación de accesibilidad

    Dado la persona en silla de ruedas ya finalizó la ruta y se ha desplegado la ventana emergente de “Viaje Completado”.
    Cuando asigna una <puntuacion> tocando sobre las estrellas
    Entonces el sistema guarda la calificación en el <perfil_lugar>
    Y muestra el mensaje <mensaje_confirmacion> en la misma pantalla emergente.

  Examples: Datos de entrada
    | puntuacion |
    | 1          |
    | 2          |
    | 4          |
    | 5          |

  Examples: Datos de salida
    | perfil_lugar     | mensaje_confirmacion       |
    | "Lugar X"        | "Gracias por calificar!"   |
    | "Lugar Y"        | "Gracias por calificar!"   |
    | "Lugar Z"        | "Gracias por calificar!"   |
    | "Lugar W"        | "Gracias por calificar!"   |


Scenario Outline: E2: Límite de rutas guardadas desde la encuesta disponible

    Dado que el usuario ha finalizado una ruta guiada por la app y se ha desplegado la ventana emergente de “Viaje Completado”.
    Cuando presiona el <boton_guardar_ruta>
    Entonces el sistema verifica el <limite_rutas> que aún no ha alcanzado su límite de rutas 
    Y despliega la segunda ventana emergente <ventana_guardar_ruta>

  Examples: Datos de entrada
    | boton_guardar_ruta |
    | "Guardar ruta"     |

  Examples: Datos de salida
    | limite_rutas        | ventana_guardar_ruta      |
    | "no alcanzado"      | "Guarda tu ruta"          |
 


Scenario Outline: E3: Guardado exitoso de la ruta desde la encuesta

    Dado que el usuario ha finalizado una ruta guiada por la app y se ha desplegado la ventana emergente de “Viaje Completado” y se ha desplegado la segunda ventana emergente “Guarda tu ruta”.
    Cuando el usuario complete el campo <nombre_ruta> y presiona <boton_aceptar>
   Entonces el sistema guardará la ruta, cierra la ventana emergente “Dale un nombre a tu ruta” 
   Y dejará un <mensaje_confirmacion> de la ventana emergente de “Viaje Completado”

  Examples: Datos de entrada
    | nombre_ruta       | boton_aceptar        |
    | "Ruta Centro"     | "Aceptar"            |
    | "Ruta Parque"     | "Aceptar"            |
    | "Ruta Museo"      | "Aceptar"            |
    | "Ruta Universidad"| "Aceptar"            |

  Examples: Datos de salida
   | mensaje_confirmacion |
   | "Ruta guardada"     |
   | "Ruta guardada"     |
   | "Ruta guardada"     |
   | "Ruta guardada"     |


  Scenario Outline: E4: Guardado cancelado de la ruta desde la encuesta

    Dado que  el usuario ha finalizado una ruta guiada por la app 
    Y se ha desplegado la ventana emergente de “Viaje Completado”
    Y se ha desplegado la segunda ventana emergente “Guarda tu ruta”.
    Cuando  el usuario complete o no complete el campo <nombre_ruta>
    Y presione <boton_cancelar>
    Entonces el sistema no guarda la ruta <ruta_guardada>
    Y cierra la ventana <ventana_emergente>

  Examples: Datos de entrada
    | nombre_ruta                  | boton_cancelar |
    | "ruta para la escuela"       | "Cancelar"     |
    | "Guarda para el hospital"    | "Cancelar"     |
    | "ruta más rapida al hospital"| "Cancelar"     |
    

  Examples: Datos de salida
    | ruta_guardada | ventana_emergente    |
    | "no"          | "cerrada"            |
    | "no"          | "cerrada"            |
    | "no"          | "cerrada"            |
    | "no"          | "cerrada"            |


  Scenario Outline: E5: Límite de rutas guardadas desde la encuesta no disponible

    Dado el usuario es no premium y ha finalizado una ruta guiada por la app 
    Y se ha desplegado la ventana emergente de “Viaje Completado”.
    Cuando presiona <boton_guardar_ruta>
    Entonces el sistema verifica que ha alcanzado su <limite_rutas>
    Y muestra el mensaje <mensaje_alerta> en el lugar del botón de "Guardar ruta" de la ventana emergente de “Viaje Completado”.


  Examples: Datos de entrada
    | boton_guardar_ruta |
    | "Guardar ruta"     |
    | "Guardar ruta"     |
    | "Guardar ruta"     |
    | "Guardar ruta"     |

  Examples: Datos de salida
    | limite_rutas | mensaje_alerta                                      |
    | "alcanzado"  | "Completaste tus rutas guardadas disponibles 3/3"  |
    | "alcanzado"  | "Completaste tus rutas guardadas disponibles 3/3"  |
    | "alcanzado"  | "Completaste tus rutas guardadas disponibles 3/3"  |
    | "alcanzado"  | "Completaste tus rutas guardadas disponibles 3/3"  |


Scenario Outline: E6: Ver la calificación promedio de un lugar

    Dado qa persona en silla de ruedas está explorando la <lista_resultados>
    Cuando visualiza el lugar que l,e interesa
    Entonces el sistema muestra la <calificacion_promedio> en los resultados de busqueda, junto con los demás datos.

  Examples: Datos de entrada
    | lista_resultados  
    | "Lugar X" |
    | "Lugar Y" |
    | "Lugar Z" |
    | "Lugar W" |

  Examples: Datos de salida
    | calificacion_promedio |
    | "4.5 estrellas"       |
    | "3.8 estrellas"       |
    | "5 estrellas"         |
    | "4 estrellas"         |
