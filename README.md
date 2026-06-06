Nombre completo: Rebeca Esther Rojas Morejón
Materia: Programación Web I
Título del Proyecto: Sistema de Evaluación Económica Familiar y Medición de Inflación en el Hogar
Enlace de la página web:  https://rebecagith.github.io/Proyecto-Final/
Enlace del repositorio GitHub: https://github.com/RebecaGitH/Proyecto-Final.git

# Motor de Evaluación Macroeconómica Familiar v16.7
### Sistema de Auditoría Financiera ante Conflictos Sociales (La Paz - Bolivia)

---

##  Descripción
Herramienta analítica diseñada para cuantificar el impacto económico de los conflictos sociales (bloqueos y paros) en los hogares paceños. Evalúa el encarecimiento de la canasta alimentaria, la ineficiencia en transporte/combustibles y las condiciones de vulnerabilidad del núcleo familiar para emitir un **dictamen financiero semafórico**.

---

##  Características Clave
* **Validación en Tiempo Real:** Bloquea incoherencias demográficas (dependientes > miembros totales) sin congelar el formulario.
* **Flujo de Movilidad Flexible:** Mapeo logístico para transporte público, privado o mixto.
* **Gráficos Dinámicos:** Renderizado inmediato de barras semafóricas proporcionales (Verde/Amarillo/Rojo).
* **Formato de Impresión:** Diseño CSS optimizado para exportar el reporte limpio a PDF (`Ctrl + P`).

---

##  Estructura del Proyecto
```text
├── index.html          # Interfaz y contexto de uso
├── css/styles.css      # Estilos responsivos e impresión
└── js/script.js        # Core lógico y motor de renderizado