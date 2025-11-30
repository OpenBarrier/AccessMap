Feature: US48: Compatibilidad con Lectores de Pantalla

  Como persona con discapacidad visual,
  Quiero que la app sea compatible con lectores de pantalla,
  Para poder usarla sin barreras digitales.

  # Escenario 1: Anuncio de elementos interactivos
  Scenario Outline: E1: Anuncio de elementos interactivos

    Dado que el usuario tiene el lector de pantalla <estado> 
    Cuando el usuario navega por la pantalla del mapa
    Entonces el lector de pantalla anuncia verbalmente y de forma clara el propósito de cada botón <boton>
    
    Examples: Datos de entrada
      | estado      |
      | activado    |
   

    Examples: Datos de salida
      | boton                      |
      | "Reportar barrera"         |
      | "Buscar dirección"         |
      | "Abrir menú "              |
      | "Reportar barrera"         |
      | "Buscar dirección"         |
      | "Abrir menú "              |


  Scenario Outline: E2: Lectura de detalles del reporte

    Dado que el usuario con lector de pantalla <lector_activado> ha seleccionado un reporte en el mapa
    Cuando se abre la pantalla de detalles del reporte
    Entonces el lector de pantalla lee en voz alta y en orden lógico: <tipo_barrera>, <descripcion>, <direccion>

    Examples: Datos de entrada
      | lector_activado | 
      | "TalkBack"      | 
      | "VoiceOver"     | 

    Examples: Datos de salida
      | lectura_ordenada                                                  |
      | "Escalera, Escalón sin rampa, Av. Principal 123"                  |
      | "Obstáculo acera, Señal caída bloquea paso, Calle 45 #67-89"      |


    Scenario Outline: E3: Interacción con formularios

    Dado que el usuario está en el formulario para crear un nuevo reporte con el lector de pantalla <lector_activado>
    Cuando el usuario se posiciona en un campo de texto <campo_texto>
    Entonces el lector de pantalla anuncia la <etiqueta_campo> antes de que el usuario ingrese el texto

    Examples: Datos de entrada
      | lector_activado | campo_texto         |
      | "TalkBack"      | "campo_descripcion" |
      | "TalkBack"      | "campo_direccion"   |
      | "TalkBack"      | "campo_tipo"        |
      | "TalkBack"      | "campo_foto"        |
      | "VoiceOver"     | "campo_descripcion" |
      | "VoiceOver"     | "campo_direccion"   |
      | "VoiceOver"     | "campo_tipo"        |
      | "VoiceOver"     | "campo_foto"        |

    Examples: Datos de salida
      | etiqueta_campo                        |
      | "Describe la barrera"                 |
      | "Ingresa la dirección de la barrera" |
      | "Selecciona el tipo de barrera"      |
      | "Adjunta una foto de la barrera"     |
      | "Describe la barrera"                 |
      | "Ingresa la dirección de la barrera" |
      | "Selecciona el tipo de barrera"      |
      | "Adjunta una foto de la barrera"     |
