// views.jsx — Inicio, Mi ruta, Skill (lección)

const { useState: vState, useMemo: vMemo } = React;

// ─────────────────────────────────────────────────────────────────────
// INICIO
// ─────────────────────────────────────────────────────────────────────
function VistaInicio({ irA, openSkill, abrirPractica, tw }) {
  const sig = siguienteSkill();
  const uni = unidadDeSkill(sig.id);
  const restanHoy = Math.max(0, ESTUDIANTE.objetivoDiario - ESTUDIANTE.hechosHoy);
  const areasTop = AREAS.slice(0, 3);

  return (
    <div className="view">
      {/* Saludo */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Inicio · {HOY}</div>
        <div className="hero-wrap-sm" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 66px)', margin: 0, maxWidth: 820 }}>
            {saludoHora()}, <span className="serif-italic">{ESTUDIANTE.nombre}.</span>
            <br />
            {restanHoy === 0
              ? <>Ya cerraste tu <span style={{ color: 'var(--accent)' }}>meta de hoy</span>.</>
              : <>Te faltan <span style={{ color: 'var(--primary)' }}>{restanHoy}</span> {restanHoy === 1 ? 'problema' : 'problemas'} para hoy.</>}
          </h1>
          <span className="pill" style={{ background: 'var(--warn-soft)', color: 'var(--warn)', fontWeight: 600, fontSize: 14, height: 34, padding: '0 14px', flexShrink: 0 }}>
            <IconFlame size={16} />{ESTUDIANTE.racha} días de racha
          </span>
        </div>
      </div>

      <div className="grid stack-sm" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Continuar */}
        <div className="card card-lg" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div className="eyebrow">Continúa donde te quedaste</div>
              <div className="display" style={{ fontSize: 30, marginTop: 6 }}>{sig.nombre}</div>
            </div>
            {sig.esRezago && <span className="pill pill-warn" style={{ flexShrink: 0 }}><IconRefresh size={12} />Repaso</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="pill pill-ghost mono" style={{ fontSize: 11 }}>{sig.etapa}</span>
            <span className="pill pill-ghost mono" style={{ fontSize: 11 }}>{uni.unidad}</span>
            <span className="pill pill-ghost mono" style={{ fontSize: 11 }}>≈ {sig.mins} min</span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: '0 0 20px', lineHeight: 1.5 }}>{sig.desc}</p>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span className="eyebrow" style={{ fontSize: 10 }}>Tu dominio de esta skill</span>
              <span className="mono" style={{ fontSize: 12 }}>{sig.dominio}%</span>
            </div>
            <Progress value={sig.dominio} tone="var(--primary)" />
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button className="btn btn-violet" onClick={() => abrirPractica(sig.id, 'inicio')}>
                <IconPlay size={14} />Practicar {sig.mins} min
              </button>
              <button className="btn btn-secondary" onClick={() => openSkill(sig.id)}>Ver la lección</button>
            </div>
          </div>
        </div>

        {/* Dominio general */}
        <div className="card card-lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="eyebrow" style={{ alignSelf: 'flex-start' }}>Tu dominio · {ESTUDIANTE.nivelLabel}</div>
          <div style={{ margin: '18px 0 8px' }}>
            <Ring value={ESTUDIANTE.dominioGeneral} size={150} tone="var(--primary)">
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{ESTUDIANTE.dominioGeneral}<span style={{ fontSize: 18, color: 'var(--muted)' }}>%</span></div>
              <div className="eyebrow" style={{ fontSize: 9 }}>dominado</div>
            </Ring>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
            <IconCheck size={14} />{ESTADISTICAS.rezagoRecuperado} temas de rezago recuperados
          </div>
          <a className="btn btn-ghost" onClick={() => irA('progreso')} style={{ marginTop: 14 }}>Ver progreso <IconArrow size={14} /></a>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid stack-sm" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 8 }}>
        <AccesoCard tint="course-his" Icon={IconBrain} title="Pregúntale al Tutor IA"
          body="Te explica paso a paso, sin darte la respuesta de golpe." cta="Abrir tutor" onClick={() => irA('tutor')} />
        <AccesoCard tint="course-quim" Icon={IconPulse} title="Haz tu diagnóstico"
          body="Ubica tu nivel real y detecta tus huecos en minutos." cta="Empezar" onClick={() => irA('diagnostico')} />
        <AccesoCard tint="course-bio" Icon={IconRoute} title="Revisa tu ruta"
          body="Mira todo tu camino: lo que dominas y lo que sigue." cta="Ver ruta" onClick={() => irA('ruta')} />
      </div>

      {/* Áreas */}
      <div style={{ marginTop: 36, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="eyebrow">Áreas de matemáticas</div>
          <div className="display" style={{ fontSize: 30, marginTop: 6 }}>Cómo vas por tema</div>
        </div>
        <a className="btn btn-ghost" onClick={() => irA('progreso')}>Ver todo <IconArrow size={14} /></a>
      </div>
      <div className="card card-flush">
        {areasTop.map((a, i) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <Glyph color={a.color} size={38} radius={10}><IconDivide size={18} /></Glyph>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{a.nombre}</span>
                {a.rezago && <span className="pill pill-warn" style={{ fontSize: 10 }}>rezago</span>}
              </div>
              <div style={{ marginTop: 8 }}><Progress value={a.dominio} tone={a.dominio >= 70 ? 'var(--accent)' : a.dominio >= 45 ? 'var(--primary)' : 'var(--warn)'} /></div>
            </div>
            <span className="mono" style={{ fontSize: 13, color: 'var(--muted)', minWidth: 40, textAlign: 'right' }}>{a.dominio}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccesoCard({ tint, Icon, title, body, cta, onClick }) {
  return (
    <a className="card" onClick={onClick} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', transition: 'transform .15s, border-color .15s' }}
       onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
       onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <Glyph color={tint} size={42} radius={12}><Icon size={20} /></Glyph>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 21, marginTop: 14, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, flex: 1 }}>{body}</div>
      <div style={{ marginTop: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontWeight: 500 }}>{cta} <IconArrow size={13} /></div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MI RUTA
// ─────────────────────────────────────────────────────────────────────
function VistaRuta({ openSkill, tw }) {
  const dominados = todosLosSkills().filter(s => s.estado === 'dominado').length;
  const total = todosLosSkills().length;

  return (
    <div className="view">
      <SectionTitle eyebrow="Tu ruta personalizada"
        title={<>Tu camino a <span className="serif-italic">tu nivel</span>.</>}
        subtitle={`Primero cerramos tu rezago, luego avanzamos a ${ESTUDIANTE.nivelLabel}. Llevas ${dominados} de ${total} skills.`}
        right={<button className="btn btn-secondary" onClick={() => tw && null}><IconPulse size={14} />Rehacer diagnóstico</button>}
      />

      {/* Mapa de niveles */}
      <div className="grid stack-sm" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {ETAPAS.map(e => {
          const activa = e.nombre === ESTUDIANTE.etapa;
          return (
            <div key={e.id} className="card" style={{ padding: 16, borderColor: activa ? 'var(--primary)' : 'var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Glyph color={e.color} size={32} radius={9}>
                  {e.id === 'prees' ? <IconShapes size={15} /> : e.id === 'prim' ? <IconDivide size={15} /> : e.id === 'sec' ? <IconFx size={15} /> : <IconChart size={15} />}
                </Glyph>
                {activa && <span className="pill pill-primary" style={{ fontSize: 10 }}>Aquí vas</span>}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 12 }}>{e.nombre}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{e.grados}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.4 }}>{e.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Camino */}
      <div style={{ maxWidth: 720 }}>
        {RUTA.map((u, ui) => (
          <div key={u.id} style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="eyebrow" style={{ fontSize: 11 }}>Unidad {ui + 1}</span>
                  {u.esRezago && <span className="pill pill-warn" style={{ fontSize: 10 }}><IconRefresh size={11} />Repaso · cierra rezago</span>}
                </div>
                <div className="display" style={{ fontSize: 26, marginTop: 4 }}>{u.unidad}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{u.origen} · {u.resumen}</div>
              </div>
            </div>
            <div>
              {u.skills.map((s, si) => (
                <SkillNodo key={s.id} skill={s} primero={si === 0} ultimo={si === u.skills.length - 1}
                  onOpen={() => s.estado !== 'bloqueado' && openSkill(s.id)} />
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0 0 6px', color: 'var(--muted)' }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, border: '1.5px dashed var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkle size={12} />
          </div>
          <span style={{ fontSize: 13 }}>Cuando domines lo anterior, la IA generará tus siguientes unidades.</span>
        </div>
      </div>
    </div>
  );
}

function SkillNodo({ skill, primero, ultimo, onOpen }) {
  const s = skill;
  const bloqueado = s.estado === 'bloqueado';
  const tone = s.estado === 'dominado' ? 'var(--accent)' : s.estado === 'en-progreso' ? 'var(--primary)' : bloqueado ? 'var(--line-2)' : 'var(--ink)';
  const nodo = (
    <div style={{
      width: 34, height: 34, borderRadius: 999, flexShrink: 0,
      background: s.estado === 'dominado' ? 'var(--accent)' : 'var(--surface)',
      border: `2px solid ${tone}`, color: s.estado === 'dominado' ? '#fff' : tone,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: s.estado === 'en-progreso' ? '0 0 0 4px var(--primary-soft)' : 'none',
    }}>
      {s.estado === 'dominado' ? <IconCheck size={16} /> : bloqueado ? <IconLock size={14} /> : <IconPlay size={13} />}
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {nodo}
        {!ultimo && <div style={{ flex: 1, width: 2, background: 'var(--line)', margin: '2px 0' }} />}
      </div>
      <a onClick={onOpen} className="card" style={{
        flex: 1, marginBottom: 12, padding: '14px 18px', cursor: 'default',
        opacity: bloqueado ? 0.65 : 1, display: 'flex', alignItems: 'center', gap: 14,
        transition: 'border-color .15s, transform .12s',
      }}
        onMouseEnter={(e) => { if (!bloqueado) { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.transform = 'translateX(2px)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15.5, fontWeight: 500 }}>{s.nombre}</span>
            {s.esRezago && <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>{s.etapa}</span>}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{s.desc}</div>
          {s.estado === 'en-progreso' && <div style={{ marginTop: 10, maxWidth: 220 }}><Progress value={s.dominio} tone="var(--primary)" h={5} /></div>}
        </div>
        <EstadoPill estado={s.estado} />
        {!bloqueado && <IconChevR size={16} style={{ color: 'var(--faint)' }} />}
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SKILL (lección + intro a la práctica)
// ─────────────────────────────────────────────────────────────────────
function VistaSkill({ skillId, goBack, abrirPractica, openSkill }) {
  const s = skillById(skillId);
  if (!s) return null;
  const uni = unidadDeSkill(s.id);
  const bloqueado = s.estado === 'bloqueado';
  const ejemplo = problemasDe(s.id)[0];
  const skills = todosLosSkills();
  const idx = skills.findIndex(x => x.id === s.id);
  const prev = idx > 0 ? skills[idx - 1] : null;
  const next = idx < skills.length - 1 ? skills[idx + 1] : null;

  const objetivos = [
    `Entender la idea clave de "${s.nombre.toLowerCase()}".`,
    'Resolver problemas paso a paso con apoyo del tutor IA.',
    'Aplicarlo en situaciones de la vida real.',
  ];

  return (
    <div className="view">
      <a className="btn btn-ghost" onClick={goBack} style={{ marginBottom: 16, padding: '6px 10px', marginLeft: -10 }}><IconArrowL size={14} />Volver a la ruta</a>

      <div className="grid stack-sm" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div>
          {/* Encabezado */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="pill pill-ghost mono" style={{ fontSize: 11 }}>{s.etapa}</span>
            <span className="pill pill-ghost mono" style={{ fontSize: 11 }}>{uni.unidad}</span>
            {s.esRezago && <span className="pill pill-warn" style={{ fontSize: 11 }}><IconRefresh size={11} />Repaso</span>}
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(34px, 4vw, 50px)', margin: 0, lineHeight: 1.05 }}>{s.nombre}</h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 14, lineHeight: 1.5, maxWidth: 560 }}>{s.desc}</p>

          {s.esRezago && (
            <div style={{ display: 'flex', gap: 12, marginTop: 18, padding: '14px 16px', background: 'var(--warn-soft)', borderRadius: 12 }}>
              <IconBulb size={18} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
                <strong style={{ color: 'var(--warn)' }}>Por qué estás aquí:</strong> en tu diagnóstico detectamos un hueco de {s.etapa}. Cerrarlo hará que el álgebra de tu grado te salga mucho más fácil.
              </div>
            </div>
          )}

          {/* Idea clave + ejemplo */}
          {ejemplo && (
            <div className="card card-lg" style={{ marginTop: 20 }}>
              <div className="eyebrow">Idea clave · ejemplo resuelto</div>
              <div style={{ fontSize: 20, fontFamily: 'var(--font-serif)', marginTop: 12, marginBottom: 4 }}>
                <Expr>{ejemplo.enunciado}</Expr>
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ejemplo.pasos.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--primary-soft)', color: 'var(--primary-ink)', fontSize: 11, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 14.5, color: 'var(--ink-2)' }}><Expr>{p}</Expr></span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13.5, color: 'var(--ink-2)' }}>
                <strong>En corto:</strong> {ejemplo.explica}
              </div>
            </div>
          )}

          {/* Objetivos */}
          <div className="card card-lg" style={{ marginTop: 18 }}>
            <div className="eyebrow">Qué vas a lograr</div>
            <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none' }}>
              {objetivos.map((o, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', fontSize: 14.5, color: 'var(--ink-2)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}><IconCheck size={16} /></span>{o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card card-lg" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ textAlign: 'left' }}>Tu dominio</div>
            <div style={{ margin: '16px 0 6px', display: 'flex', justifyContent: 'center' }}>
              <Ring value={s.dominio} size={128} tone={bloqueado ? 'var(--line-2)' : 'var(--primary)'}>
                <div className="display" style={{ fontSize: 38, lineHeight: 1 }}>{s.dominio}<span style={{ fontSize: 15, color: 'var(--muted)' }}>%</span></div>
              </Ring>
            </div>
            {bloqueado ? (
              <>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', margin: '8px 0 14px' }}>Primero domina las skills anteriores para desbloquear esta.</div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled><IconLock size={14} />Bloqueada</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', margin: '8px 0 14px' }}>≈ {s.mins} min · el tutor IA te acompaña.</div>
                <button className="btn btn-violet" style={{ width: '100%', justifyContent: 'center' }} onClick={() => abrirPractica(s.id, 'skill')}>
                  <IconPlay size={14} />Empezar práctica
                </button>
              </>
            )}
          </div>
          <div className="card">
            <div className="eyebrow">En esta unidad</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(prev || next) ? [prev, next].filter(Boolean).map(k => (
                <a key={k.id} onClick={() => openSkill(k.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13.5 }}
                   onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ color: 'var(--muted)' }}>{k.estado === 'dominado' ? <IconCheck size={15} /> : k.estado === 'bloqueado' ? <IconLock size={14} /> : <IconPlay size={12} />}</span>
                  <span style={{ flex: 1 }}>{k.nombre}</span>
                  <IconChevR size={14} style={{ color: 'var(--faint)' }} />
                </a>
              )) : <div style={{ fontSize: 13, color: 'var(--muted)' }}>Es la única skill de la unidad.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VistaInicio, VistaRuta, VistaSkill });
