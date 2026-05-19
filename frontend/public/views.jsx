// views.jsx — page views (Tablero, Cursos, Curso detalle, Grupos, Calendario, Bandeja, Historial, Ayuda, Cuenta)

const { useState: vUseState, useMemo: vUseMemo, useEffect: vUseEffect, useRef: vUseRef } = React;

// ─────────────────────────────────────────────────────────────────────
// TABLERO
// ─────────────────────────────────────────────────────────────────────

function VistaTablero({ setRoute, openCurso, tw }) {
  const pendientes = TAREAS.filter(t => t.urgencia !== 'pasado').length;
  const urgentes = TAREAS.filter(t => t.urgencia === 'hoy' || t.urgencia === 'manana');
  const restantes = TAREAS.filter(t => t.urgencia === 'semana');

  return (
    <div className="view">
      {/* Hero greeting */}
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Tablero · {HOY}</div>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 5.5vw, 72px)', margin: 0, maxWidth: 980 }}>
          {HORA_SALUDO}, <span className="serif-italic">{USER.nombre.split(' ')[0]}.</span>
          <br />
          {pendientes === 0 ? (
            <>Hoy se ve <span style={{ color: 'var(--accent)' }}>tranquilo</span>.</>
          ) : urgentes.length === 0 ? (
            <>Vas <span style={{ color: 'var(--accent)' }}>al corriente</span> con la semana.</>
          ) : urgentes.some(t => t.urgencia === 'hoy') ? (
            <>Tienes <span style={{ color: 'var(--danger)' }}>{urgentes.filter(t=>t.urgencia==='hoy').length}</span> {urgentes.filter(t=>t.urgencia==='hoy').length === 1 ? 'entrega' : 'entregas'} para hoy.</>
          ) : (
            <>Pinta <span style={{ color: 'var(--warn)' }}>movida</span> tu semana.</>
          )}
        </h1>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Esta semana panel */}
        <div className="card card-lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <div className="eyebrow">Esta semana</div>
              <div className="display" style={{ fontSize: 30, marginTop: 6 }}>Lo que sigue</div>
            </div>
            <a className="btn btn-ghost" onClick={() => setRoute('calendario')} style={{ padding: '6px 10px' }}>Ver calendario <IconArrow size={14} /></a>
          </div>
          <LoadGauge pendientes={pendientes} total={10} />
          <hr className="hr" style={{ margin: '24px 0' }} />
          <div className="eyebrow" style={{ marginBottom: 14 }}>Próximas entregas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[...urgentes, ...restantes].slice(0, 5).map(t => {
              const c = courseOf(t.curso);
              return (
                <a key={t.id} onClick={() => openCurso(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 4px', borderTop: '1px solid var(--line)', cursor: 'default' }}
                   onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <CourseGlyph curso={c} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500 }} className="truncate">{t.titulo}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{c.nombre} · {t.tipo}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <UrgenciaPill urgencia={t.urgencia} />
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{t.vence}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Hoy timeline */}
        <div className="card card-lg" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">Hoy · clases</div>
          <div className="display" style={{ fontSize: 30, margin: '6px 0 22px' }}>Tu día</div>
          <div style={{ position: 'relative', flex: 1 }}>
            {HORARIO_HOY.map((h, i) => {
              const c = courseOf(h.curso);
              const isNow = h.estado === 'ahora';
              const isPast = h.estado === 'asistido';
              return (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 'none', opacity: isPast ? 0.55 : 1 }}>
                  <div className="mono" style={{ width: 46, color: 'var(--muted)', fontSize: 12, paddingTop: 2 }}>{h.hora}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: isNow ? 'var(--primary)' : isPast ? 'var(--line-2)' : 'var(--ink)', boxShadow: isNow ? '0 0 0 4px var(--primary-soft)' : 'none', animation: isNow ? 'pulse 2s ease infinite' : 'none' }}></div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{h.titulo}</div>
                      {isNow && <span className="pill pill-primary" style={{ fontSize: 10 }}>Ahora</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 16, marginTop: 2 }}>{h.sala}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`@keyframes pulse { 0%,100% { box-shadow: 0 0 0 4px var(--primary-soft); } 50% { box-shadow: 0 0 0 8px transparent; } }`}</style>
        </div>
      </div>

      {/* Cursos del semestre */}
      <div style={{ marginTop: 36, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="eyebrow">Tus cursos · {USER.semestre}</div>
          <div className="display" style={{ fontSize: 36, marginTop: 6 }}>6 materias activas</div>
        </div>
        <a className="btn btn-ghost" onClick={() => setRoute('cursos')}>Ver todos <IconArrow size={14} /></a>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {CURSOS.map(c => (
          <a key={c.id} className="card" onClick={() => openCurso(c.id)} style={{ cursor: 'default', transition: 'transform .15s, border-color .15s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <CourseGlyph curso={c} size={44} radius={12} />
              {c.proximas > 0 ? <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{c.proximas} por entregar</span> :
                <span className="pill pill-accent mono" style={{ fontSize: 10 }}>al día</span>}
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{c.clave} · Grupo {c.grupo}</div>
            <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>{c.nombre}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>{c.docente}</div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span className="eyebrow" style={{ fontSize: 10 }}>Avance</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink)' }}>{c.progreso}%</span>
            </div>
            <Progress value={c.progreso} tone="var(--ink)" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CURSOS (listado)
// ─────────────────────────────────────────────────────────────────────

function VistaCursos({ openCurso, tw }) {
  const [filtro, setFiltro] = vUseState('actuales');
  const variante = tw.cursosVariant || 'cards';
  return (
    <div className="view">
      <SectionTitle eyebrow="Cursos" title={<>Tu <span className="serif-italic">semestre</span>.</>}
        subtitle={`${CURSOS.length} materias · ${CURSOS.reduce((a, c) => a + c.creditos, 0)} créditos · ${USER.semestre}`}
        right={<div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><IconFilter size={14} />Filtrar</button>
          <button className="btn btn-primary"><IconPlus size={14} />Inscribir materia</button>
        </div>}
      />

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--line)' }}>
        {[['actuales', 'Actuales', CURSOS.length], ['pasadas', 'Pasadas', 12], ['favoritas', 'Favoritas', 2]].map(([id, label, n]) => (
          <a key={id} onClick={() => setFiltro(id)} style={{
            padding: '10px 16px', fontSize: 14, fontWeight: 500,
            color: filtro === id ? 'var(--ink)' : 'var(--muted)',
            borderBottom: filtro === id ? '2px solid var(--ink)' : '2px solid transparent',
            marginBottom: -1, display: 'flex', gap: 8, alignItems: 'center'
          }}>{label} <span className="mono" style={{ fontSize: 11, color: 'var(--faint)' }}>{n}</span></a>
        ))}
      </div>

      {variante === 'cards' ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {CURSOS.map(c => (
            <a key={c.id} className="card card-flush" onClick={() => openCurso(c.id)} style={{ cursor: 'default', overflow: 'hidden' }}>
              <div className={c.color} style={{ height: 100, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink)', opacity: 0.7 }}>{c.clave}</div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, lineHeight: 1.15 }}>{c.nombre}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{c.docente}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Calif. parcial</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22 }}>{c.calif.toFixed(1)}</span>
                </div>
                <div style={{ marginTop: 8 }}><Progress value={c.progreso} tone="var(--ink)" /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
                  <span>Grupo {c.grupo} · {c.creditos} créditos</span>
                  <span>{c.proximas > 0 ? `${c.proximas} pendiente${c.proximas > 1 ? 's' : ''}` : 'sin pendientes'}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="card card-flush">
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1.2fr 1fr 100px 100px 140px 40px', alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)', fontSize: 11.5 }} className="eyebrow">
            <span></span><span>Materia</span><span>Docente</span><span>Calif.</span><span>Créd.</span><span>Avance</span><span></span>
          </div>
          {CURSOS.map(c => (
            <a key={c.id} onClick={() => openCurso(c.id)} style={{ display: 'grid', gridTemplateColumns: '36px 1.2fr 1fr 100px 100px 140px 40px', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--line)', cursor: 'default' }}
               onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <CourseGlyph curso={c} size={28} radius={8} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{c.nombre}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.clave} · grupo {c.grupo}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{c.docente}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22 }}>{c.calif.toFixed(1)}</div>
              <div className="mono" style={{ fontSize: 13 }}>{c.creditos}</div>
              <div><Progress value={c.progreso} tone="var(--ink)" /></div>
              <IconChevR size={16} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CURSO DETALLE
// ─────────────────────────────────────────────────────────────────────

function VistaCursoDetalle({ cursoId, goBack, openTarea }) {
  const c = courseOf(cursoId);
  const [tab, setTab] = vUseState('tareas');
  if (!c) return null;
  const tareasDelCurso = TAREAS.filter(t => t.curso === c.id);
  const entregadas = ENTREGADAS.filter(e => e.curso === c.id);

  return (
    <div className="view">
      <a className="btn btn-ghost" onClick={goBack} style={{ marginBottom: 16, padding: '6px 10px', marginLeft: -10 }}><IconArrowL size={14} />Volver a cursos</a>

      {/* Hero */}
      <div className="card card-flush" style={{ marginBottom: 24 }}>
        <div className={c.color} style={{ padding: '40px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--ink)', opacity: 0.7 }}>{c.clave} · GRUPO {c.grupo}</div>
            <h1 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 60px)', margin: '6px 0 0', color: 'var(--ink)' }}>{c.nombre}</h1>
            <div style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-2)' }}>{c.docente}</div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            <Stat label="Promedio" value={c.calif.toFixed(1)} />
            <Stat label="Avance" value={`${c.progreso}%`} />
            <Stat label="Pendientes" value={c.proximas} />
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
          {[['resumen', 'Resumen'], ['tareas', 'Tareas y entregas'], ['material', 'Material'], ['calif', 'Calificaciones'], ['personas', 'Personas']].map(([id, label]) => (
            <a key={id} onClick={() => setTab(id)} style={{
              padding: '14px 22px', fontSize: 14, fontWeight: 500,
              color: tab === id ? 'var(--ink)' : 'var(--muted)',
              borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: -1
            }}>{label}</a>
          ))}
        </div>
      </div>

      {tab === 'resumen' && (
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
          <div className="card card-lg">
            <div className="eyebrow">Acerca del curso</div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.45, marginTop: 10, color: 'var(--ink-2)' }}>
              Este curso aborda los métodos de integración: por sustitución, por partes, fracciones parciales, así como aplicaciones a áreas, volúmenes y problemas de la vida real. Se evalúa con tareas semanales (40%), tres parciales (45%) y un proyecto final (15%).
            </p>
            <hr className="hr" style={{ margin: '24px 0' }} />
            <div className="eyebrow">Anuncio reciente</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 14 }}>
              <span className="avatar" style={{ background: 'linear-gradient(135deg, #e9d8b3, #c9a55e)' }}>RM</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.docente}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>hace 2 días</div>
                <p style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 8 }}>
                  Equipo, recuerden que la entrega del problemario es este sábado a las 11:59 pm. Si tienen dudas, hay asesoría el viernes 4 pm en mi cubículo.
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="eyebrow">Próxima clase</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginTop: 6 }}>Lunes 10:00</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Salón A-110</div>
              <div style={{ marginTop: 14, fontSize: 13.5 }}>Tema: <strong>Aplicaciones geométricas</strong></div>
            </div>
            <div className="card">
              <div className="eyebrow">Material destacado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {['Tabla de integrales (PDF)', 'Video: Método de partes', 'Ejercicios resueltos'].map((m, i) => (
                  <a key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13.5 }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <IconFile size={16} />{m}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'tareas' && (
        <div className="card card-flush">
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="display" style={{ fontSize: 26 }}>Tareas y entregas</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--muted)' }}>
              <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{tareasDelCurso.length} pendientes</span>
              <span className="pill pill-accent mono" style={{ fontSize: 10 }}>{entregadas.length} entregadas</span>
            </div>
          </div>
          {tareasDelCurso.map(t => (
            <a key={t.id} onClick={() => openTarea(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', borderBottom: '1px solid var(--line)', cursor: 'default' }}
               onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconPaper size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{t.titulo}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{t.tipo} · {t.puntos} puntos</div>
              </div>
              <UrgenciaPill urgencia={t.urgencia} />
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', minWidth: 110, textAlign: 'right' }}>{t.vence}</div>
            </a>
          ))}
          <div style={{ padding: '18px 24px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="eyebrow">Entregadas recientemente</div>
          </div>
          {entregadas.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', borderTop: '1px solid var(--line)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheck size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{e.titulo}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>Entregado el {e.fecha}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26 }}>{e.calif}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>/{e.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'material' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {['Unidad 1 · Métodos de integración', 'Unidad 2 · Aplicaciones geométricas', 'Unidad 3 · Integrales impropias', 'Recursos extra', 'Asesorías grabadas', 'Bibliografía'].map((m, i) => (
            <div key={i} className="card" style={{ cursor: 'default' }}>
              <div className="placeholder" style={{ height: 100, marginBottom: 14 }}>módulo {i+1}</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{m}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{i < 3 ? `${4 + i} documentos · ${1 + i} videos` : '3 documentos'}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'calif' && (
        <div className="card card-flush">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Calificación parcial actual</div>
              <div className="display" style={{ fontSize: 48, marginTop: 4 }}>{c.calif.toFixed(1)} <span style={{ fontSize: 22, color: 'var(--muted)' }}>/ 10</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="eyebrow">Posición</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Arriba del promedio del grupo (7.8)</div>
            </div>
          </div>
          {entregadas.map(e => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 100px', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--line)', gap: 16 }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{e.titulo}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Entregado el {e.fecha}{e.retro && ' · con retroalimentación'}</div>
              </div>
              <div className="mono" style={{ fontSize: 13 }}>{e.calif}/{e.total}</div>
              <Progress value={(e.calif/e.total)*100} tone={e.calif >= 80 ? 'var(--accent)' : 'var(--warn)'} />
              <div style={{ textAlign: 'right' }}>
                <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{(e.calif/e.total >= 0.85) ? 'excelente' : (e.calif/e.total >= 0.7) ? 'bien' : 'a mejorar'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'personas' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[{ n: c.docente, r: 'Docente', i: 'RM' }, { n: 'Carla Domínguez', r: 'Ayudante', i: 'CD' },
            ...['Carlos M.', 'Diana R.', 'Esteban L.', 'Sofía V.', 'Pablo T.', 'Mariana G.', 'Luis A.'].map(n => ({ n, r: 'Estudiante', i: n.split(' ').map(p => p[0]).join('') }))
          ].map((p, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="avatar" style={{ background: i === 0 ? 'linear-gradient(135deg, #e9d8b3, #c9a55e)' : i === 1 ? 'linear-gradient(135deg, #d8efe0, #6cc190)' : 'linear-gradient(135deg, #c9bcff, #5b3fdb)' }}>{p.i}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.n}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.r}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink)', opacity: 0.7, letterSpacing: '.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--ink)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { VistaTablero, VistaCursos, VistaCursoDetalle });
