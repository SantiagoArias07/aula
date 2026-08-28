// views3.jsx — Tutor IA (chat), Ayuda, Cuenta

const { useState: v3State, useEffect: v3Effect, useRef: v3Ref } = React;

// ─────────────────────────────────────────────────────────────────────
// TUTOR IA
// ─────────────────────────────────────────────────────────────────────
function respuestaTutor(texto) {
  const t = texto.toLowerCase();
  if (t.includes('contar') || t.includes('cuántos') || t.includes('cuantos')) return { pasos: [
    "¡Contar es facilísimo! 😄", "Toca cada cosa con el dedo y di un número.", "Empieza en 1 y sigue: 1, 2, 3, 4…", "El último número que dices es cuántas hay.", "¿Quieres que contemos algo juntos?" ] };
  if (t.includes('mitad') || t.includes('medio')) return { pasos: [
    "La mitad es partir algo en 2 partes iguales. 🍫", "Si parto un chocolate en 2 y tomo 1, eso es 1/2.", "1/2 se lee 'un medio'.", "¿Te muestro con una pizza?" ] };
  if (t.includes('grande') || t.includes('mayor') || t.includes('menos') || t.includes('menor')) return { pasos: [
    "Para comparar, mira dónde hay MÁS cositas.", "El grupo con más es el mayor; el de menos es el menor.", "Ejemplo: 🍎🍎🍎 tiene más que 🍎🍎.", "¿Comparamos dos números?" ] };
  if (t.includes('fracc') || /\d+\/\d+/.test(t)) return { pasos: [
    "Con fracciones el truco casi siempre es el denominador (el de abajo).", "Si son iguales, sumas o restas solo los de arriba.", "Si son distintos, busca un denominador común y convierte cada fracción.", "Ya con el mismo denominador, operas los numeradores y simplificas.", "Mándame la fracción exacta y la resolvemos paso por paso. 🙂" ] };
  if (t.includes('despej') || t.includes('ecuac') || t.includes(' x') || t === 'x') return { pasos: [
    "Despejar x es dejarla sola de un lado del igual.", "Lo que suma pasa restando; lo que resta pasa sumando.", "Lo que multiplica pasa dividiendo, y al revés.", "Ejemplo: en x + 7 = 12, el 7 pasa restando: x = 12 − 7 = 5.", "¿Me pasas tu ecuación?" ] };
  if (t.includes('negativ') || t.includes('entero') || t.includes('signo')) return { pasos: [
    "Imagina una recta: a la derecha crece, a la izquierda baja del cero.", "Sumar = moverte a la derecha; restar = a la izquierda.", "Dos negativos que se suman se hacen más negativos: −4 + (−6) = −10.", "Un negativo más un positivo: te acercas al cero. −5 + 12 = 7.", "Dime tu operación y la caminamos juntos." ] };
  if (t.includes('porcent') || t.includes('%')) return { pasos: [
    "Un porcentaje es 'de cada 100'. El 20% es 20/100 = 0.2.", "Para el 20% de un número, multiplícalo por 0.2.", "Ejemplo: 20% de 150 = 150 × 0.2 = 30.", "¿De qué número lo quieres sacar?" ] };
  return { txt: "¡Con gusto te ayudo! Escríbeme el problema tal cual, o toca 📷 Escanear para tomarle foto. Dime también de qué tema es y lo resolvemos paso a paso, sin dártelo mascado. 💪" };
}

function VistaTutor({ tw }) {
  const kids = modoActivo() === 'kids';
  const nombreTutor = kids ? 'Ayudín' : 'Tutor Aula';
  const sugerencias = kids
    ? ['¿Cómo se cuenta?', '¿Qué es una mitad?', 'Ayúdame a sumar', '¿Cuál es más grande?']
    : TUTOR_SUGERENCIAS;

  const [mensajes, setMensajes] = v3State(TUTOR_SEMILLA);
  const [draft, setDraft] = v3State('');
  const [enviando, setEnviando] = v3State(false);
  const scrollRef = v3Ref();

  v3Effect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [mensajes, enviando]);

  const enviar = (textoDirecto) => {
    const txt = (textoDirecto ?? draft).trim();
    if (!txt || enviando) return;
    setMensajes(prev => [...prev, { mio: true, hora: 'ahora', txt }]);
    setDraft(''); setEnviando(true);
    setTimeout(() => { setMensajes(prev => [...prev, { mio: false, hora: 'ahora', ...respuestaTutor(txt) }]); setEnviando(false); }, 1400);
  };
  const escanear = () => {
    if (enviando) return;
    setMensajes(prev => [...prev, { mio: true, hora: 'ahora', txt: '📷 Foto del problema: 1/2 + 1/3' }]);
    setEnviando(true);
    setTimeout(() => { setMensajes(prev => [...prev, { mio: false, hora: 'ahora', pasos: [
      "¡Leí tu foto! Es 1/2 + 1/3. Vamos paso a paso:", "Denominadores distintos (2 y 3). El común es 6.", "Convierte: 1/2 = 3/6 y 1/3 = 2/6.", "Suma los de arriba: 3 + 2 = 5.", "Resultado: 5/6. ¿Quieres uno para practicar?" ] }]); setEnviando(false); }, 1600);
  };

  return (
    <div className="view">
      <SectionTitle eyebrow={kids ? 'Ayudín · tu amigo de mates' : 'Tutor de matemáticas · IA'}
        title={kids ? <>Pregúntale a <span className="serif-italic">Ayudín</span>.</> : <>Pregúntame lo que <span className="serif-italic">sea</span>.</>}
        subtitle={kids ? 'Te ayuda con dibujos y pasitos, con toda la paciencia del mundo.' : 'Te explico paso a paso, a tu ritmo. Nunca te doy la respuesta pelona.'}
      />

      <div className="card card-flush h-auto-sm" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 300px)', minHeight: 500, overflow: 'hidden', maxWidth: 820 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-soft)', color: 'var(--primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconBrain size={20} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{nombreTutor}</div>
            <div style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--accent)' }} />en línea · responde al instante
            </div>
          </div>
          <span className="pill pill-ghost mono" style={{ fontSize: 10 }}>IA</span>
        </div>

        <div ref={scrollRef} style={{ flex: 1, padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg)' }}>
          {mensajes.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: b.mio ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ background: b.mio ? 'var(--ink)' : 'var(--surface)', color: b.mio ? 'var(--bg)' : 'var(--ink)', border: b.mio ? 'none' : '1px solid var(--line)', padding: b.pasos ? '14px 16px' : '12px 16px', borderRadius: b.mio ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 14.5, lineHeight: 1.5 }}>
                  {b.pasos ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {b.pasos.map((p, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          {j === 0 || j === b.pasos.length - 1 ? <span style={{ marginTop: 1 }}><Expr>{p}</Expr></span> : (
                            <>
                              <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--primary-soft)', color: 'var(--primary-ink)', fontSize: 10.5, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{j}</span>
                              <span><Expr>{p}</Expr></span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <Expr>{b.txt}</Expr>}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4, textAlign: b.mio ? 'right' : 'left' }}>{b.hora}</div>
              </div>
            </div>
          ))}
          {enviando && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconBrain size={14} /></div>
              <span>{nombreTutor} está escribiendo</span>
              <span style={{ display: 'inline-flex', gap: 3 }}>
                <span className="dot-typing" style={{ animationDelay: '0s' }}>·</span><span className="dot-typing" style={{ animationDelay: '.15s' }}>·</span><span className="dot-typing" style={{ animationDelay: '.3s' }}>·</span>
              </span>
              <style>{`.dot-typing { animation: blink 1s infinite; font-size: 22px; line-height: 1; } @keyframes blink { 0%,100% { opacity: .3; } 50% { opacity: 1; } }`}</style>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '12px 14px 0', overflowX: 'auto' }}>
            {sugerencias.map((sg, i) => <button key={i} className="suger" onClick={() => enviar(sg)}>{sg}</button>)}
          </div>
          <div style={{ padding: 14, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <button className="icon-btn" onClick={escanear} aria-label="Escanear problema" title="Escanear problema" style={{ border: '1px solid var(--line-2)', flexShrink: 0 }}><IconCamera size={18} /></button>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              placeholder={kids ? 'Escribe tu duda…' : 'Escribe tu duda o un problema…'} rows={1}
              style={{ flex: 1, padding: '12px 14px', fontFamily: 'inherit', fontSize: 14, background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 12, color: 'var(--ink)', resize: 'none', minHeight: 44, maxHeight: 120 }} />
            <button className="btn btn-violet" onClick={() => enviar()} style={{ height: 44 }}><IconSend size={14} />Enviar</button>
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
      <SectionTitle eyebrow="Ayuda" title={<>¿En qué te <span className="serif-italic">echamos la mano</span>?</>}
        subtitle="Respuestas rápidas a lo que más se pregunta. Si no encuentras lo tuyo, escríbenos." />

      <div className="grid stack-sm" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
        {[
          { ic: <IconRoute size={18} />, t: 'Cómo funciona tu ruta', d: 'Diagnóstico, skills y desbloqueos' },
          { ic: <IconBrain size={18} />, t: 'Usar el tutor IA', d: 'Pistas, pasos y escanear problemas' },
          { ic: <IconWifiOff size={18} />, t: 'Practicar sin internet', d: 'Descarga y sincronización' },
        ].map((card, i) => (
          <a key={i} className="card" style={{ cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--line-2)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line)'}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{card.ic}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 21 }}>{card.t}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{card.d}</div>
            <div style={{ marginTop: 14, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-2)' }}>Ver guía <IconArrow size={12} /></div>
          </a>
        ))}
      </div>

      <div className="stack-sm" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Preguntas frecuentes</div>
          <div className="card card-flush">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <a onClick={() => setOpen(isOpen ? -1 : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'default', gap: 16 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 21 }}>{f.q}</span>
                    <span style={{ color: 'var(--muted)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}><IconChevD size={18} /></span>
                  </a>
                  {isOpen && <div style={{ padding: '0 24px 22px', color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.55 }}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="eyebrow">¿No encontraste lo tuyo?</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 23, marginTop: 6, lineHeight: 1.2 }}>Escríbenos directo.</div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 8 }}>Respondemos en menos de 4 horas en días hábiles.</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}><IconChat size={14} />Abrir conversación</button>
          </div>
          <div className="card">
            <div className="eyebrow">Para mamá, papá o tutor</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 10 }}>Recibe un resumen semanal del avance: qué domina, en qué va atrasado y cuánto practicó. En lenguaje claro.</p>
            <a className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Activar resumen familiar <IconArrow size={14} /></a>
          </div>
          <div className="card">
            <div className="eyebrow">Modo sin internet</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 10 }}>Descarga tu ruta con señal y practica offline. Tu avance se sincroniza al reconectar.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
              <IconWifi size={16} /><span style={{ fontSize: 13 }}>Conectado</span><span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>todo al día</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CUENTA
// ─────────────────────────────────────────────────────────────────────
function VistaCuenta({ cambiarNivel }) {
  const [tab, setTab] = v3State('perfil');
  return (
    <div className="view">
      <SectionTitle eyebrow="Cuenta" title={<><span className="serif-italic">Tu</span> cuenta.</>}
        subtitle="Tu información, tu nivel y cómo quieres que Aula trabaje contigo." />

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--line)', overflowX: 'auto' }}>
        {[['perfil', 'Perfil'], ['nivel', 'Nivel y ruta'], ['pref', 'Preferencias'], ['priv', 'Privacidad']].map(([id, label]) => (
          <a key={id} onClick={() => setTab(id)} style={{ padding: '10px 16px', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', color: tab === id ? 'var(--ink)' : 'var(--muted)', borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent', marginBottom: -1 }}>{label}</a>
        ))}
      </div>

      {tab === 'perfil' && (
        <div className="grid stack-sm" style={{ gridTemplateColumns: '320px 1fr', gap: 24 }}>
          <div className="card card-lg" style={{ textAlign: 'center' }}>
            <div style={{ width: 110, height: 110, borderRadius: 999, margin: '0 auto 16px', background: 'linear-gradient(135deg, #c9bcff, #5b3fdb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontFamily: 'var(--font-serif)' }}>{ESTUDIANTE.iniciales}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, lineHeight: 1.1 }}>{ESTUDIANTE.nombre}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--muted)' }}>{ESTUDIANTE.apellido}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              <span className="pill pill-primary" style={{ fontSize: 11 }}>{ESTUDIANTE.nivelLabel}</span>
              <span className="pill" style={{ fontSize: 11, background: 'var(--warn-soft)', color: 'var(--warn)' }}><IconFlame size={11} />{ESTUDIANTE.racha}</span>
            </div>
            <hr className="hr" style={{ margin: '20px 0' }} />
            <div className="eyebrow">Escuela</div>
            <div style={{ fontSize: 13.5, marginTop: 4 }}>{ESTUDIANTE.escuela}</div>
            <button className="btn btn-secondary" style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}>Cambiar foto</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-lg">
              <div className="eyebrow" style={{ marginBottom: 18 }}>Información</div>
              <div className="grid stack-sm" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <CuField label="Nombre(s)" value={ESTUDIANTE.nombre} />
                <CuField label="Apellidos" value={ESTUDIANTE.apellido} />
                <CuField label="Edad" value={`${ESTUDIANTE.edad} años`} />
                <CuField label="Correo" value={ESTUDIANTE.email} />
                <CuField label="Escuela" value={ESTUDIANTE.escuela} />
                <CuField label="Tutor / familiar" value={ESTUDIANTE.tutor} />
              </div>
            </div>
            <div className="card card-lg">
              <div className="eyebrow" style={{ marginBottom: 18 }}>Resumen académico</div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <CuStat label="Dominio" value={`${ESTUDIANTE.dominioGeneral}%`} />
                <CuStat label="Racha" value={ESTUDIANTE.racha} />
                <CuStat label="Temas" value={ESTADISTICAS.skillsDominadas} />
                <CuStat label="Precisión" value={`${ESTADISTICAS.precision}%`} />
              </div>
              <div style={{ marginTop: 18 }}>
                <Progress value={ESTUDIANTE.dominioGeneral} tone="var(--primary)" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  <span>Dominio de {ESTUDIANTE.nivelLabel}</span><span>meta: 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'nivel' && (
        <div style={{ maxWidth: 760 }}>
          <div className="card card-lg">
            <div className="eyebrow">Tu nivel escolar</div>
            <div className="display" style={{ fontSize: 26, marginTop: 6 }}>¿En qué grado vas?</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>Aula funciona desde preescolar hasta preparatoria. Al elegir tu etapa, la app se transforma y regenera tu ruta con los aprendizajes clave de ese nivel.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              {ETAPAS.map(e => (
                <button key={e.id} className="chip-etapa" data-on={e.id === ESTADO.nivel ? '1' : '0'} onClick={() => e.id !== ESTADO.nivel && cambiarNivel(e.id)}>
                  {e.emoji} {e.nombre} <span className="mono" style={{ opacity: .6, fontSize: 11 }}>· {e.grados}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card card-lg" style={{ marginTop: 16 }}>
            <div className="eyebrow">Qué cubre cada etapa</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
              {ETAPAS.map((e, i) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                  <Glyph color={e.color} size={38} radius={11}><span style={{ fontSize: 18 }}>{e.emoji}</span></Glyph>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500 }}>{e.nombre} <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>· {e.grados} · modo {e.modo === 'kids' ? 'niños' : 'estudiante'}</span></div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{e.desc}</div>
                  </div>
                  {e.id === ESTADO.nivel && <span className="pill pill-primary" style={{ fontSize: 10 }}>tu nivel</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'pref' && (
        <div className="card card-lg" style={{ maxWidth: 720 }}>
          <div className="eyebrow">Preferencias</div>
          <div className="display" style={{ fontSize: 26, marginTop: 6 }}>Cómo te tratamos</div>
          <hr className="hr" style={{ margin: '20px 0' }} />
          {[
            ['Idioma', 'Español (México)'],
            ['Meta diaria', `${ESTUDIANTE.objetivoDiario} problemas`],
            ['Recordatorio de práctica', 'Todos los días a las 6:00 pm'],
            ['Notificaciones en la app', 'Activadas'],
            ['Avísame cuando suba de nivel', 'Sí, siempre'],
            ['Datos móviles', 'Descargar solo en Wi-Fi'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 'none', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'right' }}>{v}</span>
                <a style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Cambiar</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'priv' && (
        <div className="card card-lg" style={{ maxWidth: 720 }}>
          <div className="eyebrow">Privacidad y seguridad</div>
          <div className="display" style={{ fontSize: 26, marginTop: 6 }}>Tu información, tus reglas</div>
          <hr className="hr" style={{ margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Contraseña', 'Actualizada hace 2 meses', 'Cambiar'],
              ['Compartir avance con mi familia', 'Resumen semanal', 'Ajustar'],
              ['Verificación en dos pasos', 'No activada · te la recomendamos', 'Activar'],
              ['Descargar mis datos', 'Una copia de todo tu avance', 'Descargar'],
              ['Eliminar cuenta', 'Si dejas de usar Aula', 'Solicitar'],
            ].map(([k, v, action], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none', gap: 12 }}>
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div><div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{v}</div></div>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', flexShrink: 0 }}>{action}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CuField({ label, value }) {
  return (<div><div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div><div style={{ fontSize: 14.5, color: 'var(--ink)' }}>{value}</div></div>);
}
function CuStat({ label, value }) {
  return (<div><div className="eyebrow">{label}</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginTop: 4 }}>{value}</div></div>);
}

Object.assign(window, { VistaTutor, VistaAyuda, VistaCuenta });
