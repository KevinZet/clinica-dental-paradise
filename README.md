# Clínica Dental Paradise

Sitio web oficial y sistema CRM de gestión de citas para la Clínica Dental Paradise en Lima, Perú.

## Características

- Sitio web público con información de servicios, sedes y promociones
- Sistema de agendamiento de citas en línea
- Panel CRM administrativo con métricas, calendario y gestión de pacientes
- Test de diagnóstico dental interactivo
- Integración con WhatsApp para comunicación directa
- Galería de transformaciones antes/después

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (gráficos)
- Lucide React (iconos)

## Ejecución local

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:3000`.

## Build

```bash
npm run build
```

## Estructura del proyecto

```
src/
  components/
    PatientPortal.tsx    # Portal público del paciente
    CRMSelector.tsx      # Panel CRM administrativo
    LeadQuiz.tsx         # Test de diagnóstico dental
    BeforeAfterSlider.tsx # Comparador antes/después
  data.ts                # Datos de sedes, servicios, pacientes
  types.ts               # Definiciones de tipos TypeScript
  App.tsx                 # Componente principal
  main.tsx               # Punto de entrada
```
