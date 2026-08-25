// components.jsx — shared UI: Topbar, Card, Pill, CourseTile, Avatar, etc.

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────
// Topbar
// ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "tablero",    label: "Tablero",    Icon: IconTablero },
  { id: "cursos",     label: "Cursos",     Icon: IconCursos },
  { id: "grupos",     label: "Grupos",     Icon: IconGrupos },
  { id: "calendario", label: "Calendario", Icon: IconCalendario },
  { id: "bandeja",    label: "Bandeja",    Icon: IconBandeja, badge: 2 },
  { id: "historial",  label: "Historial",  Icon: IconHistorial },
];

function Topbar({ route, setRoute, onOpenSearch, online = true }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" onClick={() => setRoute("tablero")}>
          <span className="brand-dot" aria-hidden="true"></span>
          <span style={{ letterSpacing: "-0.01em" }}>Aula</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          {NAV.map(({ id, label, Icon: Ic, badge }) => (
            <a key={id} className="nav-link" aria-current={route === id ? "page" : undefined} onClick={() => setRoute(id)}>
              <span>{label}</span>
              {badge ? <span className="badge">{badge}</span> : null}
            </a>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="search" onClick={onOpenSearch}>
          <IconSearch size={14} />
          <span>Buscar…</span>
          <span className="kbd">⌘K</span>
        </div>
        <button className="icon-btn show-sm" onClick={onOpenSearch} aria-label="Buscar">
          <IconSearch size={18} />
        </button>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setNotifOpen(v => !v)} aria-label="Notificaciones">
            <IconBell size={18} />
            <span className="dot" />
          </button>
          {notifOpen && <NotifPopover onClose={() => setNotifOpen(false)} />}
        </div>
        <a className="nav-link nav-ayuda" onClick={() => setRoute('ayuda')} aria-current={route === 'ayuda' ? 'page' : undefined}>Ayuda</a>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setAvatarOpen(v => !v)} style={{ border: 0, padding: 0, background: 'transparent', cursor: 'default' }} aria-label="Cuenta">
            <span className="avatar">{USER.iniciales}</span>
          </button>
          {avatarOpen && <AvatarPopover onClose={() => setAvatarOpen(false)} setRoute={setRoute} online={online} />}
        </div>
      </div>
    </header>
  );
}

function NotifPopover({ onClose }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 360, zIndex: 50,
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--shadow)', overflow: 'hidden'
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontWeight: 600 }}>Notificaciones</strong>
        <span className="eyebrow">{NOTIFICACIONES.length} nuevas</span>
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {NOTIFICACIONES.map((n, i) => {
          const curso = n.curso ? CURSOS.find(c => c.id === n.curso) : null;
          return (
            <div key={n.id} style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', borderTop: i ? '1px solid var(--line)' : 'none' }}>
              <div className={curso?.color || 'placeholder'} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink)' }}>
                {curso ? curso.clave.split('-')[0] : 'AV'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.titulo}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{n.detalle}</div>
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>{n.hace}</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 10, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <a style={{ fontSize: 13, color: 'var(--muted)' }}>Ver todas →</a>
      </div>
    </div>
  );
}

function AvatarPopover({ onClose, setRoute, online }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 280, zIndex: 50,
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--shadow)', overflow: 'hidden'
    }}>
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{USER.iniciales}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }} className="truncate">{USER.nombre} {USER.apellido}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{USER.matricula}</div>
        </div>
      </div>
      <div style={{ padding: 6 }}>
        <PopRow label="Mi cuenta" icon={<IconCuenta size={16} />} onClick={() => { setRoute('cuenta'); onClose(); }} />
        <PopRow label="Configuración" icon={<IconSettings size={16} />} />
        <PopRow label={online ? 'En línea' : 'Sin conexión'} icon={online ? <IconWifi size={16} /> : <IconWifiOff size={16} />} right={<span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{online ? 'sync' : 'cola'}</span>} />
      </div>
      <div style={{ borderTop: '1px solid var(--line)', padding: 6 }}>
        <PopRow label="Cerrar sesión" icon={<IconLogout size={16} />} />
      </div>
    </div>
  );
}

function PopRow({ icon, label, right, onClick }) {
  return (
    <a onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, fontSize: 13.5, color: 'var(--ink-2)' }}
       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
       onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {right}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Bottom nav (mobile)
// ─────────────────────────────────────────────────────────────────────

function BottomNav({ route, setRoute }) {
  const items = NAV.slice(0, 5);
  return (
    <div className="bottom-nav">
      {items.map(({ id, label, Icon: Ic }) => (
        <a key={id} onClick={() => setRoute(id)} aria-current={route === id ? 'page' : undefined}>
          <Ic size={20} />
          <span>{label}</span>
        </a>
      ))}
      <style>{`
        .bottom-nav { display: none; }
        @media (max-width: 880px) {
          .bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: color-mix(in oklab, var(--bg) 92%, transparent); backdrop-filter: blur(14px); border-top: 1px solid var(--line); z-index: 40; padding: 8px 4px calc(8px + env(safe-area-inset-bottom)); }
          .bottom-nav a { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 4px; color: var(--muted); font-size: 10px; font-weight: 500; }
          .bottom-nav a[aria-current="page"] { color: var(--ink); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Common bits
// ─────────────────────────────────────────────────────────────────────

function CourseGlyph({ curso, size = 40, radius = 10 }) {
  if (!curso) return null;
  return (
    <div className={curso.color}
      style={{
        width: size, height: size, borderRadius: radius,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: Math.max(9, size * 0.22), letterSpacing: '.04em',
        color: 'var(--ink)', flexShrink: 0
      }}>
      {curso.clave.split('-')[0]}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 24 }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1 className="display" style={{ fontSize: 'clamp(36px, 4vw, 56px)', margin: 0 }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 15 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// Carga académica — donut chart
function LoadGauge({ pendientes, total = 10, label = "Carga de la semana" }) {
  const pct = Math.min(1, pendientes / total);
  // tone by load
  let tone = 'var(--accent)';
  let toneSoft = 'var(--accent-soft)';
  let texto = 'Vas relajada';
  if (pct >= 0.4) { tone = 'var(--warn)'; toneSoft = 'var(--warn-soft)'; texto = 'Semana ocupada'; }
  if (pct >= 0.7) { tone = 'var(--danger)'; toneSoft = 'var(--danger-soft)'; texto = 'Está pesada'; }
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 65 65)"
                style={{ transition: 'stroke-dashoffset .8s ease' }} />
        <text x="65" y="60" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="34" fill="var(--ink)">{pendientes}</text>
        <text x="65" y="80" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted)" letterSpacing="0.1em">PENDIENTES</text>
      </svg>
      <div>
        <div className="eyebrow">{label}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginTop: 4 }}>{texto}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{pendientes} de {total} actividades de la semana</div>
        <span className="pill" style={{ marginTop: 10, background: toneSoft, color: tone, fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: tone }}></span>
          {pct < 0.4 ? 'Carga baja' : pct < 0.7 ? 'Carga media' : 'Carga alta'}
        </span>
      </div>
    </div>
  );
}

// Inline progress bar
function Progress({ value, tone = 'var(--ink)' }) {
  return (
    <div style={{ width: '100%', height: 4, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: tone, transition: 'width .4s ease' }} />
    </div>
  );
}

// Empty state
function EmptyState({ title, body, icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
      <div style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: 14, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
        {icon || <Sparkle size={24} />}
      </div>
      <div className="display" style={{ fontSize: 28, color: 'var(--ink)' }}>{title}</div>
      <div style={{ fontSize: 14, marginTop: 8, maxWidth: 380, marginInline: 'auto' }}>{body}</div>
    </div>
  );
}

// Get course by id
function courseOf(id) { return CURSOS.find(c => c.id === id); }

// Urgencia pill
function UrgenciaPill({ urgencia }) {
  if (urgencia === 'hoy')    return <span className="pill pill-danger"><IconWarn size={12} />Vence hoy</span>;
  if (urgencia === 'manana') return <span className="pill pill-warn"><IconClock size={12} />Mañana</span>;
  if (urgencia === 'semana') return <span className="pill pill-ghost"><IconClock size={12} />Esta semana</span>;
  return null;
}

// Toast helper
function useToast() {
  const [t, setT] = useState(null);
  const show = (msg) => {
    setT(msg);
    setTimeout(() => setT(null), 2600);
  };
  const node = t && (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 99,
      background: 'var(--ink)', color: 'var(--bg)', padding: '12px 18px',
      borderRadius: 12, fontSize: 13, fontWeight: 500, boxShadow: 'var(--shadow)',
      display: 'flex', alignItems: 'center', gap: 10, animation: 'fade .2s ease'
    }}>
      <IconCheck size={14} />{t}
    </div>
  );
  return [show, node];
}

// ─────────────────────────────────────────────────────────────────────
// Command palette (⌘K) — busca cursos, tareas y navega a cualquier vista
// ─────────────────────────────────────────────────────────────────────

function CommandPalette({ actions, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef();
  const listRef = useRef();

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    // match por palabras: todas las palabras deben aparecer en el texto del comando
    const terms = s.split(/\s+/);
    return actions.filter(a => {
      const hay = (a.label + ' ' + (a.sub || '') + ' ' + a.group).toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }, [q, actions]);

  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('[data-active="1"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // Agrupa preservando el orden de aparición y guarda el índice plano para el teclado
  const groups = useMemo(() => {
    const order = [], map = {};
    filtered.forEach((a, i) => {
      if (!map[a.group]) { map[a.group] = []; order.push(a.group); }
      map[a.group].push({ ...a, _i: i });
    });
    return order.map(g => [g, map[g]]);
  }, [filtered]);

  const run = (a) => { onClose(); setTimeout(() => a.run(), 0); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) run(filtered[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  return (
    <div className="cmdk-backdrop" onClick={onClose}>
      <div className="cmdk" role="dialog" aria-label="Buscar en Aula" onClick={e => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="cmdk-top">
          <IconSearch size={18} />
          <input ref={inputRef} className="cmdk-input" value={q} onChange={e => setQ(e.target.value)}
                 placeholder="Buscar cursos, tareas, o ir a…" aria-label="Buscar" />
          <span className="cmdk-kbd">esc</span>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmdk-empty">Nada coincide con &ldquo;{q}&rdquo;.</div>
          ) : groups.map(([g, items]) => (
            <div key={g}>
              <div className="cmdk-group">{g}</div>
              {items.map(a => {
                const Ic = a.icon;
                return (
                  <div key={a.id} className="cmdk-item" data-active={a._i === active ? '1' : '0'}
                       onMouseMove={() => setActive(a._i)} onClick={() => run(a)}>
                    {a.curso
                      ? <CourseGlyph curso={a.curso} size={34} radius={9} />
                      : <span className="cmdk-ic">{Ic ? <Ic size={17} /> : <Sparkle size={16} />}</span>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="truncate" style={{ fontSize: 14, fontWeight: 500 }}>{a.label}</div>
                      {a.sub && <div className="truncate" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{a.sub}</div>}
                    </div>
                    <IconArrow size={14} style={{ color: 'var(--faint)' }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><span className="cmdk-kbd">↑</span> <span className="cmdk-kbd">↓</span> navegar</span>
          <span><span className="cmdk-kbd">↵</span> abrir</span>
          <span><span className="cmdk-kbd">esc</span> cerrar</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Topbar, BottomNav, CourseGlyph, SectionTitle, LoadGauge, Progress,
  EmptyState, courseOf, UrgenciaPill, useToast, NAV, CommandPalette,
});
