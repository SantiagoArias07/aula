// views2.jsx — Práctica (tutor IA), Diagnóstico, Progreso — conscientes del nivel

const { useState: v2State } = React;

function normNum(v) { return parseFloat(String(v).replace(',', '.').replace(/[−–—]/g, '-').replace(/\s+/g, '')); }

function Opcion({ i, texto, state, onClick }) {
  return (
    <button className="opt" data-state={state} onClick={onClick} type="button">
      <span className="opt-key">{String.fromCharCode(65 + i)}</span>
      <span style={{ flex: 1 }}><Expr>{texto}</Expr></span>
      {state === 'correct' && <IconCheck size={18} style={{ color: 'var(--accent)' }} />}
      {state === 'wrong' && <IconX size={16} style={{ color: 'var(--danger)' }} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PRÁCTICA
// ─────────────────────────────────────────────────────────────────────
function VistaPractica({ skillId, goBack, toast }) {
  const s = skillById(skillId);
  const problemas = problemasDe(skillId);
  const N = problemas.length;
  const kids = modoActivo() === 'kids';

  const [idx, setIdx] = v2State(0);
  const [sel, setSel] = v2State(null);
  const [checked, setChecked] = v2State(false);
  const [correcto, setCorrecto] = v2State(false);
  const [hints, setHints] = v2State(0);
  const [showSteps, setShowSteps] = v2State(false);
  const [resueltos, setResueltos] = v2State(() => problemas.map(() => false));
  const [done, setDone] = v2State(false);

  if (!s) return null;
  if (N === 0) {
    return (
      <div className="view">
        <a className="btn btn-ghost" onClick={goBack} style={{ marginBottom: 16, padding: '6px 10px', marginLeft: -10 }}><IconArrowL size={14} />Volver</a>
        <EmptyState icon={<IconTarget size={24} />} title="Práctica en preparación" body={`Estamos generando los ejercicios de "${s.nombre}" con la IA. Muy pronto podrás practicar aquí.`} />
      </div>
    );
  }

  const p = problemas[idx];
  const esNum = p.tipo === 'numerica';
  const respondible = esNum ? String(sel ?? '').trim() !== '' : sel !== null;
  const aciertos = resueltos.filter(Boolean).length;

  const comprobar = () => {
    if (!respondible || checked) return;
    const ok = esNum ? normNum(sel) === p.correcta : sel === p.correcta;
    setChecked(true); setCorrecto(ok);
    if (ok) setResueltos(prev => { const c = [...prev]; c[idx] = true; return c; });
  };
  const pedirPista = () => setHints(h => Math.min(p.pistas.length, h + 1));
  const reintentar = () => { setChecked(false); setSel(esNum ? '' : null); };
  const siguiente = () => {
    if (idx === N - 1) { setDone(true); window.scrollTo(0, 0); return; }
    setIdx(idx + 1); setSel(null); setChecked(false); setCorrecto(false); setHints(0); setShowSteps(false); window.scrollTo(0, 0);
  };

  if (done) {
    const precision = Math.round((aciertos / N) * 100);
    const nuevoDominio = Math.min(100, Math.max(s.dominio, precision));
    const xp = aciertos * 10;
    return (
      <div className="view" style={{ maxWidth: 620, margin: '0 auto' }}>
        <div className="card card-lg pop" style={{ textAlign: 'center', padding: '44px 28px' }}>
          <div style={{ width: 68, height: 68, margin: '0 auto 18px', borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrophy size={32} /></div>
          <div className="display" style={{ fontSize: 40 }}>{kids ? '¡Lo lograste! 🎉' : '¡Práctica completada!'}</div>
          <div style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>
            {precision >= 80 ? (kids ? '¡Eres un crack! Te salió increíble.' : `Excelente trabajo, ${ESTUDIANTE.nombre}. Vas dominando esto.`) : precision >= 50 ? 'Muy bien. Un par de repasos más y lo dominas.' : (kids ? 'Buen intento. ¡Vamos otra vez!' : 'Buen intento. Repasa con el tutor y vuelve a intentarlo.')}
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 26 }}>
            <ResTile label={kids ? 'Correctas' : 'Aciertos'} value={`${aciertos}/${N}`} />
            <ResTile label="Precisión" value={`${precision}%`} />
            <ResTile label="XP" value={`+${xp}`} tone="var(--primary)" />
          </div>
          <div style={{ marginTop: 22, padding: '16px 18px', background: 'var(--surface-2)', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="eyebrow">{kids ? 'Qué tan bien te sale ahora' : 'Dominio de la skill'}</span>
              <span className="mono" style={{ fontSize: 13 }}>{s.dominio}% → <strong style={{ color: 'var(--accent)' }}>{nuevoDominio}%</strong></span>
            </div>
            <Progress value={nuevoDominio} tone="var(--accent)" />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={goBack}>{kids ? 'Volver al mapa' : 'Volver a la ruta'}</button>
            <button className="btn btn-secondary" onClick={() => { setIdx(0); setSel(null); setChecked(false); setCorrecto(false); setHints(0); setShowSteps(false); setResueltos(problemas.map(() => false)); setDone(false); window.scrollTo(0, 0); }}><IconRefresh size={14} />{kids ? 'Otra vez' : 'Repetir'}</button>
          </div>
        </div>
      </div>
    );
  }

  const optState = (i) => {
    if (!checked) return sel === i ? 'selected' : 'idle';
    if (i === p.correcta) return 'correct';
    if (i === sel) return 'wrong';
    return 'muted';
  };

  return (
    <div className="view" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <button className="icon-btn" onClick={goBack} aria-label="Salir"><IconX size={18} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {problemas.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: i < idx || resueltos[i] ? 'var(--accent)' : i === idx ? 'var(--primary)' : 'var(--line)', transition: 'background .3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{s.nombre}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{kids ? 'Reto' : 'Problema'} {idx + 1} de {N}</span>
          </div>
        </div>
      </div>

      <div className="card card-lg" key={p.id}>
        <div className="eyebrow">{esNum ? (kids ? 'Escribe el número' : 'Escribe tu respuesta') : (kids ? 'Toca la respuesta' : 'Elige la respuesta correcta')}</div>
        <div className="display" style={{ fontSize: 'clamp(24px, 3.4vw, 34px)', marginTop: 12, lineHeight: 1.25 }}><Expr>{p.enunciado}</Expr></div>

        <div style={{ marginTop: 22 }}>
          {esNum ? (
            <input className="numin" inputMode="decimal" autoFocus placeholder={kids ? '?' : 'Tu respuesta'} value={sel ?? ''}
              onChange={(e) => !checked && setSel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') comprobar(); }}
              style={checked ? { borderColor: correcto ? 'var(--accent)' : 'var(--danger)', background: correcto ? 'var(--accent-soft)' : 'var(--danger-soft)' } : undefined}
              readOnly={checked} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.opciones.map((op, i) => <Opcion key={i} i={i} texto={op} state={optState(i)} onClick={() => !checked && setSel(i)} />)}
            </div>
          )}
        </div>

        {hints > 0 && (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {p.pistas.slice(0, hints).map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--primary-soft)', borderRadius: 12 }}>
                <IconBulb size={18} style={{ color: 'var(--primary-ink)', flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--primary-ink)', letterSpacing: '.08em' }}>{kids ? 'AYUDÍN DICE' : 'TU TUTOR SUGIERE'}</span>
                  <div style={{ marginTop: 3 }}><Expr>{h}</Expr></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {checked && (
          <div className="pop" style={{ marginTop: 18, padding: '16px 18px', borderRadius: 14, background: correcto ? 'var(--accent-soft)' : 'var(--danger-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: correcto ? 'var(--accent)' : 'var(--danger)', fontWeight: 600, fontSize: 15 }}>
              {correcto ? <IconCheck size={18} /> : <IconWarn size={17} />}
              {correcto ? (kids ? '¡Muy bien! 🎉' : '¡Correcto! 🎉') : (kids ? '¡Casi! Vuelve a intentar 💪' : 'Casi. Vamos a revisarlo.')}
            </div>
            {(correcto || showSteps) && <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>{p.explica}</div>}
            {showSteps && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <div className="eyebrow">{kids ? 'Cómo se hace' : 'Solución paso a paso'}</div>
                {p.pasos.map((paso, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--surface)', color: 'var(--ink-2)', fontSize: 11, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, border: '1px solid var(--line-2)' }}>{i + 1}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-2)' }}><Expr>{paso}</Expr></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 10, flexWrap: 'wrap' }}>
          {!checked ? (
            <>
              <button className="btn btn-ghost" onClick={pedirPista} disabled={hints >= p.pistas.length}>
                <IconBulb size={14} />{hints === 0 ? (kids ? 'Ayudita 💡' : 'Pedir una pista') : hints >= p.pistas.length ? 'Sin más pistas' : 'Otra pista'}
              </button>
              <button className="btn btn-violet" onClick={comprobar} disabled={!respondible} style={{ opacity: respondible ? 1 : 0.5 }}>{kids ? 'Revisar' : 'Comprobar'}</button>
            </>
          ) : correcto ? (
            <>
              <button className="btn btn-ghost" onClick={() => setShowSteps(v => !v)}><IconChevD size={14} />{showSteps ? 'Ocultar pasos' : 'Ver pasos'}</button>
              <button className="btn btn-primary" onClick={siguiente}>{idx === N - 1 ? (kids ? '¡Terminé!' : 'Terminar') : (kids ? '¡Sigue!' : 'Siguiente')} <IconArrow size={14} /></button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setShowSteps(true)}><IconBulb size={14} />{kids ? 'Ver cómo' : 'Ver solución'}</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={reintentar}><IconRefresh size={14} />{kids ? 'Otra vez' : 'Intentar de nuevo'}</button>
                <button className="btn btn-primary" onClick={siguiente}>{idx === N - 1 ? 'Terminar' : 'Saltar'}</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, color: 'var(--muted)', fontSize: 12.5, justifyContent: 'center' }}>
        <IconBrain size={15} style={{ color: 'var(--primary)' }} />
        {kids ? 'Ayudín está contigo: pide ayudita las veces que quieras.' : 'Tu tutor IA te acompaña: pide pistas las veces que necesites, sin pena.'}
      </div>
    </div>
  );
}

function ResTile({ label, value, tone }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '16px 10px' }}>
      <div className="display" style={{ fontSize: 30, color: tone || 'var(--ink)' }}>{value}</div>
      <div className="eyebrow" style={{ marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// DIAGNÓSTICO
// ─────────────────────────────────────────────────────────────────────
function VistaDiagnostico({ goBack, irARuta }) {
  const [fase, setFase] = v2State('intro');
  const [qi, setQi] = v2State(0);
  const [sel, setSel] = v2State(null);
  const [aciertos, setAciertos] = v2State(0);
  const [fallos, setFallos] = v2State([]);

  const Q = diagnosticoActivo();
  const et = etapaActiva();
  const q = Q[qi];
  const esNum = q && q.tipo === 'numerica';
  const respondible = q && (esNum ? String(sel ?? '').trim() !== '' : sel !== null);

  const responder = () => {
    if (!respondible) return;
    const ok = esNum ? normNum(sel) === q.correcta : sel === q.correcta;
    if (ok) setAciertos(a => a + 1);
    else setFallos(f => f.includes(q.area) ? f : [...f, q.area]);
    if (qi === Q.length - 1) { setFase('result'); window.scrollTo(0, 0); }
    else { setQi(qi + 1); setSel(null); window.scrollTo(0, 0); }
  };

  if (fase === 'intro') {
    return (
      <div className="view" style={{ maxWidth: 620, margin: '0 auto' }}>
        <a className="btn btn-ghost" onClick={goBack} style={{ marginBottom: 16, padding: '6px 10px', marginLeft: -10 }}><IconArrowL size={14} />Volver</a>
        <div className="card card-lg" style={{ textAlign: 'center', padding: '40px 28px' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: 18, background: 'var(--primary-soft)', color: 'var(--primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconPulse size={30} /></div>
          <div className="display" style={{ fontSize: 38 }}>Vamos a ubicar tu nivel</div>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 10, maxWidth: 440, marginInline: 'auto', lineHeight: 1.55 }}>
            Son {Q.length} preguntas cortas. Con tus respuestas, la IA detecta qué temas reforzar —incluso de grados anteriores— y arma tu ruta de {et.nombre}.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}><div className="display" style={{ fontSize: 26 }}>{Q.length}</div><div className="eyebrow">preguntas</div></div>
            <div style={{ textAlign: 'center' }}><div className="display" style={{ fontSize: 26 }}>≈ {Math.max(3, Math.round(Q.length * 1.2))}</div><div className="eyebrow">minutos</div></div>
            <div style={{ textAlign: 'center' }}><div className="display" style={{ fontSize: 26 }}>{et.emoji}</div><div className="eyebrow">{et.nombre}</div></div>
          </div>
          <button className="btn btn-violet" style={{ marginTop: 26 }} onClick={() => setFase('preg')}><IconPlay size={14} />Empezar</button>
        </div>
      </div>
    );
  }

  if (fase === 'result') {
    const nivelTxt = aciertos >= Math.ceil(Q.length * 0.8) ? `${et.nombre} con bases sólidas`
      : aciertos >= Math.ceil(Q.length * 0.5) ? `${et.nombre} con algunos huecos por reforzar`
      : `Reforzaremos las bases antes de avanzar`;
    const reforzar = fallos.length ? fallos : ['¡Ninguno! Vas muy bien'];
    return (
      <div className="view" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="card card-lg pop" style={{ padding: '36px 28px' }}>
          <div className="eyebrow" style={{ textAlign: 'center' }}>Diagnóstico terminado</div>
          <div className="display" style={{ fontSize: 34, textAlign: 'center', marginTop: 6 }}>Este es tu punto de partida</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Ring value={Math.round(aciertos / Q.length * 100)} size={130} tone="var(--primary)">
              <div className="display" style={{ fontSize: 34, lineHeight: 1 }}>{aciertos}<span style={{ fontSize: 16, color: 'var(--muted)' }}>/{Q.length}</span></div>
              <div className="eyebrow" style={{ fontSize: 9 }}>aciertos</div>
            </Ring>
            <div style={{ maxWidth: 300 }}>
              <div className="eyebrow">Nivel detectado</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginTop: 4, lineHeight: 1.25 }}>{nivelTxt}</div>
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Temas por reforzar</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {reforzar.map((a, i) => <span key={i} className="pill" style={{ background: 'var(--warn-soft)', color: 'var(--warn)', fontSize: 13, height: 30, padding: '0 14px' }}><IconRefresh size={12} />{a}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--surface-2)', borderRadius: 14, display: 'flex', gap: 12 }}>
            <IconRoute size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>Con esto armamos una ruta que primero cierra tus huecos y luego avanza a tu grado. Puedes empezar hoy mismo.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-violet" onClick={irARuta}><IconRoute size={14} />Ver mi ruta</button>
            <button className="btn btn-secondary" onClick={() => { setFase('intro'); setQi(0); setSel(null); setAciertos(0); setFallos([]); }}>Rehacer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <button className="icon-btn" onClick={goBack} aria-label="Salir"><IconX size={18} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
            <div style={{ width: `${qi / Q.length * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width .3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Diagnóstico · {q.nivel}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{qi + 1} / {Q.length}</span>
          </div>
        </div>
      </div>

      <div className="card card-lg" key={q.id}>
        <div className="eyebrow">{q.area}</div>
        <div className="display" style={{ fontSize: 'clamp(23px, 3.2vw, 32px)', marginTop: 12, lineHeight: 1.25 }}><Expr>{q.enunciado}</Expr></div>
        <div style={{ marginTop: 22 }}>
          {esNum ? (
            <input className="numin" inputMode="decimal" autoFocus placeholder="Tu respuesta" value={sel ?? ''} onChange={(e) => setSel(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') responder(); }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.opciones.map((op, i) => <Opcion key={i} i={i} texto={op} state={sel === i ? 'selected' : 'idle'} onClick={() => setSel(i)} />)}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-violet" onClick={responder} disabled={!respondible} style={{ opacity: respondible ? 1 : 0.5 }}>{qi === Q.length - 1 ? 'Ver resultado' : 'Siguiente'} <IconArrow size={14} /></button>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12.5, color: 'var(--muted)' }}>No te preocupes por fallar: justo para eso es.</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PROGRESO
// ─────────────────────────────────────────────────────────────────────
const ICONOS_LOGRO = { flame: IconFlame, target: IconTarget, trophy: IconTrophy, medal: IconMedal, star: IconStar, clock: IconClock };

function VistaProgreso({ irA }) {
  const kids = modoActivo() === 'kids';
  const areas = areasActivas();
  return (
    <div className="view">
      <SectionTitle eyebrow={kids ? 'Mis premios' : 'Tu progreso'}
        title={kids ? <>Todo lo que has <span className="serif-italic">ganado</span>.</> : <>Cómo vas <span className="serif-italic">cerrando el rezago</span>.</>}
        subtitle={kids ? 'Tus estrellas, tu racha y tus medallas.' : 'Tu avance real por área, tu constancia y lo que has logrado.'}
      />

      <div className="grid stack-sm" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card card-lg" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Ring value={ESTUDIANTE.dominioGeneral} size={150} tone="var(--primary)">
            <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{ESTUDIANTE.dominioGeneral}<span style={{ fontSize: 18, color: 'var(--muted)' }}>%</span></div>
            <div className="eyebrow" style={{ fontSize: 9 }}>{kids ? 'aprendido' : 'dominado'}</div>
          </Ring>
          <div>
            <div className="eyebrow">Nivel</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginTop: 2 }}>{ESTUDIANTE.nivelLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-2)' }}><IconCheck size={15} style={{ color: 'var(--accent)' }} />{ESTADISTICAS.skillsDominadas} {kids ? 'temas ganados' : 'skills dominadas'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-2)' }}><IconTarget size={15} style={{ color: 'var(--primary)' }} />{ESTADISTICAS.problemasResueltos} problemas resueltos</div>
            </div>
          </div>
        </div>

        <div className="card card-lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow">Racha actual</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span className="display" style={{ fontSize: 44, lineHeight: 1 }}>{ESTUDIANTE.racha}</span><span style={{ fontSize: 15, color: 'var(--muted)' }}>días</span>
              </div>
            </div>
            <span style={{ color: 'var(--warn)' }}><IconFlame size={30} /></span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>Tu mejor racha: {ESTUDIANTE.rachaMax} días</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {RACHA_SEMANAS.map((wk, wi) => (
              <div key={wi} style={{ display: 'flex', gap: 5 }}>
                {wk.map((v, di) => <div key={di} className="heat" style={{ flex: 1, aspectRatio: '1', background: v === 0 ? 'var(--surface-2)' : `color-mix(in oklab, var(--primary) ${v * 30 + 10}%, var(--surface-2))` }} />)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: 'var(--faint)' }}>
            <span className="mono">hace 6 semanas</span><span className="mono">hoy</span>
          </div>
        </div>
      </div>

      <div className="eyebrow" style={{ marginBottom: 12 }}>{kids ? 'Tus temas' : 'Dominio por área'}</div>
      <div className="card card-flush" style={{ marginBottom: 24 }}>
        {areas.map((a, i) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <Glyph color={a.color} size={40} radius={11}><IconDivide size={18} /></Glyph>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{a.nombre}</span>
                {a.rezago && <span className="pill pill-warn" style={{ fontSize: 10 }}>en recuperación</span>}
              </div>
              <div style={{ marginTop: 8 }}><Progress value={a.dominio} tone={a.dominio >= 70 ? 'var(--accent)' : a.dominio >= 45 ? 'var(--primary)' : 'var(--warn)'} /></div>
            </div>
            <span className="mono" style={{ fontSize: 14, minWidth: 42, textAlign: 'right' }}>{a.dominio}%</span>
          </div>
        ))}
      </div>

      <div className="grid stack-sm" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <EstTile Icon={IconTarget} label="Problemas resueltos" value={ESTADISTICAS.problemasResueltos} />
        <EstTile Icon={IconCheck} label="Precisión" value={`${ESTADISTICAS.precision}%`} />
        <EstTile Icon={IconClock} label="Minutos" value={ESTADISTICAS.minutos} />
        <EstTile Icon={IconMedal} label={kids ? 'Temas ganados' : 'Skills dominadas'} value={ESTADISTICAS.skillsDominadas} />
      </div>

      <div className="eyebrow" style={{ marginBottom: 12 }}>{kids ? 'Tus medallas' : 'Logros'}</div>
      <div className="grid stack-sm" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {LOGROS.map(l => {
          const Ic = ICONOS_LOGRO[l.icono] || IconStar;
          return (
            <div key={l.id} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center', opacity: l.hecho ? 1 : 0.85 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: l.hecho ? 'var(--warn-soft)' : 'var(--surface-2)', color: l.hecho ? 'var(--warn)' : 'var(--faint)' }}><Ic size={22} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{l.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{l.desc}</div>
                {!l.hecho && l.progreso != null && <div style={{ marginTop: 8 }}><Progress value={l.progreso} tone="var(--warn)" h={5} /></div>}
              </div>
              {l.hecho && <IconCheck size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EstTile({ Icon, label, value }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <Icon size={18} style={{ color: 'var(--muted)' }} />
      <div className="display" style={{ fontSize: 30, marginTop: 10 }}>{value}</div>
      <div className="eyebrow" style={{ marginTop: 2 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { VistaPractica, VistaDiagnostico, VistaProgreso });
