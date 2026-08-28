// app.jsx — shell, router, nivel adaptativo (modo niños/estudiante), paleta ⌘K, tweaks

const { useState: aState, useEffect: aEffect, useMemo: aMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "primary": "#5b3fdb",
  "accent": "#1f8f5b",
  "fontScale": 1,
  "offline": false,
  "nivel": "sec"
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#5b3fdb', '#2a6fdb', '#1f8f5b', '#c0562f'];
const ACCENT_OPTIONS  = ['#1f8f5b', '#c47a1e', '#5b3fdb', '#2a6fdb'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Aplica el nivel activo ANTES de renderizar los hijos (mutación idempotente).
  setNivel(t.nivel || 'sec');
  const modo = modoActivo();

  const [route, setRoute] = aState('inicio');
  const [skillId, setSkillId] = aState(ESTUDIANTE.siguienteSkillId);
  const [practicaVolver, setPracticaVolver] = aState('ruta');
  const [toast, toastNode] = useToast();
  const [cmdkOpen, setCmdkOpen] = aState(false);

  // Tema + modo (niños/estudiante)
  aEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    root.setAttribute('data-modo', modo);
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--primary-soft', hexToRgba(t.primary, t.dark ? 0.20 : 0.12));
    root.style.setProperty('--primary-ink', t.dark ? lighten(t.primary, 0.3) : darken(t.primary, 0.35));
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', hexToRgba(t.accent, t.dark ? 0.18 : 0.16));
    document.body.style.fontSize = ((modo === 'kids' ? 16 : 15) * t.fontScale) + 'px';
  }, [t.dark, t.primary, t.accent, t.fontScale, t.nivel, modo]);

  // Atajos globales: ⌘K / Ctrl+K (o "/") abren la paleta
  aEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setCmdkOpen(v => !v); }
      else if (e.key === '/' && !/^(input|textarea)$/i.test(e.target.tagName) && !e.target.isContentEditable) { e.preventDefault(); setCmdkOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Navegación
  const go = (r) => { setRoute(r); window.scrollTo(0, 0); };
  const openSkill = (id) => { setSkillId(id); setRoute('skill'); window.scrollTo(0, 0); };
  const abrirPractica = (id, from) => { setSkillId(id); setPracticaVolver(from || 'ruta'); setRoute('practica'); window.scrollTo(0, 0); };
  const navTo = (r) => { if (r === 'practica') abrirPractica(ESTUDIANTE.siguienteSkillId, 'inicio'); else go(r); };
  // Cambiar de nivel: transforma toda la app y vuelve a Inicio
  const cambiarNivel = (id) => { setTweak('nivel', id); setRoute('inicio'); window.scrollTo(0, 0); };

  // Comandos ⌘K
  const cmdkActions = aMemo(() => {
    const nav = [
      { id: 'inicio',   label: 'Inicio',           icon: IconHome,   run: () => navTo('inicio') },
      { id: 'ruta',     label: 'Mi ruta',          icon: IconRoute,  run: () => navTo('ruta') },
      { id: 'practica', label: 'Práctica del día', icon: IconTarget, run: () => navTo('practica') },
      { id: 'tutor',    label: 'Tutor IA',         icon: IconBrain,  run: () => navTo('tutor') },
      { id: 'progreso', label: 'Progreso',         icon: IconChart,  run: () => navTo('progreso') },
      { id: 'niveles',  label: 'Cambiar de nivel', icon: IconRoute,  run: () => go('niveles') },
      { id: 'diag',     label: 'Diagnóstico',      icon: IconPulse,  run: () => go('diagnostico') },
      { id: 'ayuda',    label: 'Ayuda',            icon: IconAyuda,  run: () => go('ayuda') },
      { id: 'cuenta',   label: 'Mi cuenta',        icon: IconCuenta, run: () => go('cuenta') },
    ].map(a => ({ ...a, group: 'Ir a' }));

    const temas = todosLosSkills().map(s => ({
      id: 'skill-' + s.id, group: 'Temas', label: s.nombre,
      sub: `${s.etapa} · ${s.estado.replace('-', ' ')}`, icon: s.esRezago ? IconRefresh : IconTarget,
      run: () => openSkill(s.id),
    }));

    const niveles = ETAPAS.map(e => ({
      id: 'lvl-' + e.id, group: 'Cambiar de nivel', label: `${e.emoji} ${e.nombre}`,
      sub: `modo ${e.modo === 'kids' ? 'niños' : 'estudiante'}`, icon: IconRoute, run: () => cambiarNivel(e.id),
    }));

    const acciones = [
      { id: 'a-tutor', group: 'Acciones', label: 'Preguntar al tutor IA', icon: IconBrain, run: () => go('tutor') },
      { id: 'a-tema',  group: 'Acciones', label: `Cambiar a modo ${t.dark ? 'claro' : 'oscuro'}`, icon: IconSettings, run: () => setTweak('dark', !t.dark) },
      { id: 'a-off',   group: 'Acciones', label: t.offline ? 'Volver a estar en línea' : 'Simular sin conexión', icon: t.offline ? IconWifi : IconWifiOff, run: () => setTweak('offline', !t.offline) },
    ];

    return [...nav, ...temas, ...niveles, ...acciones];
  }, [t.dark, t.offline, t.nivel]);

  const renderRoute = () => {
    switch (route) {
      case 'inicio':      return <VistaInicio irA={go} openSkill={openSkill} abrirPractica={abrirPractica} tw={t} />;
      case 'ruta':        return <VistaRuta openSkill={openSkill} irA={go} cambiarNivel={cambiarNivel} tw={t} />;
      case 'niveles':     return <VistaNiveles cambiarNivel={cambiarNivel} irA={go} />;
      case 'skill':       return <VistaSkill skillId={skillId} goBack={() => go('ruta')} abrirPractica={abrirPractica} openSkill={openSkill} />;
      case 'practica':    return <VistaPractica skillId={skillId} goBack={() => go(practicaVolver)} toast={toast} />;
      case 'diagnostico': return <VistaDiagnostico goBack={() => go('inicio')} irARuta={() => go('ruta')} />;
      case 'tutor':       return <VistaTutor tw={t} />;
      case 'progreso':    return <VistaProgreso irA={go} />;
      case 'ayuda':       return <VistaAyuda />;
      case 'cuenta':      return <VistaCuenta cambiarNivel={cambiarNivel} />;
      default:            return <VistaInicio irA={go} openSkill={openSkill} abrirPractica={abrirPractica} tw={t} />;
    }
  };

  const navRoute = route === 'skill' ? 'ruta' : route;

  return (
    <div className="app">
      {t.offline && (
        <div className="offline-banner">
          <IconWifiOff size={14} />
          Sin conexión · sigues practicando con lo descargado. Tu avance se sincroniza al volver la señal.
        </div>
      )}
      <Topbar route={navRoute} setRoute={navTo} onOpenSearch={() => setCmdkOpen(true)} online={!t.offline} modo={modo} />
      <main className="main" key={route + (skillId || '') + t.nivel}>
        {renderRoute()}
      </main>
      <BottomNav route={navRoute} setRoute={navTo} modo={modo} />
      {toastNode}
      {cmdkOpen && <CommandPalette actions={cmdkActions} onClose={() => setCmdkOpen(false)} />}

      <TweaksPanel title="Tweaks · Aula">
        <TweakSection label="Nivel · se adapta todo" />
        <TweakButton label="🧸 Preescolar (modo niños)" onClick={() => cambiarNivel('prees')} />
        <TweakButton label="✏️ Primaria (modo niños)" onClick={() => cambiarNivel('prim')} />
        <TweakButton label="🧭 Secundaria (modo estudiante)" onClick={() => cambiarNivel('sec')} />
        <TweakButton label="🎓 Preparatoria (modo estudiante)" onClick={() => cambiarNivel('prepa')} />

        <TweakSection label="Tema" />
        <TweakToggle label="Modo oscuro" value={t.dark} onChange={v => setTweak('dark', v)} />
        <TweakColor label="Color primario" value={t.primary} options={PRIMARY_OPTIONS} onChange={v => setTweak('primary', v)} />
        <TweakColor label="Color de acento" value={t.accent} options={ACCENT_OPTIONS} onChange={v => setTweak('accent', v)} />
        <TweakSlider label="Escala de texto" min={0.9} max={1.15} step={0.05} value={t.fontScale} unit="x" onChange={v => setTweak('fontScale', v)} />

        <TweakSection label="Conexión" />
        <TweakToggle label="Simular sin conexión" value={t.offline} onChange={v => setTweak('offline', v)} />

        <TweakSection label="Atajos · demo" />
        <TweakButton label="Buscar · paleta ⌘K" onClick={() => setCmdkOpen(true)} />
        <TweakButton label="Niveles (cómo cambia)" onClick={() => go('niveles')} />
        <TweakButton label="Practicar (nivel actual)" onClick={() => abrirPractica(ESTUDIANTE.siguienteSkillId, 'inicio')} />
        <TweakButton label="Tutor IA" onClick={() => go('tutor')} />
        <TweakButton label="Diagnóstico" onClick={() => go('diagnostico')} />
        <TweakButton label="Progreso" onClick={() => go('progreso')} />
      </TweaksPanel>
    </div>
  );
}

// Color helpers
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function lighten(hex, amount) { return mix(hex, '#ffffff', amount); }
function darken(hex, amount)  { return mix(hex, '#000000', amount); }
function mix(a, b, w) {
  const pa = parseHex(a), pb = parseHex(b);
  return `rgb(${Math.round(pa[0] * (1 - w) + pb[0] * w)}, ${Math.round(pa[1] * (1 - w) + pb[1] * w)}, ${Math.round(pa[2] * (1 - w) + pb[2] * w)})`;
}
function parseHex(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
