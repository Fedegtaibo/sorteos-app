import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, X } from 'lucide-react';
import { merchants, raffles, sold, reserved, selected, participations } from './data.js';

const money = (v) => `$${Number(v).toLocaleString('es-AR')}`;

function Shell({ page, setPage, children }) {
  const tabs = [
    { key: 'admin', label: '⚙️ Panel Admin', role: 'admin', color: 'red' },
    { key: 'merchant', label: '🏪 Panel Comercio', role: 'participante', color: 'yellow' },
    { key: 'detail', label: '🎯 Detalle Sorteo', role: 'participante', color: 'blue' },
    { key: 'checkout', label: '💳 Checkout', role: 'participante', color: 'blue' },
    { key: 'participations', label: '🎟️ Mis Participaciones', role: 'participante', color: 'blue' }
  ];
  return <main className="phone">
    <div className="viewer-top"><button><X size={32}/></button><b>sorteos-ui-screens</b><button><MoreHorizontal/></button></div>
    <nav className="topbar">
      <div className="brand"><span>🎯</span><b>Sorteos</b></div>
      <div className="tabs">{tabs.map(t => <button key={t.key} onClick={() => setPage(t.key)} className={`tab ${page===t.key?'active '+t.color:''}`}><span>{t.label}</span><em>{t.role}</em></button>)}</div>
    </nav>
    <section className="content">{children}</section>
  </main>
}

function Stat({ label, value, tone, sub }) { return <div className="stat"><span>{label}</span><strong className={tone}>{value}</strong>{sub && <small>{sub}</small>}</div> }
function Badge({ children, tone='green' }) { return <span className={`badge ${tone}`}>{children}</span> }
function Progress({ value }) { return <div className="progress"><i style={{width:`${value}%`}} /></div> }

function Admin(){return <>
  <div className="split-title"><div><p>PANEL DE ADMINISTRACIÓN</p><h1>Plataforma<br/>Sorteos</h1></div><div className="alert">● <b>1 comercio pendiente de aprobación</b></div></div>
  <div className="stats-row"><Stat label="COMERCIOS ACTIVOS" value="3" tone="green"/><Stat label="VOLUMEN OPERADO" value="$897K" tone="yellow"/><Stat label="COMISIONES GENERADAS" value="$66.960" tone="blue"/><Stat label="PENDIENTES DE APROBACIÓN" value="1" tone="yellow"/></div>
  <section className="card table"><h2>Comercios registrados</h2>{merchants.map(m=><div className="merchant-row" key={m.name}><div><b>{m.name}</b><small>CUIT: {m.cuit}</small></div><Badge tone={m.status==='aprobado'?'green':'yellow'}>{m.status}</Badge><p>{m.raffles}<br/>sorteos</p><b>{money(m.volume)}</b><span>{m.commission}</span></div>)}</section>
</>}

function Merchant(){return <>
  <div className="page-head"><div><p>PANEL DE COMERCIO</p><h1>Tech Store Córdoba</h1></div><button className="primary">+ Nuevo sorteo</button></div>
  <div className="stats-row three"><Stat label="RECAUDACIÓN TOTAL" value="$166.000" tone="yellow" sub="todos los sorteos"/><Stat label="COMISIÓN PLATAFORMA" value="$13.280" tone="red" sub="8% del total"/><Stat label="GANANCIA NETA" value="$152.720" tone="green" sub="92% del total"/></div>
  <div className="subtabs"><b>Sorteos</b><span>Participantes</span></div>
  <section className="card table raffle-table"><div className="headers"><span>SORTEO</span><span>NÚMEROS</span><span>RECAUDACIÓN</span><span>ESTADO</span></div>{raffles.map(r=><div className="raffle-row" key={r.title}><div><b>{r.title}</b><small>Fecha: {r.date}</small></div><div>{r.numbers}<Progress value={parseInt(r.numbers)/parseInt(r.numbers.split('/')[1])*100}/></div><b>{money(r.money)}</b><Badge tone={r.status==='activo'?'green':r.status==='borrador'?'blue':'dark'}>{r.status}</Badge></div>)}</section>
</>}

function NumberGrid({ compact=false }) {return <div className={`number-grid ${compact?'compact':''}`}>{Array.from({length:50},(_,i)=>i+1).map(n=>{let cls='free'; if(sold.includes(n)) cls='sold'; if(reserved.includes(n)) cls='reserved'; if(selected.includes(n)) cls='selected'; return <button key={n} className={`num ${cls}`}>{n}</button>})}</div>}

function Detail(){return <div className="detail-layout">
  <aside className="prize-card"><div className="hero">📱 <Badge>• ACTIVO</Badge></div><p>PREMIO</p><h1>iPhone 16 Pro Max 256GB</h1><div className="shop-dot">T <span>Tech Store Córdoba</span></div><p className="desc">Sorteo verificado. El ganador recibe el equipo sellado de fábrica con garantía oficial Apple de 1 año.</p><div className="sold-box"><div><span>Números vendidos</span><b>34/50</b></div><Progress value={68}/><div className="mini-stats"><Stat label="VALOR" value="$2.500"/><Stat label="DISPONIBLES" value="13"/><Stat label="RESERVADOS" value="3" tone="blue"/><Stat label="VENDIDOS" value="34" tone="green"/></div></div><div className="countdown"><p>FECHA DEL SORTEO</p><b>04</b><b>23</b><b>59</b><b>54</b><small>viernes, 12 de junio de 2026</small></div></aside>
  <section className="chooser"><h1>Elegí tu<br/>número</h1><p>Tocá un número libre para seleccionarlo</p><div className="filters"><button>Todos</button><button>Libres</button><button>Vendido</button><button>Reservado</button></div><div className="legend"><span>□ Libre</span><span className="yellow">□ Seleccionado</span><span className="green">□ Vendido</span><span className="blue">□ Reservado</span></div><NumberGrid compact/></section>
</div>}

function Checkout(){return <><button className="back"><ArrowLeft size={18}/>Volver</button><h1>Confirmar compra</h1><div className="steps"><b>1<small>Resumen</small></b><span/><i>2<small>Pago</small></i><span/><i>3<small>Confirmado</small></i></div><section className="card checkout"><h2>Detalle de la compra</h2>{selected.map(n=><div className="buy-row" key={n}><b>{n}</b><div>Número {n}<small>iPhone 16 Pro Max 256GB</small></div><strong>$2.500</strong></div>)}<div className="total"><b>Total</b><strong>$5.000</strong></div></section><section className="card form"><h2>Datos del comprador</h2><label>NOMBRE COMPLETO<input placeholder="Juan Pérez"/></label><label>EMAIL<input placeholder="tu@email.com"/></label><label>TELÉFONO (OPCIONAL)<input placeholder="+54 9 11 XXXX XXXX"/></label></section><button className="pay">Continuar al pago →</button></>}

function Participations(){return <><p>PARTICIPANTE</p><h1>Mis participaciones</h1><div className="parts">{participations.map((p,i)=><article className="part" key={p.title}><b className={p.state==='GANADOR'?'winner':p.state==='Activo'?'reserved':''}>{p.number}</b><div><h2>{p.title}</h2><p>{p.shop} · Número {p.number} ·<br/>{money(p.price)} · {p.date}</p></div><Badge tone={p.state==='GANADOR'?'yellow':p.state==='Activo'?'green':'dark'}>{p.state}</Badge><button>Comprobante</button></article>)}</div></>}

export default function App(){const [page,setPage]=useState('admin'); const pages={admin:<Admin/>,merchant:<Merchant/>,detail:<Detail/>,checkout:<Checkout/>,participations:<Participations/>}; return <Shell page={page} setPage={setPage}>{pages[page]}</Shell>}
