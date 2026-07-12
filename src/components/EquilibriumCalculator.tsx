import { useMemo, useState } from 'react';

type Lang = 'en' | 'ru';
const R = 8.31446261815324;

export default function EquilibriumCalculator({ lang = 'en' }: { lang?: Lang }) {
  const [dh, setDh] = useState(-92.22);
  const [ds, setDs] = useState(-198.0);
  const [temp, setTemp] = useState(298.15);
  const [pressureNote, setPressureNote] = useState(false);
  const t = lang === 'ru' ? {
    dh:'Стандартная энтальпия ΔH°', ds:'Стандартная энтропия ΔS°', temp:'Температура T', calculate:'Результат', dg:'Энергия Гиббса ΔG°', k:'Константа равновесия K', direction:'Термодинамическое направление', products:'В стандартном состоянии продукты термодинамически предпочтительны.', reactants:'В стандартном состоянии реагенты термодинамически предпочтительны.', balance:'Система близка к равновесию.', transition:'Температура ΔG° = 0', chart:'Температурный профиль', assumptions:'Предположения', note:'Идеальное стандартное состояние; ΔH° и ΔS° считаются постоянными в диапазоне температур; теплоёмкости не учтены.', caution:'K безразмерна и относится к выбранным стандартным состояниям. Для реальных растворов и газов нужны активности или фугитивности.', invalid:'Введите физически допустимую температуру выше 0 K.'
  } : {
    dh:'Standard enthalpy ΔH°', ds:'Standard entropy ΔS°', temp:'Temperature T', calculate:'Result', dg:'Gibbs energy ΔG°', k:'Equilibrium constant K', direction:'Thermodynamic direction', products:'Products are thermodynamically favored in the standard state.', reactants:'Reactants are thermodynamically favored in the standard state.', balance:'The system is close to equilibrium.', transition:'Temperature where ΔG° = 0', chart:'Temperature profile', assumptions:'Assumptions', note:'Ideal standard state; ΔH° and ΔS° are constant over the temperature range; heat-capacity effects are neglected.', caution:'K is dimensionless and refers to the selected standard states. Real solutions and gases require activities or fugacities.', invalid:'Enter a physically valid temperature above 0 K.'
  };
  const result = useMemo(() => {
    if (!Number.isFinite(temp) || temp <= 0) return null;
    const dg = dh - temp * ds / 1000;
    const lnK = -dg * 1000 / (R * temp);
    const logK = lnK / Math.LN10;
    const transition = ds !== 0 ? dh * 1000 / ds : null;
    return { dg, lnK, logK, transition };
  }, [dh, ds, temp]);
  const points = useMemo(() => Array.from({length:41},(_,i)=>{const T=200+i*20; return {T,g:dh-T*ds/1000}}),[dh,ds]);
  const min = Math.min(...points.map(p=>p.g)), max=Math.max(...points.map(p=>p.g));
  const y=(g:number)=> 145-(g-min)/(max-min||1)*115;
  const path=points.map((p,i)=>`${i?'L':'M'} ${20+i*8.5} ${y(p.g)}`).join(' ');
  const kDisplay = result ? (result.logK > 308 ? '> 1e308' : result.logK < -308 ? '< 1e-308' : Math.exp(result.lnK).toExponential(4)) : '—';
  const verdict = !result ? t.invalid : Math.abs(result.dg)<.5 ? t.balance : result.dg<0 ? t.products : t.reactants;
  return <div className="tool-shell">
    <section className="inputs" aria-label="Thermodynamic inputs">
      <label>{t.dh}<span><input type="number" step="0.01" value={dh} onChange={e=>setDh(+e.target.value)}/><b>kJ mol⁻¹</b></span></label>
      <label>{t.ds}<span><input type="number" step="0.1" value={ds} onChange={e=>setDs(+e.target.value)}/><b>J mol⁻¹ K⁻¹</b></span></label>
      <label>{t.temp}<span><input type="number" min="0.01" step="0.01" value={temp} onChange={e=>setTemp(+e.target.value)}/><b>K</b></span></label>
      <button className="assumption-toggle" onClick={()=>setPressureNote(!pressureNote)} aria-expanded={pressureNote}>{t.assumptions} <b>{pressureNote?'−':'+'}</b></button>
      {pressureNote&&<div className="assumption"><p>{t.note}</p><p>{t.caution}</p></div>}
    </section>
    <section className="results" aria-live="polite"><p className="result-label">{t.calculate}</p>
      <div className="result-grid"><article><span>{t.dg}</span><strong>{result?result.dg.toFixed(3):'—'}</strong><small>kJ mol⁻¹</small></article><article><span>{t.k}</span><strong>{kDisplay}</strong><small>log₁₀K = {result?result.logK.toFixed(3):'—'}</small></article></div>
      <div className={`verdict ${result&&result.dg<0?'favorable':''}`}><b>{t.direction}</b><p>{verdict}</p></div>
      <div className="transition"><span>{t.transition}</span><b>{result?.transition && result.transition>0 ? `${result.transition.toFixed(2)} K` : '—'}</b></div>
      <div className="chart"><span>{t.chart}: ΔG°(T)</span><svg viewBox="0 0 380 170" role="img" aria-label={t.chart}><line x1="20" y1={y(0)} x2="360" y2={y(0)} className="zero"/><path d={path}/><text x="20" y="165">200 K</text><text x="325" y="165">1000 K</text><text x="24" y="18">ΔG°</text></svg></div>
    </section>
  </div>
}
