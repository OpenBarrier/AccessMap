Feature: US11: Historial de reportes personales

    Como usuario frecuente,
    Quiero consultar mi historial de reportes enviados
    Para dar seguimiento a los arreglos o cambios realizados en los puntos que informé.

Scenario Outline: E1: Visualización de historial de reportes

    Dado que el usuario se encuentra en su pantalla principal de Perfil.
    Cuando el usuario selecciona la <opcion>.
    Entonces el sistema le muestra la pantalla "Mis Contribuciones" con la <lista_reportes> enviados, incluyendo <fecha_reporte>, <ubicacion_reporte> y <estado_actual>.

Examples: Datos de entrada
| opcion               |
| "Mis Contribuciones" |

Examples: Datos de salida
| lista_reportes             | fecha_reporte | ubicacion_reporte  | estado_actual |
| cruce bloqueado            | "12/02/2025"  | Av. Arequipa 1450  | "Activo"      |
| rampa dañada               | "05/02/2025"  | Parque Kennedy     | "Resuelto"    |
| ascensor fuera de servicio | "28/01/2025"  | Estación México    | "Activo"      |

Scenario Outline: E2: Sin reportes registrados

    Dado que el usuario accede a la sección "Mis Contribuciones" desde Perfil.
    Cuando el sistema valida que no existen reportes disponibles.
    Entonces el sistema muestra en la pantalla "Mis Contribuciones" el <mensaje> y un <boton_accion>.

Examples: Datos de salida
| mensaje                                              | boton_accion |
| "¡Sé un colaborador! No tienes reportes enviados..." | Reporta Aquí |