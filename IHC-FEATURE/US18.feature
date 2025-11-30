Feature: US18: Desbloqueo de Insignias por Contribución

  Como miembro de la comunidad,
  Quiero desbloquear insignias por logros,
  Para sentirme motivado y reconocido por mis contribuciones.


Scenario Outline: E1: Notificación de nueva insignia

    Dado que un usuario realiza la acción final requerida para una insignia.
    Cuando el sistema le otorga la <insignia>.
    Entonces el sistema muestra una <notificacion> (tipo snackbar) que desaparece automáticamente después de unos segundos.
    Y la nueva insignia aparece visible en Perfil > Mis Logros e Insignias > Mis Insignias.

    Examples: Datos de entrada
    | insignia             |
    | "Explorador Urbano"  |
    | "Colaborador Activo" |
    | "Viajero Local"      |

    Examples: Datos de salida
    | notificacion                                       |
    | "¡Insignia desbloqueada: Explorador Urbano!"       |
    | "¡Insignia desbloqueada: Colaborador Activo!"      |
    | "¡Insignia desbloqueada: Viajero Local!"           |


Scenario Outline: E2: Ver la lista de todas las insignias disponibles

    Dado que el usuario está en la pestaña Perfil.
    Cuando el usuario navega a "Mi Actividad" 
    Y visualiza el <boton> 
    Y hace clic.
    Entonces el sistema muestra la <lista_insignias> de todas las insignias que se pueden obtener.
    Y el sistema muestra las que ya tienen en color 
    Y las que faltan en gris junto con el <criterio_insignia> para desbloquearla.

    Examples: Datos de entrada
    | boton                    |
    | "Mis logros e Insignias" |

    Examples: Datos de salida
    | lista_insignias                | criterio_insignia                     |
    | "Colaborador Activo (gris)"    | "Valida 10 reportes"                  |
    | "Viajero Local (gris)"         | "Reporta en 5 distritos diferentes"   |
    | "Explorador Urbano (color)"    |  

Scenario Outline: E3: Visualizar logros recientes en Home

    Dado que el usuario ha desbloqueado insignias y está en la pestaña "Home".
    Cuando visualiza la sección "Tus Logros Recientes".
    Entonces el sistema le muestra su <insignia_reciente>.
    Y muestra un <enlace_ver_todos> que lo dirige a la pantalla del Escenario 2.

    Examples: Datos de salida
    | insignia_reciente                    | enlace_ver_todos           |
    | "¡Desbloqueaste: Explorador Urbano!" | "Ver todos mis logros"     |
    | "¡Desbloqueaste: Colaborador Activo!"| "Ver todos mis logros"     |
    | "¡Desbloqueaste: Viajero Local!"     | "Ver todos mis logros"     |
