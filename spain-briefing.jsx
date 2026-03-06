import { useState, useEffect, useRef } from "react";

const TRIP = [
  {
    date: "2026-03-20", day: "Friday", city: "Miami", emoji: "🇺🇸", tag: "Departure Day",
    hotel: null, flights: [{ code: "AA112", from: "MIA", to: "BCN" }], trains: [],
    events: [{ time: "4:15 PM", icon: "✈️", title: "AA 112 departs MIA → BCN", note: "Seats 19A, 19B, 19C · Conf IFEXMM" }],
    coords: { lat: 25.77, lon: -80.19 },
    reminders: ["✅ Double-check passports tonight", "✅ Print/screenshot all confirmations", "✅ Notify bank of travel dates", "✅ Charge all devices + download offline maps", "✅ Check AA app for gate info 24hrs before"],
  },
  {
    date: "2026-03-21", day: "Saturday", city: "Barcelona", emoji: "🏙️", tag: "Arrival Day",
    hotel: "HCC St. Moritz · Diputació 262-264, Eixample",
    flights: [{ code: "AA112", from: "MIA", to: "BCN" }], trains: [],
    events: [
      { time: "6:05 AM", icon: "✈️", title: "AA 112 arrives Barcelona–El Prat", note: "Conf IFEXMM" },
      { time: "10:50 AM", icon: "⏰", title: "Leave for Sagrada Família meeting point", note: "Meet 10 min before tour" },
      { time: "11:00 AM", icon: "🎟️", title: "Sagrada Família Guided Tour", note: "Ref 1365576215 · Viator" },
      { time: "2:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "HCC St. Moritz · Conf 6091140659" },
    ],
    coords: { lat: 41.38, lon: 2.17 },
    reminders: ["🎟️ Sagrada Família at 11AM — meet 10 min early at the entrance", "🚕 Airport to hotel: taxi ~35 min or Aerobus to Passeig de Gràcia", "💶 Get euros at airport ATM (better rate than exchange booth)", "📱 Enable international data or buy a local SIM at airport", "😴 You'll be jet-lagged — power through until 9PM local time"],
  },
  {
    date: "2026-03-22", day: "Sunday", city: "Barcelona", emoji: "🏙️", tag: "Barcelona Day 2",
    hotel: "HCC St. Moritz · Diputació 262-264, Eixample",
    flights: [], trains: [],
    events: [{ time: "All day", icon: "🗺️", title: "Explore Barcelona", note: "Gothic Quarter · Barceloneta · Park Güell" }],
    coords: { lat: 41.38, lon: 2.17 },
    reminders: ["🏛️ Park Güell: timed entry required — book online or at machines", "🏖️ Barceloneta beach is 20 min walk from Gothic Quarter", "🔒 Watch for pickpockets in Las Ramblas and Gothic Quarter", "🚇 T-Casual metro card (10 trips) is best value", "🥘 Sunday lunch: many local restaurants do special menú del día"],
  },
  {
    date: "2026-03-23", day: "Monday", city: "Zaragoza", emoji: "🏛️", tag: "Travel Day",
    hotel: "Catalonia El Pilar · Manifestación 16",
    flights: [], trains: [{ code: "AVE 03112", from: "Barcelona-Sants", to: "Zaragoza Delicias", locator: "5WMXVS" }],
    events: [
      { time: "9:30 AM", icon: "🚕", title: "Taxi to Barcelona-Sants station", note: "Check out by 9:00 AM" },
      { time: "11:00 AM", icon: "🚄", title: "AVE 03112 departs Barcelona-Sants", note: "Seats 04A/B/C · Car 3 · Locator 5WMXVS" },
      { time: "12:28 PM", icon: "🏁", title: "Arrive Zaragoza Delicias", note: "Taxi to hotel ~10 min" },
      { time: "3:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "Catalonia El Pilar · Conf 6101844399" },
    ],
    coords: { lat: 41.65, lon: -0.88 },
    reminders: ["🚄 Leave hotel by 9:30AM sharp — taxi takes ~20 min to Sants", "🎫 Screenshot Renfe locator 5WMXVS — have it ready", "🕌 Aljafería Palace: check Monday hours before going", "🌆 Plaza del Pilar at sunset is the highlight of Zaragoza", "🍷 Aragón is famous for Garnacha wine — try it with dinner"],
  },
  {
    date: "2026-03-24", day: "Tuesday", city: "Madrid", emoji: "👑", tag: "Travel Day",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    flights: [], trains: [{ code: "AVE 03304", from: "Zaragoza Delicias", to: "Madrid Atocha", locator: "VRNV7L" }],
    events: [
      { time: "10:45 AM", icon: "🚕", title: "Taxi to Zaragoza Delicias", note: "Check out by 10:30 AM · Drop bags first" },
      { time: "11:43 AM", icon: "🚄", title: "AVE 03304 departs Zaragoza Delicias", note: "Seats 5A/B/C · Car 3 · Locator VRNV7L" },
      { time: "1:44 PM", icon: "🏁", title: "Arrive Madrid Puerta de Atocha", note: "Taxi to hotel ~10 min" },
      { time: "3:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "Lujo en el Centro · Conf 6175087861" },
    ],
    coords: { lat: 40.42, lon: -3.7 },
    reminders: ["🚄 Renfe locator VRNV7L — screenshot before leaving hotel", "🏨 Hotel won't be ready until 3PM — drop bags then walk to Mercado de San Miguel (5 min)", "🍽️ First Madrid dinner tonight — make it memorable", "🗺️ Your hotel is perfectly central — everything walkable"],
  },
  {
    date: "2026-03-25", day: "Wednesday", city: "Madrid", emoji: "👑", tag: "Madrid Day 2",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    flights: [], trains: [],
    events: [
      { time: "Morning", icon: "🎨", title: "Museo del Prado", note: "Book tickets in advance · Allow 2-3 hours" },
      { time: "Afternoon", icon: "🌳", title: "Parque del Retiro", note: "10 min walk from Prado · Palacio de Cristal inside" },
      { time: "Evening", icon: "🌇", title: "Rooftop sunset", note: "Azotea del Círculo or Torre de Madrid" },
    ],
    coords: { lat: 40.42, lon: -3.7 },
    reminders: ["🎨 Prado is free Mon–Sat after 6PM — but arrives crowded", "🚣 Rent a rowboat on Retiro lake (~€6) — fun for the family", "🌆 Azotea del Círculo: call ahead for reservations", "🍫 Chocolatería San Ginés is open 24hrs — late night churros con chocolate"],
  },
  {
    date: "2026-03-26", day: "Thursday", city: "Madrid", emoji: "👑", tag: "Madrid Day 3 — Segovia?",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    flights: [], trains: [],
    events: [
      { time: "8:55 AM", icon: "🚄", title: "Suggested: AVE to Segovia from Atocha", note: "~30 min · ~€12 each way · Book at Renfe.com" },
      { time: "All day", icon: "🏰", title: "Segovia — Aqueduct + Alcázar + cochinillo", note: "Full day trip recommended" },
      { time: "6:00 PM", icon: "🏙️", title: "Return to Madrid", note: "Evening free" },
    ],
    coords: { lat: 40.42, lon: -3.7 },
    reminders: ["🏰 Segovia Alcázar: book online to skip the queue", "🐷 Must eat: cochinillo asado (roast suckling pig) — Mesón de Cándido is the classic spot", "🚄 Last train back from Segovia around 9PM — plenty of flexibility", "📸 Roman aqueduct is free and jaw-dropping — walk the full length"],
  },
  {
    date: "2026-03-27", day: "Friday", city: "Madrid", emoji: "👑", tag: "Last Full Day",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    flights: [], trains: [],
    events: [
      { time: "Morning", icon: "👑", title: "Royal Palace + Almudena Cathedral", note: "Book palace tickets at patrimonio.es" },
      { time: "Afternoon", icon: "🛍️", title: "Gran Vía + Salamanca district", note: "Last chance for souvenirs and shopping" },
      { time: "Evening", icon: "🥂", title: "Farewell dinner", note: "Make it special — last night in Spain!" },
    ],
    coords: { lat: 40.42, lon: -3.7 },
    reminders: ["👑 Royal Palace: verify it's open — sometimes closed for official events", "🛍️ El Corte Inglés on Callao for last-minute gifts", "🥂 Book tonight's restaurant in advance — last night deserves it", "📦 Pack tonight — flight tomorrow at 4:25PM, check-out at 11AM"],
  },
  {
    date: "2026-03-28", day: "Saturday", city: "Madrid", emoji: "✈️", tag: "Departure Day",
    hotel: null, flights: [{ code: "IB337", from: "MAD", to: "MIA" }], trains: [],
    events: [
      { time: "11:00 AM", icon: "🏨", title: "Hotel check-out", note: "Lujo en el Centro — can hold bags if needed" },
      { time: "1:30 PM", icon: "🚇", title: "Head to Barajas Airport T4", note: "Metro Line 8 from Nuevos Ministerios ~30 min · ~€5" },
      { time: "4:25 PM", icon: "✈️", title: "IB 337 departs MAD → MIA", note: "Arrives 9:45 PM EDT · Conf IFEXMM" },
    ],
    coords: { lat: 40.42, lon: -3.7 },
    reminders: ["✈️ Online check-in opens 24hrs before — do it tonight", "🚇 Metro Line 8 to T4: buy ticket at Nuevos Ministerios station", "🏨 Hotel can store luggage after 11AM checkout if you need it", "☕ Last café con leche at the airport — you earned it", "🛃 Non-EU passports: use e-passport gates if available at BCN/MAD"],
  },
];

const MADRID_RESTAURANTS = [
  { name: "El Tormo", rating: 4.8, price: "$$", notes: "Castilian/La Mancha. Ring doorbell to enter. Reservations essential. Closed Mon–Tue.", url: "https://eltormorestaurante.com/" },
  { name: "La Mi Venta", rating: 4.7, price: "$$", notes: "Family-owned since 1962. Callos a la madrileña, paella marinera.", url: "https://www.lamiventa.com/en/" },
  { name: "Gozar Neotaberna", rating: 4.7, price: "$", notes: "Creative Spanish — torreznos with satay, ensaladilla with fried egg.", url: "https://somosdegozar.com/" },
  { name: "El Minibar", rating: 4.7, price: "$", notes: "Croquetas, tuna tataki, bacalao con gambones. Open until 2AM.", url: "https://maps.google.com/?q=El+Minibar+Madrid" },
  { name: "Casa Benigna", rating: 4.7, price: "$$$", notes: "Polished Chamartín gem. Excellent wine list.", url: "https://casabenigna.com/" },
  { name: "La Menina Taberna", rating: 4.5, price: "$$", notes: "Barrio de las Letras. Brioche de gambas, jamón ibérico.", url: "https://tabernalamenina.com/" },
  { name: "Taberna El Sur", rating: 4.5, price: "$", notes: "Grilled octopus, chipirones, patatas bravas. Arrive before 7PM.", url: "https://maps.google.com/?q=Taberna+El+Sur+Madrid" },
  { name: "La Vaca y La Huerta", rating: 4.4, price: "$$$", notes: "Quality meat + seasonal veg. Steak tartar, aged beef. Reserve ahead.", url: "https://lavacaylahuerta.com/" },
  { name: "VALDEMESO", rating: 4.3, price: "$", notes: "Classic tapas from 8AM. Cocido madrileño, bocadillo de calamares.", url: "https://valdemeso.es/" },
  { name: "Chocolatería San Ginés", rating: 4.4, price: "$", notes: "Legendary churros con chocolate. Open 24hrs since 1894.", url: "https://www.chocolateriasangines.com/" },
  { name: "Mercado de San Miguel", rating: 4.4, price: "$$", notes: "Iconic covered market. Tapas, wine, jamón. Best late morning or early evening.", url: "https://www.mercadodesanmiguel.es/en/" },
  { name: "Calle 365 Discoteca", rating: 4.8, price: "$$", notes: "Stylish nightclub — cocktails, tacos, live performances. Opens 6PM.", url: "https://calle365madrid.com" },
  { name: "La Negra Tomasa", rating: 4.1, price: "$$", notes: "Cuban/Creole. Live music daily, mojitos. More vibe than food.", url: "https://www.lanegratomasa.com" },
  { name: "Cuando Salí de Cuba", rating: 4.2, price: "$$", notes: "Cuban, Caribbean. Good menú del día. Authentic Cuban flavor.", url: "https://cuando-sali-de-cuba.eatbu.com" },
  { name: "Revoltosa Taberna", rating: 4.3, price: "$$", notes: "Traditional Madrid taberna. Classic raciones.", url: "https://maps.google.com/?q=Revoltosa+taberna+para+gatos+Madrid" },
  { name: "La Vinoteca", rating: 4.2, price: "$$", notes: "Known for torreznos. Classic Madrid wine bar.", url: "https://maps.google.com/?q=La+Vinoteca+Calle+del+Principe+Madrid" },
];

const MADRID_ROOFTOPS = [
  { name: "Azotea del Círculo", notes: "Panoramic views. Reservations recommended.", url: "https://www.circulobellasartes.com/azotea/" },
  { name: "Torre de Madrid Rooftop", notes: "360° views. Book in advance.", url: "https://torremadrid.es/en/" },
  { name: "El Jardín de Diana", notes: "Gran Vía 31. Rooftop garden. Reservations recommended.", url: "https://maps.google.com/?q=El+Jardin+de+Diana+Gran+Via+Madrid" },
  { name: "Sky 44 Melía Castilla", notes: "Gran Vía 44. Skyline views. Reservations recommended.", url: "https://maps.google.com/?q=Sky+44+Melia+Castilla+Madrid" },
];

function getWeatherEmoji(c) { return c<=1?"☀️":c<=3?"⛅":c<=48?"🌫️":c<=67?"🌧️":c<=77?"❄️":c<=82?"🌦️":"⛈️"; }
function getWeatherDesc(c) { return c===0?"Clear sky":c<=2?"Partly cloudy":c<=3?"Overcast":c<=48?"Foggy":c<=55?"Drizzle":c<=67?"Rain":c<=77?"Snow":c<=82?"Showers":"Thunderstorm"; }
function getTodayIndex() { const t=new Date().toISOString().split("T")[0]; const i=TRIP.findIndex(d=>d.date===t); return i>=0?i:0; }

async function callClaude(messages, system) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await resp.json();
  return data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
}

export default function SpainBriefing() {
  const [dayIdx, setDayIdx] = useState(getTodayIndex());
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [alerts, setAlerts] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [activeTab, setActiveTab] = useState("briefing");
  const chatEndRef = useRef(null);
  const day = TRIP[dayIdx];

  useEffect(() => {
    setBriefing(null); setAlerts(null); setChatMessages([]); setActiveTab("briefing"); setWeather(null);
    if (!day.coords) return;
    setLoadingWeather(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${day.coords.lat}&longitude=${day.coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=16`)
      .then(r => r.json()).then(data => {
        const i = data.daily.time.findIndex(t => t === day.date);
        if (i >= 0) setWeather({ emoji: getWeatherEmoji(data.daily.weathercode[i]), desc: getWeatherDesc(data.daily.weathercode[i]), high: Math.round(data.daily.temperature_2m_max[i]), low: Math.round(data.daily.temperature_2m_min[i]) });
        setLoadingWeather(false);
      }).catch(() => setLoadingWeather(false));
  }, [dayIdx]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const systemPrompt = `You are a luxury travel concierge for the Cantillo family — John (54, BJJ brown belt, fluent Spanish/English), Aymara, and Maria Elena — on a Spain trip March 20–28 2026.

Today: ${day.day} ${day.date}, City: ${day.city} (${day.tag})
${weather ? `Weather: ${weather.emoji} ${weather.high}°F/${weather.low}°F, ${weather.desc}` : ""}
Schedule: ${day.events.map(e => `${e.time}: ${e.title}`).join("; ")}
${day.trains.length ? `Trains: ${day.trains.map(t => `${t.code} ${t.from}→${t.to} locator ${t.locator}`).join("; ")}` : ""}
${day.flights.length ? `Flights: ${day.flights.map(f => `${f.code} ${f.from}→${f.to}`).join("; ")}` : ""}
${day.city === "Madrid" ? `Madrid restaurants:\n${MADRID_RESTAURANTS.map(r => `${r.name} (${r.rating}★ ${r.price}): ${r.notes}`).join("\n")}\nRooftops: ${MADRID_ROOFTOPS.map(r => r.name).join(", ")}` : ""}

You have web search. Use it for live info: disruptions, reviews, closures, news. Be warm, concise, and specific. Respond in English unless John writes in Spanish.`;

  async function fetchBriefing() {
    setLoadingBriefing(true); setBriefing(null);
    try {
      const text = await callClaude([{ role: "user", content: `Create a personalized daily briefing for today in JSON. Return ONLY valid JSON:\n{"morning":{"suggestion":"...","why":"..."},"lunch":{"suggestion":"...","why":"..."},"dinner":{"suggestion":"...","why":"..."},"evening":{"suggestion":"...","why":"..."},"tip":"..."}` }], systemPrompt);
      const clean = text.replace(/```json|```/g, "").trim();
      setBriefing(JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1)));
    } catch { setBriefing({ error: "Could not load. Try again." }); }
    setLoadingBriefing(false);
  }

  async function fetchAlerts() {
    setLoadingAlerts(true); setAlerts(null);
    const trains = day.trains.map(t => t.code).join(", ");
    const flights = day.flights.map(f => f.code).join(", ");
    try {
      const text = await callClaude([{ role: "user", content: `Search for travel alerts for ${day.date} in ${day.city} Spain. Check:${trains ? ` Renfe service alerts for ${trains}.` : ""}${flights ? ` Flight status for ${flights}.` : ""} Any strikes, protests, transport disruptions, or major closures in ${day.city} around ${day.date}. Summarize in bullet points. If nothing found, say so clearly.` }], systemPrompt);
      setAlerts(text);
    } catch { setAlerts("Could not fetch. Check Renfe.com and FlightAware directly."); }
    setLoadingAlerts(false);
  }

  async function sendChat() {
    if (!chatInput.trim() || loadingChat) return;
    const userMsg = chatInput.trim(); setChatInput("");
    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages); setLoadingChat(true);
    try {
      const text = await callClaude(newMessages, systemPrompt);
      setChatMessages([...newMessages, { role: "assistant", content: text }]);
    } catch { setChatMessages([...newMessages, { role: "assistant", content: "Sorry, try again." }]); }
    setLoadingChat(false);
  }

  const G = "#d4a843"; const DIM = "#8a9980"; const LIGHT = "#f0e0c0";
  const card = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 12, padding: "14px 18px", marginBottom: 10 };
  const label = { fontSize: 10, letterSpacing: 3, color: G, textTransform: "uppercase", marginBottom: 8 };
  const btn = (active, extra = {}) => ({ padding: "9px 16px", borderRadius: 20, border: `1px solid ${active ? G : "rgba(212,168,67,0.25)"}`, background: active ? G : "rgba(212,168,67,0.08)", color: active ? "#0f1923" : G, fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: active ? "bold" : "normal", transition: "all 0.2s", ...extra });

  const tabs = [
    { id: "briefing", label: "📋 Daily Picks" },
    { id: "alerts", label: "🚨 Live Alerts" },
    { id: "chat", label: "💬 Ask Concierge" },
    { id: "reminders", label: "🎫 Reminders" },
    ...(day.city === "Madrid" ? [{ id: "restaurants", label: "🍽️ Restaurants" }] : []),
  ];

  const quickQuestions = [
    "What's the best dinner pick tonight and why?",
    "Search recent reviews for El Tormo",
    "Any transport disruptions today?",
    "What's within walking distance of my hotel right now?",
    "I'm not in the mood for Spanish food — alternatives?",
  ];

  return (
    <div style={{ fontFamily: "Georgia,'Times New Roman',serif", minHeight: "100vh", background: "linear-gradient(135deg,#0f1923 0%,#1a2d3d 50%,#0f1923 100%)", color: "#e8d5b0" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 14px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: G, textTransform: "uppercase", marginBottom: 6 }}>España · March 2026</div>
          <div style={{ fontSize: 24, fontWeight: "bold", color: LIGHT }}>🇪🇸 Daily Briefing</div>
        </div>

        {/* Day pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 18, scrollbarWidth: "none" }}>
          {TRIP.map((d, i) => (
            <button key={d.date} onClick={() => setDayIdx(i)} style={btn(i === dayIdx, { flexShrink: 0, lineHeight: 1.4 })}>
              {d.date.slice(5).replace("-", "/")}<br /><span style={{ fontSize: 10, opacity: 0.8 }}>{d.city.slice(0,3).toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Day header */}
        <div style={{ background: "linear-gradient(135deg,rgba(212,168,67,0.12),rgba(192,57,43,0.08))", border: "1px solid rgba(212,168,67,0.25)", borderRadius: 16, padding: "18px 22px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: LIGHT }}>{day.emoji} {day.day}, {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>
              <div style={{ fontSize: 13, color: G, marginTop: 3 }}>{day.city} · <span style={{ color: DIM }}>{day.tag}</span></div>
              {day.hotel && <div style={{ fontSize: 11, color: DIM, marginTop: 5 }}>🏨 {day.hotel}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              {loadingWeather ? <div style={{ fontSize: 11, color: DIM }}>…</div>
                : weather ? <><div style={{ fontSize: 26 }}>{weather.emoji}</div><div style={{ fontSize: 13, fontWeight: "bold" }}>{weather.high}°/{weather.low}°F</div><div style={{ fontSize: 11, color: DIM }}>{weather.desc}</div></>
                : <div style={{ fontSize: 20 }}>🌍</div>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 14 }}>
          <div style={label}>Today's Schedule</div>
          {day.events.map((ev, i) => (
            <div key={i} style={{ ...card, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>{ev.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: LIGHT }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: G, flexShrink: 0 }}>{ev.time}</div>
                </div>
                {ev.note && <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{ev.note}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={btn(activeTab === t.id, { padding: "7px 13px", fontSize: 11 })}>{t.label}</button>)}
        </div>

        {/* BRIEFING TAB */}
        {activeTab === "briefing" && <>
          {!briefing && !loadingBriefing && <button onClick={fetchBriefing} style={btn(true, { width: "100%", padding: "13px", fontSize: 13, marginBottom: 12 })}>✨ Get Today's AI Picks</button>}
          {loadingBriefing && <div style={{ ...card, textAlign: "center", color: DIM, fontStyle: "italic", padding: 24 }}>Crafting your picks…</div>}
          {briefing && !briefing.error && <>
            {[["morning","🌅","Morning"],["lunch","🍽️","Lunch"],["dinner","🥂","Dinner"],["evening","🌙","Evening"]].map(([k,ic,lb]) => briefing[k] && (
              <div key={k} style={card}>
                <div style={label}>{ic} {lb}</div>
                <div style={{ fontSize: 14, color: LIGHT, fontWeight: "bold", marginBottom: 4 }}>{briefing[k].suggestion}</div>
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.5 }}>{briefing[k].why}</div>
              </div>
            ))}
            {briefing.tip && <div style={{ ...card, background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
              <div style={label}>🎯 Insider Tip</div>
              <div style={{ fontSize: 13, color: "#ddd0b8", lineHeight: 1.6 }}>{briefing.tip}</div>
            </div>}
            <button onClick={fetchBriefing} style={btn(false, { fontSize: 11, marginTop: 4 })}>↻ Refresh</button>
          </>}
          {briefing?.error && <div style={{ color: "#c0392b", fontSize: 13 }}>{briefing.error}</div>}
        </>}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && <>
          <div style={{ ...card, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", marginBottom: 12, fontSize: 12, color: DIM, lineHeight: 1.6 }}>
            Searches live for Renfe disruptions, flight status, strikes, closures, and local news in {day.city} for {day.date}.
          </div>
          {!alerts && !loadingAlerts && <button onClick={fetchAlerts} style={btn(true, { width: "100%", padding: "13px", fontSize: 13 })}>🔍 Check Live Alerts for {day.city}</button>}
          {loadingAlerts && <div style={{ ...card, textAlign: "center", color: DIM, fontStyle: "italic", padding: 24 }}>Searching for disruptions and closures…</div>}
          {alerts && <>
            <div style={card}>
              <div style={label}>🚨 Live Alerts — {day.city}</div>
              <div style={{ fontSize: 13, color: "#ddd0b8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{alerts}</div>
            </div>
            <button onClick={fetchAlerts} style={btn(false, { fontSize: 11 })}>↻ Refresh</button>
          </>}
        </>}

        {/* CHAT TAB */}
        {activeTab === "chat" && <>
          <div style={{ ...card, background: "rgba(212,168,67,0.05)", marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: DIM, lineHeight: 1.6 }}>Ask anything — restaurant questions, live reviews, directions, alternatives, local tips. Your concierge has web search and knows your full itinerary.</div>
          </div>
          {chatMessages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {quickQuestions.map((q, i) => <button key={i} onClick={() => setChatInput(q)} style={btn(false, { textAlign: "left", borderRadius: 10, fontSize: 12 })}>{q}</button>)}
            </div>
          )}
          <div style={{ maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.role === "user" ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${msg.role === "user" ? "rgba(212,168,67,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: msg.role === "user" ? LIGHT : "#ddd0b8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
            ))}
            {loadingChat && <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 12, fontSize: 13, color: DIM, fontStyle: "italic" }}>Searching and thinking…</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask your concierge anything…" style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1px solid rgba(212,168,67,0.3)", background: "rgba(255,255,255,0.05)", color: LIGHT, fontSize: 13, fontFamily: "Georgia,serif", outline: "none" }} />
            <button onClick={sendChat} disabled={loadingChat || !chatInput.trim()} style={btn(true, { flexShrink: 0, opacity: (!chatInput.trim() || loadingChat) ? 0.5 : 1 })}>Send</button>
          </div>
        </>}

        {/* REMINDERS TAB */}
        {activeTab === "reminders" && <>
          <div style={label}>🎫 Today's Reminders</div>
          {day.reminders.map((r, i) => <div key={i} style={{ ...card, fontSize: 13, color: "#ddd0b8", lineHeight: 1.6 }}>{r}</div>)}
        </>}

        {/* RESTAURANTS TAB */}
        {activeTab === "restaurants" && day.city === "Madrid" && <>
          <div style={label}>🍽️ Madrid Restaurants</div>
          {MADRID_RESTAURANTS.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ ...card, display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: LIGHT, fontWeight: "bold" }}>{r.name}</div>
                <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{r.notes}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: G }}>★ {r.rating}</div>
                <div style={{ fontSize: 11, color: "#5a7a58" }}>{r.price}</div>
              </div>
            </a>
          ))}
          <div style={{ ...label, marginTop: 16 }}>🌆 Rooftops</div>
          {MADRID_ROOFTOPS.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ ...card, display: "block", textDecoration: "none", color: "inherit" }}>
              <div style={{ fontSize: 13, color: LIGHT, fontWeight: "bold" }}>{r.name}</div>
              <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{r.notes}</div>
            </a>
          ))}
        </>}

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 10, color: "#2a3a2a", letterSpacing: 3 }}>SPAIN 2026 · CANTILLO FAMILY</div>
      </div>
    </div>
  );
}
