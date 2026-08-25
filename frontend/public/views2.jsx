// views2.jsx — Tarea (submission), Grupos, Calendario, Bandeja, Historial, Ayuda, Cuenta

const { useState: v2State, useEffect: v2Effect, useRef: v2Ref, useMemo: v2Memo } = React;

// ─────────────────────────────────────────────────────────────────────
// TAREA DETALLE — entrega de tarea + ver calificación
// ─────────────────────────────────────────────────────────────────────

function VistaTarea({ tareaId, goBack, onSubmit }) {
  const t = TAREAS.find(x => x.id === tareaId);
  if (!t) return null;
  const c = courseOf(t.curso);
  const [comentario, setComentario] = v2State('');
  const [archivos, setArchivos] = v2State([]);
  const [estado, setEstado] = v2State('pendiente'); // pendiente | entregado | calificado
  const [calif, setCalif] = v2State(null);

  const addArchivo = (nombre, tam) => setArchivos(prev => [...prev, { nombre, tam }]);
  const entregar = () => {
    if (archivos.length === 0 && !comentario.trim()) {
      onSubmit('Sube un archivo o escribe algo antes de entregar', true);
      return;
    }
    setEstado('entregado');
    onSubmit('Entrega registrada · Te avisamos cuando califiquen');
    setTimeout(() => {
      setEstado('calificado');
      setCalif({ nota: 92, total: t.puntos, retro: '¡Muy buena entrega! Solo cuida la presentación en el problema 5: el resultado es correcto pero el procedimiento podría justificarse mejor. Buen trabajo, sigue así.' });
    }, 3200);
  };

  return (
    <div className="view">
      <a className="btn btn-ghost" onClick={goBack} style={{ marginBottom: 16, padding: '6px 10px', marginLeft: -10 }}><IconArrowL size={14} />Volver al curso</a>

      <div className="grid stack-sm" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* Left: Submission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <CourseGlyph curso={c} size={36} />
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{c.clave} · {t.tipo.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{c.nombre}</div>
            </div>
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', margin: 0, lineHeight: 1.05 }}>{t.titulo}</h1>

          <div className="card card-lg" style={{ marginTop: 28 }}>
            <div className="eyebrow">Instrucciones</div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.5, marginTop: 12, color: 'var(--ink-2)' }}>
              Resuelve los <strong style={{ color: 'var(--ink)' }}>8 problemas</strong> del cuadernillo aplicando el método de integración por partes. Recuerda elegir <em>u</em> y <em>dv</em> de manera que la integral resultante sea más simple. Justifica cada paso. Entrega un PDF legible (puede ser escrito a mano y escaneado).
            </p>
            <hr className="hr" style={{ margin: '20px 0' }} />
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <KV k="Vence" v={t.vence} />
              <KV k="Puntos" v={`${t.puntos} pts`} />
              <KV k="Intentos" v="Ilimitados" />
              <KV k="Tipos permitidos" v="PDF, JPG, PNG, DOCX" />
              <KV k="Tamaño máx" v="20 MB por archivo" />
              <KV k="Entregas tardías" v="No se aceptan" />
            </div>
          </div>

          {/* Submission area */}
          {estado === 'pendiente' && (
            <div className="card card-lg" style={{ marginTop: 18 }}>
              <div className="eyebrow">Tu entrega</div>
              <div className="display" style={{ fontSize: 24, marginTop: 6, marginBottom: 16 }}>Sube tu trabajo</div>
              <div style={{
                border: '2px dashed var(--line-2)', borderRadius: 14, padding: 28, textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'default',
                transition: 'background .15s'
              }}
                onClick={() => addArchivo(`problemario_${USER.matricula.slice(-4)}.pdf`, '2.3 MB')}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
                  <IconUpload size={20} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Arrastra archivos aquí o haz clic</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>PDF, JPG, PNG o DOCX · máx. 20 MB</div>
              </div>
              {archivos.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {archivos.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 10 }}>
                      <IconFile size={18} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.nombre}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{a.tam}</div>
                      </div>
                      <a onClick={(e) => { e.stopPropagation(); setArchivos(prev => prev.filter((_, j) => j !== i)); }} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 8px' }}>Quitar</a>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 18 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Comentario opcional</div>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Algo que quieras decirle a tu docente sobre esta entrega?"
                  style={{
                    width: '100%', minHeight: 90, padding: 14, fontFamily: 'inherit', fontSize: 14,
                    background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--ink)',
                    resize: 'vertical'
                  }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Guardaremos un borrador automáticamente.</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary">Guardar borrador</button>
                  <button className="btn btn-primary" onClick={entregar}>Entregar definitivo</button>
                </div>
              </div>
            </div>
          )}

          {estado === 'entregado' && (
            <div className="card card-lg" style={{ marginTop: 18, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ width: 60, height: 60, margin: '0 auto 16px', borderRadius: 16, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheck size={28} />
              </div>
              <div className="display" style={{ fontSize: 32 }}>¡Listo!</div>
              <div style={{ fontSize: 15, color: 'var(--muted)', marginTop: 6, maxWidth: 420, marginInline: 'auto' }}>
                Tu entrega se registró el {HOY.toLowerCase()} a las {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}. Te avisamos en cuanto tu docente la califique.
              </div>
              <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 12.5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--warn)', animation: 'pulse 1.6s ease infinite' }}></div>
                Esperando calificación
              </div>
            </div>
          )}

          {estado === 'calificado' && calif && (
            <div className="card card-lg" style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div className="eyebrow">Tu calificación</div>
                  <div className="display" style={{ fontSize: 80, lineHeight: 1, marginTop: 8 }}>{calif.nota}<span style={{ fontSize: 30, color: 'var(--muted)' }}>/{calif.total}</span></div>
                  <span className="pill pill-accent" style={{ marginTop: 12 }}>
                    <IconCheck size={12} />{((calif.nota/calif.total)*100).toFixed(0)}% · Excelente
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="eyebrow">Calificado por</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.docente}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>justo ahora</div>
                    </div>
                    <span className="avatar" style={{ background: 'linear-gradient(135deg, #e9d8b3, #c9a55e)' }}>RM</span>
                  </div>
                </div>
              </div>
              <hr className="hr" />
              <div className="eyebrow" style={{ marginTop: 20 }}>Retroalimentación</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.55, marginTop: 10, color: 'var(--ink-2)' }}>
                &ldquo;{calif.retro}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right: Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="eyebrow">Estado</div>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-serif)', fontSize: 24 }}>
              {estado === 'pendiente' && 'Sin entregar'}
              {estado === 'entregado' && 'En revisión'}
              {estado === 'calificado' && 'Calificada'}
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Step label="Recibida" done={estado !== 'pendiente'} />
              <Step label="En revisión" done={estado === 'calificado'} active={estado === 'entregado'} />
              <Step label="Calificada" done={estado === 'calificado'} />
            </div>
          </div>
          <div className="card">
            <div className="eyebrow">Comunícate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <span className="avatar" style={{ background: 'linear-gradient(135deg, #e9d8b3, #c9a55e)' }}>RM</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{c.docente}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Suele responder en 1 día</div>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
              <IconChat size={14} />Enviar mensaje al docente
            </button>
          </div>
          <div className="card">
            <div className="eyebrow">Consejos rápidos</div>
            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', fontSize: 13.5, color: 'var(--ink-2)' }}>
              {['Numera cada problema.', 'Usa una hoja por problema.', 'Escanea con buena luz.', 'Sube en un solo PDF si puedes.'].map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
                  <span style={{ color: 'var(--accent)' }}><IconCheck size={14} /></span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ label, done, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 999,
        border: done || active ? `1.5px solid ${active ? 'var(--warn)' : 'var(--accent)'}` : '1.5px solid var(--line-2)',
        background: done ? 'var(--accent)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: active ? 'pulse 1.8s ease infinite' : 'none'
      }}>
        {done && <IconCheck size={10} style={{ color: 'white' }} />}
      </div>
      <span style={{ fontSize: 13.5, color: done || active ? 'var(--ink)' : 'var(--muted)', fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div>
      <div className="eyebrow">{k}</div>
      <div style={{ fontSize: 14, marginTop: 4 }}>{v}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// GRUPOS
// ─────────────────────────────────────────────────────────────────────

function VistaGrupos({ openGrupo, tw }) {
  return (
    <div className="view">
      <SectionTitle eyebrow="Grupos" title={<>Trabaja con tu <span className="serif-italic">gente</span>.</>}
        subtitle="Espacios para colaborar con compañeros y tu docente — discusiones, archivos, tareas en equipo."
        right={<button className="btn btn-primary"><IconPlus size={14} />Crear grupo</button>}
      />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {GRUPOS.map(g => {
          const c = courseOf(g.curso);
          return (
            <a key={g.id} className="card" onClick={() => openGrupo(g.id)} style={{ cursor: 'default' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <CourseGlyph curso={c} size={36} />
                {g.noLeidos > 0 && <span className="pill pill-primary mono" style={{ fontSize: 10 }}>{g.noLeidos} nuevos</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.2 }}>{g.nombre}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{c.nombre}</div>
              <hr className="hr" style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', marginLeft: 4 }}>
                  {[...Array(Math.min(4, g.miembros))].map((_, i) => (
                    <div key={i} style={{
                      width: 26, height: 26, borderRadius: 999, marginLeft: -6,
                      background: ['#c9bcff', '#a99aff', '#7d6cff', '#5b3fdb'][i],
                      border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 9, fontWeight: 600
                    }}>{['CM','DR','EL','SV'][i]}</div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{g.miembros} integrantes</span>
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10 }}>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{g.ultimo}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{g.hace}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CALENDARIO
// ─────────────────────────────────────────────────────────────────────

function VistaCalendario({ tw, openCurso }) {
  const [vista, setVista] = v2State(tw.calVariant || 'mes');
  v2Effect(() => { if (tw.calVariant) setVista(tw.calVariant); }, [tw.calVariant]);
  const [diaSel, setDiaSel] = v2State(16);

  // Build month grid: May 2026 starts on Friday (day 5)
  const daysInMonth = 31;
  const firstDayOffset = 5; // 0=Sun..6=Sat — for "Vie" = 5
  const weeks = [];
  let week = Array(firstDayOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }

  return (
    <div className="view">
      <SectionTitle eyebrow="Calendario · Mayo 2026"
        title={<>Tu mes en <span className="serif-italic">una hoja</span>.</>}
        subtitle="Todas las entregas, exámenes y prácticas en un solo lugar."
        right={<div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', padding: 3, borderRadius: 10 }}>
          {['mes', 'semana', 'agenda'].map(v => (
            <a key={v} onClick={() => setVista(v)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: vista === v ? 'var(--surface)' : 'transparent',
              color: vista === v ? 'var(--ink)' : 'var(--muted)',
              boxShadow: vista === v ? 'var(--shadow)' : 'none',
              textTransform: 'capitalize'
            }}>{v}</a>
          ))}
        </div>}
      />

      {vista === 'mes' && (
        <div className="grid stack-sm" style={{ gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div className="card card-flush">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="eyebrow" style={{ padding: '14px 16px', fontSize: 10.5, textAlign: 'left' }}>{d}</div>
              ))}
            </div>
            {weeks.map((wk, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < weeks.length - 1 ? '1px solid var(--line)' : 'none' }}>
                {wk.map((d, di) => {
                  const events = d ? (CALENDARIO_MES[d] || []) : [];
                  const isSel = d === diaSel;
                  const isToday = d === 16;
                  return (
                    <a key={di} onClick={() => d && setDiaSel(d)} style={{
                      borderRight: di < 6 ? '1px solid var(--line)' : 'none',
                      minHeight: 110, padding: 10, display: 'flex', flexDirection: 'column', gap: 6, cursor: d ? 'default' : 'auto',
                      background: isSel && d ? 'var(--surface-2)' : 'transparent'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontSize: 13, fontWeight: isToday ? 600 : 400,
                          width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 999,
                          background: isToday ? 'var(--ink)' : 'transparent',
                          color: isToday ? 'var(--bg)' : (d ? 'var(--ink-2)' : 'var(--faint)')
                        }}>{d || ''}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {events.slice(0, 3).map((ev, ei) => {
                          const c = courseOf(ev.curso);
                          return (
                            <div key={ei} className={c.color} style={{
                              padding: '3px 7px', borderRadius: 5, fontSize: 11,
                              color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>{ev.tit}</div>
                          );
                        })}
                      </div>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80, height: 'fit-content' }}>
            <div className="card">
              <div className="eyebrow">{diaSel === 16 ? 'Hoy · Sábado' : `Día ${diaSel}`} de mayo</div>
              <div className="display" style={{ fontSize: 56, lineHeight: 1, margin: '8px 0 16px' }}>{String(diaSel).padStart(2, '0')}</div>
              {(CALENDARIO_MES[diaSel] || []).length === 0 ? (
                <div style={{ fontSize: 14, color: 'var(--muted)' }}>Sin entregas. Día tranquilo.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(CALENDARIO_MES[diaSel] || []).map((ev, i) => {
                    const c = courseOf(ev.curso);
                    return (
                      <a key={i} onClick={() => openCurso(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, background: 'var(--surface-2)' }}>
                        <CourseGlyph curso={c} size={32} radius={8} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 500 }} className="truncate">{ev.tit}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{c.nombre}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="card">
              <div className="eyebrow">Próximas 3</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
                {TAREAS.slice(0, 3).map(t => {
                  const c = courseOf(t.curso);
                  return (
                    <div key={t.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)', alignItems: 'center' }}>
                      <div className={c.color} style={{ width: 4, height: 28, borderRadius: 2 }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{t.titulo}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{c.clave} · {t.vence}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {vista === 'semana' && <VistaSemana diaSel={diaSel} />}
      {vista === 'agenda' && <VistaAgenda openCurso={openCurso} />}
    </div>
  );
}

function VistaSemana({ diaSel }) {
  // Show 18-24 may
  const dias = [['Lun', 18], ['Mar', 19], ['Mié', 20], ['Jue', 21], ['Vie', 22], ['Sáb', 23], ['Dom', 24]];
  const horas = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  // Schedule blocks
  const eventos = [
    { dia: 1, hora: 10, dur: 1.5, curso: 'mat', tit: 'Cálculo Integral' },
    { dia: 1, hora: 12, dur: 1.5, curso: 'let', tit: 'Lectura y Redacción' },
    { dia: 2, hora: 9,  dur: 1.5, curso: 'quim', tit: 'Examen Hidrocarburos', urg: true },
    { dia: 2, hora: 14, dur: 1.5, curso: 'his', tit: 'Historia de México' },
    { dia: 3, hora: 8,  dur: 1.5, curso: 'fis', tit: 'Física Moderna' },
    { dia: 3, hora: 10, dur: 1.5, curso: 'mat', tit: 'Cálculo Integral' },
    { dia: 0, hora: 14, dur: 1, curso: 'let', tit: 'Ensayo 2da entrega', urg: true },
    { dia: 4, hora: 13, dur: 1, curso: 'fis', tit: 'Tarea 7 entrega' },
    { dia: 5, hora: 10, dur: 1, curso: 'mat', tit: 'Quiz' },
  ];

  return (
    <div className="card card-flush" style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minWidth: 900 }}>
        <div></div>
        {dias.map(([d, n]) => (
          <div key={d} style={{ padding: '14px 12px', borderLeft: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{d}</div>
            <div className="display" style={{ fontSize: 24, marginTop: 2 }}>{n}</div>
          </div>
        ))}
        {horas.map((h, hi) => (
          <React.Fragment key={h}>
            <div style={{ borderTop: hi ? '1px solid var(--line)' : 'none', padding: '8px 12px', textAlign: 'right' }} className="mono">
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{h}:00</span>
            </div>
            {dias.map(([d, dn], di) => {
              const ev = eventos.find(e => e.dia === di && e.hora === h);
              return (
                <div key={di} style={{
                  borderTop: hi ? '1px solid var(--line)' : 'none',
                  borderLeft: '1px solid var(--line)',
                  height: 72, padding: 4, position: 'relative'
                }}>
                  {ev && (() => {
                    const c = courseOf(ev.curso);
                    return (
                      <div className={c.color} style={{
                        padding: '8px 10px', borderRadius: 8, height: `calc(${ev.dur * 72}px - 8px)`,
                        color: 'var(--ink)', position: 'absolute', left: 4, right: 4, top: 4,
                        border: ev.urg ? '2px solid var(--danger)' : 'none', overflow: 'hidden'
                      }}>
                        <div className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{c.clave}</div>
                        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2, lineHeight: 1.2 }}>{ev.tit}</div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function VistaAgenda({ openCurso }) {
  const grupos = {};
  TAREAS.forEach(t => { (grupos[t.vence] ||= []).push(t); });
  return (
    <div className="card card-flush" style={{ maxWidth: 760 }}>
      {Object.entries(grupos).map(([fecha, arr], i) => (
        <div key={fecha}>
          <div style={{ padding: '18px 24px', background: 'var(--surface-2)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
            <div className="eyebrow">{fecha}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{arr.length} actividad{arr.length > 1 ? 'es' : ''}</div>
          </div>
          {arr.map(t => {
            const c = courseOf(t.curso);
            return (
              <a key={t.id} onClick={() => openCurso(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid var(--line)', cursor: 'default' }}>
                <CourseGlyph curso={c} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{t.titulo}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{c.nombre} · {t.tipo}</div>
                </div>
                <UrgenciaPill urgencia={t.urgencia} />
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { VistaTarea, VistaGrupos, VistaCalendario });
