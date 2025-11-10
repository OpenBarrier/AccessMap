Feature: US7: Recálculo automático de ruta

  Como persona con movilidad reducida,
  Quiero que la aplicación recalcule mi ruta automáticamente si aparece un nuevo obstáculo
  Para evitar retrasos y riesgos en mis desplazamientos.

  Scenario Outline: E1: Recálculo exitoso de ruta ante obstáculo

    Dado que el usuario se encuentra en la 'vista navegacion Activa'
    Cuando el sistema detecta un <obstaculo_nuevo> y crítico
    Entonces el sistema genera una <ruta_alternativa> en menos de <tiempo_recalculo>
    Y comienza a guiar al usuario por el <nuevo_trayecto> sin interrumpir la navegación principal.

  Examples: Datos de entrada
    | obstaculo_nuevo      | 
    | "Rampa dañada"       | 
    | "Bache profundo"     | 
    | "Escalera sin rampa" | 
    | "Obstáculo en vía"   |

  Examples: Datos de salida
    | ruta_alternativa                  | tiempo_recalculo |
    | "Ruta alternativa accesible"      | "3 segundos"    |
    | "Ruta alternativa accesible"      | "2.5 segundos"  |
    | "Ruta alternativa accesible"      | "3 segundos"    |
    | "Ruta alternativa accesible"      |"2.8 segundos"  |


  Scenario Outline: E2: Sin alternativa de ruta disponible (Activación de Emergencia)

    Dado que el usuario se encuentra en la "Vista de Navegación Activa" y el sistema detecta un <obstaculo_critico>
    Cuando el sistema intenta recalcular pero no encuentra una ruta segura
    Entonces el sistema detiene la navegación y muestra una pantalla de emergencia con el <mensaje_emergencia>
    Y la pantalla de emergencia presenta <botones_accion>
    Y la pantalla incluye un <control_descartar> para volver a la navegación manual.

  Examples: Datos de entrada
    | obstaculo_critico     | 
    | "Rampa bloqueada"     | 
    | "Bache gigante"       | 
    | "Escalera sin rampa"  | 
    | "Obstáculo en vía"     | 

  Examples: Datos de salida
    | mensaje_emergencia                                                      | botones_accion                                                | control_descartar              |
    | "¡Ruta bloqueada! No se encontró una alternativa segura."               | "Contactar Emergencias, Alertar Contacto de Confianza"       | "X / Volver al Mapa"          |
  