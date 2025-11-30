Feature: US17: Racha de reportes

    Como colaborador constante,
    Quiero mantener una racha diaria de reportes
    Para obtener recompensas especiales y no perder mi progreso.

Scenario Outline: E1: Conteo de días consecutivos

    Dado que el usuario realiza reportes en la aplicación diariamente,
    Cuando los reportes son validados y registrados en la aplicación,
    Entonces el sistema suma su racha de días consecutivos <nueva_racha>.

    Examples: Datos de salida
    | nueva_racha |
    | 2 días |
    | 5 días |
    | 13 días |
    | 27 días |

Scenario Outline: E2: Recompensas por racha

    Dado que el usuario mantiene una racha de varios días,
    Cuando logra un <hito de_rachas>,
    Entonces la aplicación le otorga <insignias_otorgada> relacionadas visibles en la pestaña Perfil en la subsección “Mis Logros” en el apartado de “Mis Insignias”.

    Examples: Datos de entrada
     | hito_rachas |
     | 7 días      |
     | 14 días     |
     | 30 días     |

    Examples: Datos de salida
    | insignia_otorgada    |
    | Insignia Explorador  |
    | Insignia Colaborador |
    | Insignia Leyenda     |

Scenario Outline: E3: Reinicio de racha

    Dado que el usuario con racha activa deja de hacer reportes durante un día,
    Cuando el usuario consulta su racha en su perfil dentro de la aplicación,
    Entonces el sistema reinicia la racha automáticamente <valor_racha>.

    Examples: Datos de salida
    | valor_racha |
    | 0 días |