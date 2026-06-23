# Munival VE - Dashboard de Tasas Municipales

Munival es un simulador interactivo diseñado para empresas y administraciones municipales en Venezuela. Su objetivo es facilitar el cálculo y análisis del Impuesto a las Actividades Económicas (IAE), permitiendo visualizar de forma clara la relación entre los ingresos brutos, las alícuotas vigentes y los mínimos tributables establecidos por ordenanza.

## 🚀 Logica de la Aplicación

La aplicación funciona bajo un motor de reglas fiscales dinámicas:
1.  **Selección de Rubro:** Al elegir una actividad económica, el sistema carga automáticamente los valores referenciales (Alícuota % y Mínimo Mensual) comunes en municipios como Chacao, Baruta o Libertador.
2.  **Cálculo Dual:** Compara el impuesto calculado (Ingresos x Alícuota) contra el Mínimo Tributable (MMT).
3.  **Decisión Fiscal:** Determina el monto neto a pagar aplicando el mayor de ambos valores, cumpliendo con la normativa de "mínimo de ordenanza".
4.  **Análisis de Carga:** Calcula el porcentaje real de presión fiscal sobre los ingresos brutos.

## 🛠️ Instalación y Uso

Este proyecto está construido con **Next.js 15, React, Tailwind CSS y ShadCN UI**. Es compatible con cualquier gestor de paquetes moderno.

### Requisitos previos
- Node.js 18.x o superior.

### Pasos para ejecutar
```bash
# Instalar dependencias
npm install  # o 'yarn install' o 'pnpm install'

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📈 Futuro Escalable

Munival ha sido diseñado con una arquitectura modular lista para crecer:
- **Conectividad con Bases de Datos:** Capacidad de integrarse con PostgreSQL o Firestore para gestionar historiales de declaraciones reales.
- **Integración con Pasarelas de Pago:** Posibilidad de conectar el botón de "Exportar" con sistemas de pago bancario (Multipago, Banesco, etc.).
- **IA Fiscal:** Integración con Google Gemini (vía Genkit) para ofrecer asesoría legal personalizada basada en la Ley de Armonización Tributaria.
- **Multi-Municipio:** Selector de municipio para cargar automáticamente ordenanzas específicas de diferentes regiones de Venezuela.

## 🎨 Diseño y UI
- **Tema Institucional:** Colores Esmeralda (#10B981) para transmitir confianza y transparencia gubernamental.
- **Responsive Design:** Adaptabilidad total desde smartphones hasta monitores ultrawide.
- **Accesibilidad:** Uso de componentes semánticos y contraste optimizado.

---
*Desarrollado para la modernización de la gestión fiscal municipal.*