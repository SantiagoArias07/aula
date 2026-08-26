// components.jsx — UI compartida: Topbar, navegación, helpers de datos,
// componentes de matemáticas (Frac, Expr, Ring), paleta ⌘K.

const { useState, useEffect, useRef, useMemo } = React;

// ── Helpers de datos ──────────────────────────────────────────────────
function skillById(id) {
  for (const u of RUTA) { const s = u.skills.find(s => s.id === id); if (s) return s; }
  return null;
}
function unidadDeSkill(id) { return RUTA.find(u => u.skills.some(s => s.id === id)) || null; }
function todosLosSkills() { return RUTA.flatMap(u => u.skills); }
function problemasDe(id) { return PROBLEMAS[id] || []; }
function siguienteSkill() { return skillById(ESTUDIANTE.siguienteSkillId); }
function saludoHora() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

// ── Matemáticas ───────────────────────────────────────────────────────
// Fracción apilada
function Frac({ n, d }) {
  return <span className="frac"><span>{n}</span><span>{d}</span></span>;
}
// Renderiza texto matemático: convierte tokens "a/b" en fracciones y "x^n" en potencias.
function Expr({ children }) {
  const str = String(children);
  const parts = str.split(/(\s+)/);
  return (
    <span className="mathq">
      {parts.map((tok, i) => {
        const f = tok.match(/^(-?\d+)\/(\d+)([)\].,;:?!]*)$/);
        if (f) return <React.Fragment key={i}><Frac n={f[1]} d={f[2]} />{f[3]}</React.Fragment>;
        const p = tok.match(/^([A-Za-z0-9]+)\^(\d+)([)\].,;:?!]*)$/);
        if (p) return <React.Fragment key={i}>{p[1]}<sup>{p[2]}</sup>{p[3]}</React.Fragment>;
        return <React.Fragment key={i}>{tok}</React.Fragment>;
      })}
    </span>
  );
}

// Glyph de color (etapa / área)
function Glyph({ color, size = 44, radius = 12, children }) {
  return (
    <div className={color} style={{
      width: size, height: size, borderRadius: radius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink)', flexShrink: 0,
    }}>{children}</div>
  );
}

// Aro de progreso / dominio
function Ring({ value, size = 132, stroke = 11, tone = 'var(--primary)', track = 'var(--line)', children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.3,.7,.4,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// Barra de progreso
function Progress({ value, tone = 'var(--ink)', h = 6 }) {
  return (
    <div style={{ width: '100%', height: h, background: 'var(--line)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', background: tone, borderRadius: 999, transition: 'width .5s cubic-bezier(.3,.7,.4,1)' }} />
    </div>
  );
}

// Pastilla de estado de un skill
function EstadoPill({ estado }) {
  if (estado === 'dominado')    return <span className="pill pill-accent"><IconCheck size={12} />Dominado</span>;
  if (estado === 'en-progreso') return <span className="pill pill-primary"><IconPlay size={10} />En progreso</span>;
  if (estado === 'disponible')  return <span className="pill pill-ghost"><IconPlay size={10} />Disponible</span>;
  return <span className="pill pill-ghost"><IconLock size={11} />Bloqueado</span>;
}

// ── Topbar ────────────────────────────────────────────────────────────
const NAV = [
  { id: "inicio",   label: "Inicio",    Icon: IconHome },
  { id: "ruta",     label: "Mi ruta",   Icon: IconRoute },
  { id: "practica", label: "Práctica",  Icon: IconTarget },
  { id: "tutor",    label: "Tutor IA",  Icon: IconBrain },
  { id: "progreso", label: "Progreso",  Icon: IconChart },
];

function Topbar({ route, setRoute, onOpenSearch, online = true }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" onClick={() => setRoute("inicio")}>
          <span className="brand-dot" aria-hidden="true"></span>
          <span style={{ letterSpacing: "-0.01em" }}>Aula</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          {NAV.map(({ id, label }) => (
            <a key={id} className="nav-link" aria-current={route === id ? "page" : undefined} onClick={() => setRoute(id)}>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="search" onClick={onOpenSearch}>
          <IconSearch size={14} />
          <span>Buscar tema…</span>
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
        <a className="nav-link nav-ayuda" onClick={() => setRoute('diagnostico')} aria-current={route === 'diagnostico' ? 'page' : undefined}>Diagnóstico</a>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setAvatarOpen(v => !v)} style={{ border: 0, padding: 0, background: 'transparent', cursor: 'default' }} aria-label="Cuenta">
            <span className="avatar">{ESTUDIANTE.iniciales}</span>
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
        {NOTIFICACIONES.map((n, i) => (
          <div key={n.id} style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <Glyph color={n.color} size={36} radius={10}>
              {n.tipo === 'racha' ? <IconFlame size={16} /> : n.tipo === 'logro' ? <IconStar size={16} /> : n.tipo === 'tutor' ? <IconBrain size={16} /> : <IconTarget size={16} />}
            </Glyph>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n.titulo}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{n.detalle}</div>
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--faint)', flexShrink: 0 }}>{n.hace}</div>
          </div>
        ))}
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
        <span className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{ESTUDIANTE.iniciales}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }} className="truncate">{ESTUDIANTE.nombre} {ESTUDIANTE.apellido}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{ESTUDIANTE.nivelLabel}</div>
        </div>
      </div>
      <div style={{ padding: 6 }}>
        <PopRow label="Mi cuenta" icon={<IconCuenta size={16} />} onClick={() => { setRoute('cuenta'); onClose(); }} />
        <PopRow label="Diagnóstico" icon={<IconPulse size={16} />} onClick={() => { setRoute('diagnostico'); onClose(); }} />
        <PopRow label="Ayuda" icon={<IconAyuda size={16} />} onClick={() => { setRoute('ayuda'); onClose(); }} />
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

// ── Bottom nav (móvil) ────────────────────────────────────────────────
function BottomNav({ route, setRoute }) {
  return (
    <div className="bottom-nav">
      {NAV.map(({ id, label, Icon: Ic }) => (
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

// ── Bits comunes ──────────────────────────────────────────────────────
function SectionTitle({ eyebrow, title, subtitle, right }) {
  return (
    <div className="hero-wrap-sm" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 24 }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1 className="display" style={{ fontSize: 'clamp(34px, 4vw, 54px)', margin: 0 }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 15 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

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

// Toast
function useToast() {
  const [t, setT] = useState(null);
  const show = (msg) => { setT(msg); setTimeout(() => setT(null), 2600); };
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

// ── Command palette (⌘K) ──────────────────────────────────────────────
function CommandPalette({ actions, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef();
  const listRef = useRef();

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
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
                 placeholder="Busca un tema, el tutor, tu progreso…" aria-label="Buscar" />
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
                    <span className="cmdk-ic" style={a.tintClass ? undefined : undefined}>
                      {a.tintClass
                        ? <span className={a.tintClass} style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>{Ic ? <Ic size={16} /> : <Sparkle size={15} />}</span>
                        : (Ic ? <Ic size={17} /> : <Sparkle size={16} />)}
                    </span>
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
  skillById, unidadDeSkill, todosLosSkills, problemasDe, siguienteSkill, saludoHora,
  Frac, Expr, Glyph, Ring, Progress, EstadoPill,
  Topbar, BottomNav, SectionTitle, EmptyState, useToast, CommandPalette, NAV,
});
