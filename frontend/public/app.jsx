// app.jsx — main app shell, router, tweaks panel mount

const { useState: aState, useEffect: aEffect, useMemo: aMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "primary": "#5b3fdb",
  "accent": "#1f8f5b",
  "fontScale": 1,
  "density": "comfy",
  "cursosVariant": "cards",
  "calVariant": "mes",
  "showDemoFlow": false
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#5b3fdb', '#2a6fdb', '#b8442e', '#1f8f5b'];
const ACCENT_OPTIONS  = ['#1f8f5b', '#c47a1e', '#5b3fdb', '#2a6fdb'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = aState('tablero');
  const [cursoId, setCursoId] = aState(null);
  const [tareaId, setTareaId] = aState(null);
  const [grupoId, setGrupoId] = aState(null);
  const [toast, toastNode] = useToast();

  // Apply theme & tweaks
  aEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    const root = document.documentElement;
    root.style.setProperty('--primary', t.primary);
    // Derive primary-soft (semi-transparent tint of primary)
    root.style.setProperty('--primary-soft', hexToRgba(t.primary, t.dark ? 0.18 : 0.12));
    root.style.setProperty('--primary-ink', t.dark ? lighten(t.primary, 0.3) : darken(t.primary, 0.35));
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', hexToRgba(t.accent, t.dark ? 0.18 : 0.16));
    document.body.style.fontSize = (15 * t.fontScale) + 'px';
  }, [t.dark, t.primary, t.accent, t.fontScale]);

  // Routing helpers
  const openCurso = (id) => { setCursoId(id); setRoute('curso'); window.scrollTo(0, 0); };
  const openTarea = (id) => { setTareaId(id); setRoute('tarea'); window.scrollTo(0, 0); };
  const openGrupo = (id) => { setGrupoId(id); setRoute('grupos'); window.scrollTo(0, 0); };
  const back = (to) => { setRoute(to); window.scrollTo(0, 0); };

  const renderRoute = () => {
    switch (route) {
      case 'tablero':    return <VistaTablero setRoute={setRoute} openCurso={openCurso} tw={t} />;
      case 'cursos':     return <VistaCursos openCurso={openCurso} tw={t} />;
      case 'curso':      return <VistaCursoDetalle cursoId={cursoId} goBack={() => back('cursos')} openTarea={openTarea} />;
      case 'tarea':      return <VistaTarea tareaId={tareaId} goBack={() => back('curso')} onSubmit={(msg, err) => toast(msg)} />;
      case 'grupos':     return <VistaGrupos openGrupo={openGrupo} tw={t} />;
      case 'calendario': return <VistaCalendario tw={t} openCurso={openCurso} />;
      case 'bandeja':    return <VistaBandeja tw={t} />;
      case 'historial':  return <VistaHistorial />;
      case 'ayuda':      return <VistaAyuda />;
      case 'cuenta':     return <VistaCuenta />;
      default:           return <VistaTablero setRoute={setRoute} openCurso={openCurso} tw={t} />;
    }
  };

  // Normalize route for topbar highlighting
  const navRoute = route === 'curso' ? 'cursos' :
                   route === 'tarea' ? 'cursos' :
                   route;

  return (
    <div className="app">
      <Topbar route={navRoute} setRoute={(r) => { setRoute(r); window.scrollTo(0, 0); }} online={!t.dark || true} />
      <main className="main" key={route + (cursoId || '') + (tareaId || '')}>
        {renderRoute()}
      </main>
      <BottomNav route={navRoute} setRoute={setRoute} />
      {toastNode}

      <TweaksPanel title="Tweaks · Aula">
        <TweakSection label="Tema" />
        <TweakToggle label="Modo oscuro" value={t.dark} onChange={v => setTweak('dark', v)} />
        <TweakColor label="Color primario" value={t.primary} options={PRIMARY_OPTIONS} onChange={v => setTweak('primary', v)} />
        <TweakColor label="Color de acento" value={t.accent} options={ACCENT_OPTIONS} onChange={v => setTweak('accent', v)} />
        <TweakSlider label="Escala de texto" min={0.9} max={1.15} step={0.05} value={t.fontScale} unit="x" onChange={v => setTweak('fontScale', v)} />

        <TweakSection label="Variantes de vista" />
        <TweakRadio label="Cursos" value={t.cursosVariant} options={['cards', 'lista']} onChange={v => setTweak('cursosVariant', v)} />
        <TweakRadio label="Calendario" value={t.calVariant} options={['mes', 'semana', 'agenda']} onChange={v => setTweak('calVariant', v)} />

        <TweakSection label="Atajos · flujo demo" />
        <TweakButton label="Tablero" onClick={() => setRoute('tablero')} />
        <TweakButton label="Abrir Cálculo Integral" onClick={() => openCurso('mat')} />
        <TweakButton label="Entregar tarea (problema 14)" onClick={() => openTarea('t1')} />
        <TweakButton label="Calendario · semana" onClick={() => { setRoute('calendario'); setTweak('calVariant', 'semana'); }} />
        <TweakButton label="Bandeja (chat docente)" onClick={() => setRoute('bandeja')} />
        <TweakButton label="Mi cuenta" onClick={() => setRoute('cuenta')} />
      </TweaksPanel>
    </div>
  );
}

// Color helpers
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function lighten(hex, amount) { return mix(hex, '#ffffff', amount); }
function darken(hex, amount)  { return mix(hex, '#000000', amount); }
function mix(a, b, w) {
  const pa = parseHex(a), pb = parseHex(b);
  const r = Math.round(pa[0] * (1 - w) + pb[0] * w);
  const g = Math.round(pa[1] * (1 - w) + pb[1] * w);
  const bl = Math.round(pa[2] * (1 - w) + pb[2] * w);
  return `rgb(${r}, ${g}, ${bl})`;
}
function parseHex(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
