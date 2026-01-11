# Design: genesis_X Elite Protocol + A2UI Lab Adaptation

**Fecha:** 2025-01-10
**Status:** Aprobado

---

## Resumen

Dos iniciativas paralelas:
1. **Adaptar A2UI Lab** - Los 6 widgets existentes adoptan el estilo `GlassCard` del sistema actual
2. **Nueva sección genesis_X** - 5 widgets nuevos con el design system "Elite Protocol" para evaluación como estilo oficial de GENESIS

---

## 1. Adaptación A2UI Lab

### Cambios Requeridos

Los 6 widgets en `a2ui-lab/A2UILabWidgets.tsx` actualmente usan estilos inline. Se adaptarán para usar:

- `GlassCard` como wrapper principal
- `AgentBadge` para atribución de agente
- `ActionButton` para acciones
- Eliminar labels técnicos ("Multi-Surface", "path: /xxx") que son para desarrollo

### Widgets a Adaptar
1. `LiveWorkoutSession` - Multi-Surface
2. `ReactiveBiometrics` - Data Binding
3. `ExerciseInputPanel` - Two-Way Binding
4. `SupersetBuilder` - Templates
5. `StreamingWorkoutGen` - Progressive Rendering
6. `MultiAgentDashboard` - Orchestration

---

## 2. genesis_X - Elite Protocol

### Design System Tokens

```css
/* Colores */
--elite-primary: #6D00FF;
--elite-accent: #4C00B0;
--elite-bg: #050505;
--elite-white: #FFFFFF;

/* Gradiente Signature */
background: linear-gradient(135deg, #6D00FF 0%, #4C00B0 50%, #000000 100%);

/* Textura Grainy */
background-image: url('https://grainy-gradients.vercel.app/noise.svg');
opacity: 0.20;
mix-blend-mode: overlay;

/* Shadow Glow */
box-shadow: 0 0 30px rgba(109, 0, 255, 0.15);
```

### Tipografía

| Elemento | Estilo |
|----------|--------|
| Headlines | `font-black italic text-2xl+ tracking-tighter` |
| Labels | `text-[10px] uppercase tracking-widest font-bold` |
| Números | `font-mono` (data/tactical feel) |

### Componentes

#### EliteCard (Base)
```tsx
<div className="relative overflow-hidden rounded-2xl
  border border-[#6D00FF]/50
  bg-gradient-to-br from-[#6D00FF] via-[#4C00B0] to-black
  p-6 shadow-[0_0_30px_rgba(109,0,255,0.15)]
  group transition-all duration-300 hover:scale-[1.02]">

  {/* Grainy Texture */}
  <div className="absolute inset-0 opacity-20
    bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
    mix-blend-overlay pointer-events-none" />

  <div className="relative z-10">{children}</div>
</div>
```

#### EliteButton (CTA)
```tsx
<button className="w-full py-3 bg-white text-black
  font-bold text-xs uppercase tracking-widest rounded-lg
  hover:scale-105 active:scale-95 transition-all
  shadow-[0_0_20px_rgba(255,255,255,0.3)]">
  INICIAR PROTOCOLO
</button>
```

### Widgets Elite (5)

#### 1. HeroCard
- **Propósito:** CTA principal de impacto
- **Props:** `title`, `subtitle`, `ctaText`, `onAction`
- **Estilo:** Headline italic grande, botón blanco de alto contraste

#### 2. WorkoutCardElite
- **Propósito:** Card de rutina premium
- **Props:** `title`, `category`, `duration`, `exercises[]`, `intensity`
- **Estilo:** Gradiente violeta, métricas en grid, botón "INICIAR"

#### 3. ProgressDashboardElite
- **Propósito:** Dashboard de métricas con estilo cinematic
- **Props:** `weekProgress`, `metrics[]`, `streak`, `level`
- **Estilo:** Progress rings, números grandes mono, badges

#### 4. AchievementUnlock
- **Propósito:** Celebración de logro desbloqueado
- **Props:** `title`, `description`, `rarity`, `xpReward`, `icon`
- **Estilo:** Animación dramática de entrada, glow intenso

#### 5. GoalCommitment
- **Propósito:** Card de compromiso con objetivo
- **Props:** `goalText`, `deadline`, `milestones[]`, `committed`
- **Estilo:** Headline motivacional, checkbox de compromiso

---

## 3. Estructura de Archivos

```
ngx_A2UI_studio/
├── a2ui-lab/
│   └── A2UILabWidgets.tsx    # MODIFICAR: usar GlassCard
├── genesis-x/                 # NUEVO
│   ├── index.ts
│   ├── types.ts
│   ├── EliteCard.tsx
│   └── GenesisXWidgets.tsx
├── App.tsx                    # MODIFICAR: agregar sección genesis_X
└── components/
    └── WidgetRenderer.tsx     # MODIFICAR: registrar widgets Elite
```

---

## 4. Integración en Sidebar

Nueva sección en el sidebar:

```
genesis_X          [ELITE]
├── Hero Card
├── Workout Elite
├── Progress Elite
├── Achievement
└── Goal Commitment
```

---

## 5. Alineación con A2UI Protocol

Aunque genesis_X es un visualizador, mantenemos alineación conceptual:

| Concepto A2UI | Implementación genesis_X |
|---------------|--------------------------|
| `surfaceUpdate` | Props del widget definen estructura |
| `dataModelUpdate` | State interno con paths simulados |
| `beginRendering` | Mount del componente React |
| Data Binding | Props reactivos con useState |
| Component Catalog | `GENESIS_X_WIDGET_MAP` |

---

## 6. Sources

- [A2UI Official](https://a2ui.org/)
- [GitHub google/A2UI](https://github.com/google/A2UI)
- [Google Developers Blog](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [A2UI Agent Development Guide](https://a2ui.org/guides/agent-development/)
