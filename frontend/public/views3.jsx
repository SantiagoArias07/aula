// views3.jsx — Bandeja (chat-style), Historial, Ayuda, Cuenta

const { useState: v3State, useEffect: v3Effect, useRef: v3Ref } = React;

// ─────────────────────────────────────────────────────────────────────
// BANDEJA — mensajería estilo chat con docentes
// ─────────────────────────────────────────────────────────────────────

function VistaBandeja({ tw }) {
  const [selId, setSelId] = v3State(MENSAJES[0].id);
  const [drafts, setDrafts] = v3State({});
  const [threads, setThreads] = v3State(() => {
    // seed each thread with messages
    const t = {};
    MENSAJES.forEach(m => {
      t[m.id] = [
        { de: m.de, mio: false, hora: m.hace, txt: m.preview + ' Si tienes más dudas, escríbeme acá mismo y yo te respondo en cuanto pueda.' },
      ];
    });
    // Pre-populate first thread with conversation
    t[MENSAJES[0].id] = [
      { de: USER.nombre + ' (tú)', mio: true, hora: 'ayer 19:14', txt: 'Buenas noches profe, tengo una duda sobre el problema 14. No sé qué método aplicar.' },
      { de: MENSAJES[0].de, mio: false, hora: 'ayer 21:02', txt: 'Hola María, ¿podrías compartirme tu intento? Así te oriento sin darte directamente la solución.' },
      { de: USER.nombre + ' (tú)', mio: true, hora: 'hoy 11:30', txt: 'Sí profe, lo que hice fue tratar de aplicar sustitución pero me quedaba algo muy parecido a la integral original.' },
      { de: MENSAJES[0].de, mio: false, hora: 'hoy 11:42', txt: 'Exacto, por eso no va sustitución. Ahí debes usar integración por partes. Si quieres pasa al cubículo en mi hora de asesoría (vie 4 pm) y lo vemos juntos. ¡Vas bien!' },
    ];
    return t;
  });
  const [enviando, setEnviando] = v3State(false);
  const m = MENSAJES.find(x => x.id === selId);
  const c = m.curso ? courseOf(m.curso) : null;
  const lista = threads[selId] || [];

  const enviar = () => {
    const txt = (drafts[selId] || '').trim();
    if (!txt) return;
    setThreads(prev => ({ ...prev, [selId]: [...prev[selId], { de: USER.nombre + ' (tú)', mio: true, hora: 'ahora', txt }] }));
    setDrafts(prev => ({ ...prev, [selId]: '' }));
    setEnviando(true);
    setTimeout(() => {
      setThreads(prev => ({ ...prev, [selId]: [...prev[selId], { de: m.de, mio: false, hora: 'ahora', txt: '¡Recibido! Te respondo en un rato.' }] }));
      setEnviando(false);
    }, 1600);
  };

  return (
    <div className="view">
      <SectionTitle eyebrow="Bandeja" title={<>Habla con tus <span className="serif-italic">docentes</span>.</>}
        subtitle="Mensajes directos como un chat. Sin asuntos largos, sin esperar correos."
        right={<button className="btn btn-primary"><IconPlus size={14} />Nuevo mensaje</button>}
      />

      <div className="card card-flush" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: 'calc(100vh - 280px)', minHeight: 540, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="search" style={{ flex: 1, width: 'auto' }}>
              <IconSearch size={14} />
              <span>Buscar conversación…</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {MENSAJES.map(msg => {
              const co = msg.curso ? courseOf(msg.curso) : null;
              const sel = msg.id === selId;
              return (
                <a key={msg.id} onClick={() => setSelId(msg.id)} style={{
                  display: 'flex', gap: 12, padding: '14px 16px',
                  borderBottom: '1px solid var(--line)',
                  background: sel ? 'var(--surface-2)' : 'transparent',
                  borderLeft: sel ? '3px solid var(--ink)' : '3px solid transparent',
                  cursor: 'default'
                }}>
                  <span className="avatar" style={{ background: msg.noLeido ? 'linear-gradient(135deg, #c9bcff, #5b3fdb)' : 'linear-gradient(135deg, #d8d6cf, #a5a59a)', flexShrink: 0 }}>{msg.avatar}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ fontSize: 13.5, fontWeight: msg.noLeido ? 600 : 500 }} className="truncate">{msg.de}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', flexShrink: 0 }}>{msg.hace}</div>
                    </div>
                    {co && <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{co.clave}</div>}
                    <div style={{ fontSize: 13, color: msg.noLeido ? 'var(--ink)' : 'var(--muted)', marginTop: 4 }} className="truncate">{msg.asunto}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }} className="truncate">{msg.preview}</div>
                  </div>
                  {msg.noLeido && <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--primary)', marginTop: 8 }}></div>}
                </a>
              );
            })}
          </div>
        </div>

        {/* Thread */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="avatar">{m.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>{m.de}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c ? `${c.clave} · ${c.nombre}` : 'Administración'} · suele responder en 1 día</div>
            </div>
            <button className="icon-btn" aria-label="Más"><IconDot size={18} /></button>
          </div>
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg)' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{m.asunto}</span>
            </div>
            {lista.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: b.mio ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '72%' }}>
                  <div style={{
                    background: b.mio ? 'var(--ink)' : 'var(--surface)',
                    color: b.mio ? 'var(--bg)' : 'var(--ink)',
                    border: b.mio ? 'none' : '1px solid var(--line)',
                    padding: '12px 16px',
                    borderRadius: b.mio ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 14, lineHeight: 1.45
                  }}>{b.txt}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4, textAlign: b.mio ? 'right' : 'left' }}>{b.hora}</div>
                </div>
              </div>
            ))}
            {enviando && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 12 }}>
                <span className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{m.avatar}</span>
                <span>escribiendo</span>
                <span style={{ display: 'inline-flex', gap: 3 }}>
                  <span className="dot-typing" style={{ animationDelay: '0s' }}>·</span>
                  <span className="dot-typing" style={{ animationDelay: '.15s' }}>·</span>
                  <span className="dot-typing" style={{ animationDelay: '.3s' }}>·</span>
                </span>
                <style>{`.dot-typing { animation: blink 1s infinite; font-size: 20px; line-height: 1; } @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
              </div>
            )}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea value={drafts[selId] || ''} onChange={(e) => setDrafts(p => ({ ...p, [selId]: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              placeholder="Escribe un mensaje…"
              rows={1}
              style={{
                flex: 1, padding: '12px 14px', fontFamily: 'inherit', fontSize: 14,
                background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 12, color: 'var(--ink)',
                resize: 'none', minHeight: 44, maxHeight: 120
              }} />
            <button className="btn btn-primary" onClick={enviar} style={{ height: 44 }}>
              <IconSend size={14} />Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HISTORIAL
// ─────────────────────────────────────────────────────────────────────

const ICONOS_HIST = { book: IconBook, upload: IconUpload, chat: IconChat, star: IconStar, paper: IconPaper, check: IconCheck };

function VistaHistorial() {
  const grupos = [
    { titulo: 'Hoy · Sábado 16 de mayo', items: HISTORIAL_RECIENTE.slice(0, 6) },
    { titulo: 'Ayer · Viernes 15 de mayo', items: [
      { texto: 'Entregaste Línea del tiempo · Historia', hace: '18:20', icono: 'upload' },
      { texto: 'Leíste Material sobre la Revolución', hace: '16:05', icono: 'paper' },
      { texto: 'Carlos te mencionó en Equipo · Cálculo aplicado', hace: '14:30', icono: 'chat' },
    ]},
    { titulo: 'Jueves 14 de mayo', items: [
      { texto: 'Calificación recibida · Examen Bio (84/100)', hace: '17:00', icono: 'star' },
      { texto: 'Iniciaste sesión desde Android', hace: '07:30', icono: 'check' },
    ]},
  ];
  return (
    <div className="view">
      <SectionTitle eyebrow="Historial"
        title={<>Lo que has <span className="serif-italic">hecho</span>.</>}
        subtitle="Un registro de tu actividad. Útil para ti y para tu docente si necesita ver tu trayectoria."
        right={<button className="btn btn-secondary"><IconFilter size={14} />Filtrar</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
        <div style={{ position: 'relative', paddingLeft: 30 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 9, top: 14, bottom: 14, width: 1, background: 'var(--line)' }}></div>
          {grupos.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 14, marginLeft: -30 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, marginRight: 12, verticalAlign: 'middle' }}></span>
                {g.titulo}
              </div>
              {g.items.map((it, ii) => {
                const Ic = ICONOS_HIST[it.icono] || IconCheck;
                return (
                  <div key={ii} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0' }}>
                    <div style={{
                      position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)',
                      width: 22, height: 22, borderRadius: 999, background: 'var(--surface)',
                      border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--muted)'
                    }}><Ic size={12} /></div>
                    <div style={{ flex: 1, padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10 }}>
                      <div style={{ fontSize: 14 }}>{it.texto}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', minWidth: 80, textAlign: 'right' }}>{it.hace}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ position: 'sticky', top: 80, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="eyebrow">Esta semana</div>
            <div className="display" style={{ fontSize: 48, lineHeight: 1, margin: '8px 0' }}>23h</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Tiempo en Aula</div>
            <hr className="hr" style={{ margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: 'var(--muted)' }}>Tareas entregadas</span><span className="mono">4</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: 'var(--muted)' }}>Materiales abiertos</span><span className="mono">12</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: 'var(--muted)' }}>Mensajes</span><span className="mono">7</span>
            </div>
          </div>
          <div className="card">
            <div className="eyebrow">Sesiones</div>
            <div style={{ marginTop: 12, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Android · Galaxy A52</span><span style={{ color: 'var(--accent)' }}>activa</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Chrome · Windows</span><span style={{ color: 'var(--muted)' }}>hace 3 días</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AYUDA
// ─────────────────────────────────────────────────────────────────────

function VistaAyuda() {
  const [open, setOpen] = v3State(0);
  return (
    <div className="view">
      <SectionTitle eyebrow="Ayuda"
        title={<>¿En qué te <span className="serif-italic">echamos la mano</span>?</>}
        subtitle="Respuestas rápidas a lo que más se pregunta. Si no encuentras lo tuyo, escríbenos."
      />

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
        {[
          { ic: <IconPaper size={18} />, t: 'Empezar en Aula', d: 'Tu primer día: qué hacer y qué no' },
          { ic: <IconUpload size={18} />, t: 'Entregar tareas', d: 'Subir archivos, borradores y entregas tardías' },
          { ic: <IconChat size={18} />, t: 'Comunicarte', d: 'Mensajes, grupos y avisos del docente' },
        ].map((card, i) => (
          <a key={i} className="card" style={{ cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--line-2)'}
             onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line)'}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{card.ic}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22 }}>{card.t}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{card.d}</div>
            <div style={{ marginTop: 14, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-2)' }}>Ver guía <IconArrow size={12} /></div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Preguntas frecuentes</div>
          <div className="card card-flush">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <a onClick={() => setOpen(isOpen ? -1 : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'default', gap: 16 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22 }}>{f.q}</span>
                    <span style={{ color: 'var(--muted)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <IconChevD size={18} />
                    </span>
                  </a>
                  {isOpen && (
                    <div style={{ padding: '0 24px 22px', color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.55 }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="eyebrow">¿No encontraste lo tuyo?</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginTop: 6, lineHeight: 1.2 }}>Escríbenos directo.</div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 8 }}>Respondemos en menos de 4 horas en días hábiles.</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
              <IconChat size={14} />Abrir conversación con soporte
            </button>
          </div>
          <div className="card">
            <div className="eyebrow">Modo sin internet</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 10 }}>
              Si tu conexión está intermitente, descarga los materiales mientras tengas señal. Aula los guarda en tu equipo y los puedes leer offline.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
              <IconWifi size={16} />
              <span style={{ fontSize: 13 }}>Conectada</span>
              <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>todo al día</span>
            </div>
          </div>
          <div className="card">
            <div className="eyebrow">Comunidad</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 10 }}>
              Tutoriales y respuestas hechas por otros estudiantes y docentes.
            </p>
            <a className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Visitar comunidad <IconArrow size={14} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CUENTA
// ─────────────────────────────────────────────────────────────────────

function VistaCuenta() {
  const [tab, setTab] = v3State('perfil');
  return (
    <div className="view">
      <SectionTitle eyebrow="Cuenta"
        title={<><span className="serif-italic">Tu</span> cuenta.</>}
        subtitle="Información personal, preferencias y trayectoria académica."
      />

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--line)' }}>
        {[['perfil', 'Perfil'], ['acad', 'Trayectoria académica'], ['pref', 'Preferencias'], ['priv', 'Privacidad']].map(([id, label]) => (
          <a key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', fontSize: 14, fontWeight: 500,
            color: tab === id ? 'var(--ink)' : 'var(--muted)',
            borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent',
            marginBottom: -1
          }}>{label}</a>
        ))}
      </div>

      {tab === 'perfil' && (
        <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 24 }}>
          <div className="card card-lg" style={{ textAlign: 'center' }}>
            <div style={{
              width: 120, height: 120, borderRadius: 999, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #c9bcff, #5b3fdb)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42, fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-.02em'
            }}>{USER.iniciales}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.1 }}>{USER.nombre}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--muted)' }}>{USER.apellido}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>{USER.matricula}</div>
            <hr className="hr" style={{ margin: '20px 0' }} />
            <div className="eyebrow">{USER.semestre}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{USER.carrera}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{USER.institucion}</div>
            <button className="btn btn-secondary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>Cambiar foto</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-lg">
              <div className="eyebrow" style={{ marginBottom: 18 }}>Información personal</div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <KvField label="Nombre(s)" value={USER.nombre} />
                <KvField label="Apellidos" value={USER.apellido} />
                <KvField label="Correo institucional" value={USER.email} />
                <KvField label="Teléfono" value="+52 55 1234 5678" />
                <KvField label="Fecha de nacimiento" value="14 / mar / 2004" />
                <KvField label="CURP" value="HECM040314MDFRRR04" />
              </div>
            </div>
            <div className="card card-lg">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div className="eyebrow">Resumen académico</div>
                <a style={{ fontSize: 12.5, color: 'var(--muted)' }}>Solicitar constancia →</a>
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                <Stat2 label="Promedio" value={USER.promedio} />
                <Stat2 label="Créditos" value={`${USER.creditosCursados} / ${USER.creditosTotales}`} small />
                <Stat2 label="Avance" value={`${Math.round(USER.creditosCursados / USER.creditosTotales * 100)}%`} />
                <Stat2 label="Materias activas" value={CURSOS.length} />
              </div>
              <div style={{ marginTop: 20 }}>
                <Progress value={Math.round(USER.creditosCursados / USER.creditosTotales * 100)} tone="var(--accent)" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  <span>1er semestre</span>
                  <span>10º semestre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'acad' && (
        <div className="card card-flush" style={{ maxWidth: 920 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--line)' }}>
            <div className="eyebrow">Promedio histórico</div>
            <div className="display" style={{ fontSize: 64, marginTop: 4 }}>{USER.promedio}</div>
          </div>
          {[
            { sem: '4° semestre', cursos: 6, prom: 8.6 },
            { sem: '3er semestre', cursos: 7, prom: 8.5 },
            { sem: '2do semestre', cursos: 6, prom: 8.9 },
            { sem: '1er semestre', cursos: 6, prom: 8.8 },
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{s.sem}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s.cursos} materias cursadas</div>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28 }}>{s.prom}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'pref' && (
        <div className="card card-lg" style={{ maxWidth: 720 }}>
          <div className="eyebrow">Preferencias</div>
          <div className="display" style={{ fontSize: 28, marginTop: 6 }}>Cómo te tratamos</div>
          <hr className="hr" style={{ margin: '20px 0' }} />
          {[
            ['Idioma', 'Español (México)'],
            ['Zona horaria', 'Ciudad de México (GMT−6)'],
            ['Notificaciones por correo', 'Resumen diario'],
            ['Notificaciones en la app', 'Activadas'],
            ['Avísame cuando publican calificaciones', 'Sí, siempre'],
            ['Datos móviles', 'Cargar imágenes solo en Wi-Fi'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 'none' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>{v}</span>
                <a style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Cambiar</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'priv' && (
        <div className="card card-lg" style={{ maxWidth: 720 }}>
          <div className="eyebrow">Privacidad y seguridad</div>
          <div className="display" style={{ fontSize: 28, marginTop: 6 }}>Tu información, tus reglas</div>
          <hr className="hr" style={{ margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Contraseña', 'Actualizada hace 3 meses', 'Cambiar'],
              ['Verificación en dos pasos', 'No activada · te lo recomendamos', 'Activar'],
              ['Visibilidad de tu perfil', 'Solo compañeros de clase', 'Ajustar'],
              ['Datos guardados', 'Descarga una copia de toda tu información', 'Descargar'],
              ['Eliminar cuenta', 'Si te das de baja en la institución', 'Solicitar'],
            ].map(([k, v, action], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{v}</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>{action}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KvField({ label, value }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14.5, color: 'var(--ink)' }}>{value}</div>
    </div>
  );
}

function Stat2({ label, value, small }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: small ? 22 : 30, marginTop: 4 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { VistaBandeja, VistaHistorial, VistaAyuda, VistaCuenta });
