Feature: US24: Crear grupos de usuarios locales

  Como persona con movilidad reducida circunstancialmente,
  Quiero crear grupos locales dentro de la plataforma,
  Para poder intercambiar información sobre barreras y accesibilidad de mi comunidad
  y mejorar la colaboración entre los usuarios.

  Scenario Outline: E1: Creación de un grupo local

    Dado que una persona con movilidad reducida circunstancialmente está en la pestaña “Comunidad“
    Y ha seleccionado la subsección “Grupos”. 
    Y el usuario desea crear un grupo local.
    Cuando la persona con movilidad reducida circunstancialmente presiona el <boton>.
    Entonces el sistema le pedirá ingresar la información del grupo y lo creará con
    <nombre_grupo>, <descripcion_grupo> y <ubicacion_grupo>.

    Examples: Datos de entrada
    | boton                 |
    | "crear nuevo grupo"   |
    | "crear nuevo grupo"   |
    | "crear nuevo grupo"   |

    Examples: Datos de salida
    | nombre_grupo           | descripcion_grupo                                  | ubicacion_grupo      |
    | "Accesibilidad Lima"   | "Grupo para reportar barreras en Lima Centro"      | "Lima Cercado"       |
    | "Barreras San Miguel"  | "Comunidad para mejorar accesos en el distrito"    | "San Miguel"         |
    | "Rutas Callao"         | "Usuarios compartiendo rutas seguras en el Callao" | "Callao"             |


  Scenario Outline: E2: Agregar miembros al grupo

    Dado que una persona con movilidad reducida circunstancialmente está en la pestaña "Comunidad"
    Y ha creado un grupo local. 
    Y el usuario está en la subsección "Grupos".
    Cuando la persona con movilidad reducida circunstancialmente utiliza un campo de búsqueda
    para encontrar y agregar miembros por <id_usuario>.
    Entonces el sistema enviará una <invitacion> al usuario seleccionado y lo agregará al grupo
    cuando acepten la invitacion.

    Examples: Datos de entrada
    | id_usuario       |
    | "USR103"         |
    | "USR550"         |
    | "USR999"         |

     Examples: Datos de salida
    | invitacion                                                      |
    | Ana te ha invitado que te unas a "Accesibilidad Lima"           |
    | "Marcos te ha invitado ha que te unas a "Barreras San Miguel"   |
    | "Lucas te ha invitado a que te unas a "Rutas Callao"            |


  Scenario Outline: E3: Modificación de la información del grupo

    Dado que una persona con movilidad reducida circunstancialmente es el creador de un grupo local
    y está en el apartado de modificar grupo.
    Cuando la persona con movilidad reducida circunstancialmente presione el <boton_editar>.
    Entonces el sistema pedirá la nueva información <nuevo_nombre>, <nueva_descripcion>, <nueva_ubicacion> 
    Y actualizará la informacion del grupo 
    Y reflejara los cambios en la plataforma.

    Examples: Datos de entrada
    | boton_editar |
    | "Editar"     |

     Examples: Datos de salida
    | nuevo_nombre              | nueva_descripcion                                    | nueva_ubicacion |
    | "Accesibilidad Lima Plus" | "Mejora de accesos en Lima con reportes coordinados" | "Lima Cercado"  |
