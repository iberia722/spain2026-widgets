import { useState, useEffect, useRef } from "react";

// ─── TRIP DATA ────────────────────────────────────────────────────────────────
const TRIP = [
  {
    date: "2026-03-20",
    day: "Friday",
    city: "Miami",
    emoji: "🇺🇸",
    tag: "Departure Day",
    hotel: null,
    events: [
      { time: "4:15 PM", icon: "✈️", title: "AA 112 departs MIA → BCN", note: "Seats 19A, 19B, 19C · Conf IFEXMM" },
    ],
    weatherCity: "Miami,US",
  },
  {
    date: "2026-03-21",
    day: "Saturday",
    city: "Barcelona",
    emoji: "🏙️",
    tag: "Arrival Day",
    hotel: "HCC St. Moritz · Diputació 262-264, Eixample",
    events: [
      { time: "6:05 AM", icon: "✈️", title: "AA 112 arrives Barcelona–El Prat", note: "Conf IFEXMM" },
      { time: "10:50 AM", icon: "⏰", title: "Leave for Sagrada Família meeting point", note: "Meet 10 min before tour" },
      { time: "11:00 AM", icon: "🎟️", title: "Sagrada Família Guided Tour", note: "Ref 1365576215 · Viator" },
      { time: "2:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "HCC St. Moritz" },
    ],
    weatherCity: "Barcelona,ES",
  },
  {
    date: "2026-03-22",
    day: "Sunday",
    city: "Barcelona",
    emoji: "🏙️",
    tag: "Barcelona Day 2",
    hotel: "HCC St. Moritz · Diputació 262-264, Eixample",
    events: [
      { time: "All day", icon: "🗺️", title: "Explore Barcelona", note: "Gothic Quarter, Barceloneta, Park Güell" },
    ],
    weatherCity: "Barcelona,ES",
  },
  {
    date: "2026-03-23",
    day: "Monday",
    city: "Zaragoza",
    emoji: "🏛️",
    tag: "Travel Day",
    hotel: "Catalonia El Pilar · Manifestación 16",
    events: [
      { time: "9:30 AM", icon: "🚕", title: "Taxi to Barcelona-Sants", note: "Check out by 9:00 AM" },
      { time: "11:00 AM", icon: "🚄", title: "AVE 03112 departs Barcelona-Sants", note: "Seats 04A/B/C Car 3 · Locator 5WMXVS" },
      { time: "12:28 PM", icon: "🏁", title: "Arrive Zaragoza Delicias", note: "Taxi to hotel ~10 min" },
      { time: "3:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "Catalonia El Pilar" },
    ],
    weatherCity: "Zaragoza,ES",
  },
  {
    date: "2026-03-24",
    day: "Tuesday",
    city: "Madrid",
    emoji: "👑",
    tag: "Travel Day",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    events: [
      { time: "10:45 AM", icon: "🚕", title: "Taxi to Zaragoza Delicias", note: "Check out by 10:30 AM · Drop bags first" },
      { time: "11:43 AM", icon: "🚄", title: "AVE 03304 departs Zaragoza Delicias", note: "Seats 5A/B/C Car 3 · Locator VRNV7L" },
      { time: "1:44 PM", icon: "🏁", title: "Arrive Madrid Puerta de Atocha", note: "Taxi to hotel ~10 min" },
      { time: "3:00 PM", icon: "🏨", title: "Hotel check-in opens", note: "Lujo en el Centro · Conf 6175087861" },
    ],
    weatherCity: "Madrid,ES",
  },
  {
    date: "2026-03-25",
    day: "Wednesday",
    city: "Madrid",
    emoji: "👑",
    tag: "Madrid Day 2",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    events: [
      { time: "All day", icon: "🗺️", title: "Explore Madrid", note: "Prado, Retiro Park, Puerta del Sol" },
    ],
    weatherCity: "Madrid,ES",
  },
  {
    date: "2026-03-26",
    day: "Thursday",
    city: "Madrid",
    emoji: "👑",
    tag: "Madrid Day 3",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    events: [
      { time: "All day", icon: "🚄", title: "Day trip to Segovia?", note: "~30 min by AVE from Atocha · Aqueduct + Alcázar" },
    ],
    weatherCity: "Madrid,ES",
  },
  {
    date: "2026-03-27",
    day: "Friday",
    city: "Madrid",
    emoji: "👑",
    tag: "Madrid Day 4",
    hotel: "Lujo en el Centro · Calle de San Agustín Segundo 15",
    events: [
      { time: "All day", icon: "🗺️", title: "Last full day in Madrid", note: "Royal Palace, Gran Vía, rooftop evening" },
    ],
    weatherCity: "Madrid,ES",
  },
  {
    date: "2026-03-28",
    day: "Saturday",
    city: "Madrid",
    emoji: "✈️",
    tag: "Departure Day",
    hotel: null,
    events: [
      { time: "11:00 AM", icon: "🏨", title: "Hotel check-out", note: "Lujo en el Centro" },
      { time: "4:25 PM", icon: "✈️", title: "IB 337 departs MAD → MIA", note: "Arrives 9:45 PM EDT · Conf IFEXMM" },
    ],
    weatherCity: "Madrid,ES",
  },
];

// ─── RESTAURANT DATA (from your Notion Madrid Places database) ────────────────
const MADRID_RESTAURANTS = [
  { name: "El Tormo", rating: 4.8, price: "$$", notes: "Castilian/La Mancha — atascaburras, migas. Ring doorbell to enter. Reservations essential.", url: "https://eltormorestaurante.com/" },
  { name: "La Mi Venta", rating: 4.7, price: "$$", notes: "Family-owned since 1962. Callos a la madrileña, paella marinera, strong wine list.", url: "https://www.lamiventa.com/en/" },
  { name: "Gozar Neotaberna", rating: 4.7, price: "$", notes: "Creative Spanish tavern — torreznos with satay, ensaladilla with fried egg.", url: "https://somosdegozar.com/" },
  { name: "El Minibar", rating: 4.7, price: "$", notes: "Croquetas, tuna tataki, bacalao con gambones. Open until 2AM.", url: "https://maps.google.com/?q=El+Minibar+Madrid" },
  { name: "Casa Benigna", rating: 4.7, price: "$$$", notes: "Polished neighborhood gem in Chamartín. Excellent wine list.", url: "https://casabenigna.com/" },
  { name: "La Menina Taberna", rating: 4.5, price: "$$", notes: "Cozy Barrio de las Letras taberna. Brioche de gambas, jamón ibérico.", url: "https://tabernalamenina.com/" },
  { name: "Taberna El Sur", rating: 4.5, price: "$", notes: "Grilled octopus, chipirones, patatas bravas. Arrive before 7PM.", url: "https://maps.google.com/?q=Taberna+El+Sur+Madrid" },
  { name: "La Vaca y La Huerta", rating: 4.4, price: "$$$", notes: "Quality meat + seasonal veg. Steak tartar, aged beef. Reservations wise.", url: "https://lavacaylahuerta.com/" },
  { name: "VALDEMESO", rating: 4.3, price: "$", notes: "Classic tapas all day from 8AM. Cocido madrileño, bocadillo de calamares.", url: "https://valdemeso.es/" },
  { name: "La Menina Taberna", rating: 4.5, price: "$$", notes: "Barrio de las Letras. Brioche de gambas, fine wines.", url: "https://tabernalamenina.com/" },
  { name: "Chocolatería San Ginés", rating: 4.4, price: "$", notes: "Legendary churros con chocolate. Open 24 hours since 1894.", url: "https://www.chocolateriasangines.com/" },
  { name: "Mercado de San Miguel", rating: 4.4, price: "$$", notes: "Iconic covered market. Tapas, wine, jamón. Best late morning or early evening.", url: "https://www.mercadodesanmiguel.es/en/" },
  { name: "Calle 365 Discoteca", rating: 4.8, price: "$$", notes: "Stylish nightclub — cocktails, tacos, live performances, karaoke. Opens 6PM.", url: "https://calle365madrid.com" },
];

const MADRID_ROOFTOPS = [
  { name: "Azotea del Círculo", notes: "Círculo de Bellas Artes. Panoramic rooftop. Reservations recommended.", url: "https://www.circulobellasartes.com/azotea/" },
  { name: "Torre de Madrid Rooftop", notes: "360° views from one of Madrid's tallest buildings.", url: "https://torremadrid.es/en/" },
  { name: "El Jardín de Diana", notes: "Gran Vía 31. Rooftop garden. Reservations recommended.", url: "https://maps.google.com/?q=El+Jardin+de+Diana+Gran+Via+Madrid" },
  { name: "Sky 44 Melía Castilla", notes: "Gran Vía 44. Skyline views. Reservations recommended.", url: "https://maps.google.com/?q=Sky+44+Melia+Castilla+Madrid" },
];

const CONCIERGE_TIPS = {
  "2026-03-20": "Pack light layers — Barcelona in late March can be breezy in the mornings but warm by afternoon. Double-check passports tonight!",
  "2026-03-21": "After the Sagrada Família tour, walk 10 minutes to Granja Petitbo for a late brunch — one of Barcelona's best coffee spots. Your hotel is in Eixample, a beautiful grid neighborhood perfect for evening walks.",
  "2026-03-22": "Sunday is perfect for Park Güell early (before 10AM crowds) then down to Barceloneta beach for a seafood lunch. El Nacional on Passeig de Gràcia is ideal for dinner — huge space, multiple cuisines.",
  "2026-03-23": "Zaragoza is underrated — Plaza del Pilar at sunset is stunning. The Aljafería Palace is 15 min from your hotel. For dinner, try Restaurante Cuba Linda for something unexpected and fun.",
  "2026-03-24": "You arrive at 1:44PM — too early for check-in. Drop bags at the hotel and head to Mercado de San Miguel for lunch tapas. It's a 5-min walk from your hotel.",
  "2026-03-25": "The Prado is best on weekday mornings — fewer crowds. Spend 2-3 hours there then walk through Retiro Park after. Evening rooftop at Azotea del Círculo is a must.",
  "2026-03-26": "Segovia day trip: take the 8:55AM AVE from Atocha (30 min, ~€12). Walk the aqueduct, visit the Alcázar, have cochinillo asado for lunch at Mesón de Cándido. Back in Madrid by 6PM.",
  "2026-03-27": "Last full day — Royal Palace in the morning, Gran Vía for shopping, and make tonight special with a rooftop sunset. El Jardín de Diana or Torre de Madrid are the picks.",
  "2026-03-28": "Check-out is 11AM, flight at 4:25PM. Leave bags at the hotel (most will hold them) and grab one last coffee at VALDEMESO before heading to Barajas. Metro Line 8 from Nuevos Ministerios is the easiest airport connection (~30 min, €5).",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getTodayIndex() {
  const today = new Date().toISOString().split("T")[0];
  const idx = TRIP.findIndex((d) => d.date === today);
  return idx >= 0 ? idx : 0; // default to first day if outside trip
}

function getWeatherEmoji(code) {
  if (code <= 1) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

function getWeatherDesc(code) {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code <= 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Thunderstorm";
}

const CITY_COORDS = {
  "Miami,US": { lat: 25.77, lon: -80.19 },
  "Barcelona,ES": { lat: 41.38, lon: 2.17 },
  "Zaragoza,ES": { lat: 41.65, lon: -0.88 },
  "Madrid,ES": { lat: 40.42, lon: -3.7 },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SpainBriefing() {
  const [dayIdx, setDayIdx] = useState(getTodayIndex());
  const [weather, setWeather] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [tab, setTab] = useState("briefing");
  const abortRef = useRef(null);

  const day = TRIP[dayIdx];

  // Fetch weather
  useEffect(() => {
    setWeather(null);
    setLoadingWeather(true);
    const coords = CITY_COORDS[day.weatherCity];
    if (!coords) { setLoadingWeather(false); return; }
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=16`
    )
      .then((r) => r.json())
      .then((data) => {
        const idx = data.daily.time.findIndex((t) => t === day.date);
        if (idx >= 0) {
          setWeather({
            emoji: getWeatherEmoji(data.daily.weathercode[idx]),
            desc: getWeatherDesc(data.daily.weathercode[idx]),
            high: Math.round(data.daily.temperature_2m_max[idx]),
            low: Math.round(data.daily.temperature_2m_min[idx]),
          });
        }
        setLoadingWeather(false);
      })
      .catch(() => setLoadingWeather(false));
  }, [dayIdx]);

  // Fetch AI suggestions
  async function fetchAI() {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoadingAI(true);
    setAiSuggestions(null);

    const restaurants = day.city === "Madrid" ? MADRID_RESTAURANTS : [];
    const rooftops = day.city === "Madrid" ? MADRID_ROOFTOPS : [];

    const prompt = `You are a luxury travel concierge for a family trip to Spain in late March 2026.
Today is ${day.day}, ${day.date}. The city is ${day.city}.
${weather ? `Weather: ${weather.emoji} ${weather.high}°F / ${weather.low}°F, ${weather.desc}.` : ""}
${day.events.length ? `Today's schedule: ${day.events.map(e => `${e.time}: ${e.title}`).join("; ")}.` : ""}

${restaurants.length ? `Available Madrid restaurants (name | rating | price | notes):\n${restaurants.slice(0, 8).map(r => `- ${r.name} | ${r.rating} | ${r.price} | ${r.notes}`).join("\n")}` : ""}
${rooftops.length ? `Madrid rooftops: ${rooftops.map(r => r.name).join(", ")}` : ""}

Provide a SHORT, personalized daily briefing in this EXACT JSON format (no markdown, no explanation outside JSON):
{
  "morning": {"suggestion": "one sentence breakfast/morning recommendation", "why": "one sentence reason"},
  "lunch": {"suggestion": "one restaurant name + one sentence why", "why": "one sentence detail"},
  "dinner": {"suggestion": "one restaurant name + one sentence why", "why": "one sentence detail"},
  "evening": {"suggestion": "one evening activity or rooftop", "why": "one sentence reason"},
  "tip": "one insider tip for the day, max 2 sentences"
}`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiSuggestions(parsed);
    } catch (e) {
      if (e.name !== "AbortError") {
        setAiSuggestions({ error: "Could not load suggestions. Try again." });
      }
    }
    setLoadingAI(false);
  }

  useEffect(() => {
    setAiSuggestions(null);
    setTab("briefing");
  }, [dayIdx]);

  const tip = CONCIERGE_TIPS[day.date];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1923 0%, #1a2d3d 50%, #0f1923 100%)",
      color: "#e8d5b0",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative background */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 20% 50%, #d4a843 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c0392b 0%, transparent 40%)",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", textTransform: "uppercase", marginBottom: 8 }}>
            España · March 2026
          </div>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#f5e6c8", letterSpacing: -0.5 }}>
            🇪🇸 Daily Briefing
          </div>
        </div>

        {/* Day Navigation */}
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 24,
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
        }}>
          {TRIP.map((d, i) => {
            const isActive = i === dayIdx;
            const short = d.date.slice(5).replace("-", "/");
            return (
              <button key={d.date} onClick={() => setDayIdx(i)} style={{
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: 20,
                border: isActive ? "1px solid #d4a843" : "1px solid rgba(212,168,67,0.2)",
                background: isActive ? "#d4a843" : "rgba(212,168,67,0.06)",
                color: isActive ? "#0f1923" : "#d4a843",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s",
              }}>
                {short}<br />
                <span style={{ fontSize: 10, opacity: 0.8 }}>{d.city.slice(0,3).toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Day Header Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(192,57,43,0.08) 100%)",
          border: "1px solid rgba(212,168,67,0.25)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#f5e6c8" }}>
                {day.emoji} {day.day}, {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </div>
              <div style={{ fontSize: 14, color: "#d4a843", marginTop: 4 }}>
                {day.city} &middot; <span style={{ color: "#b0a890" }}>{day.tag}</span>
              </div>
              {day.hotel && (
                <div style={{ fontSize: 12, color: "#8a9980", marginTop: 6 }}>
                  🏨 {day.hotel}
                </div>
              )}
            </div>
            {/* Weather */}
            <div style={{ textAlign: "right" }}>
              {loadingWeather ? (
                <div style={{ fontSize: 12, color: "#6a7868", fontStyle: "italic" }}>Loading…</div>
              ) : weather ? (
                <>
                  <div style={{ fontSize: 28 }}>{weather.emoji}</div>
                  <div style={{ fontSize: 13, color: "#e8d5b0", fontWeight: "bold" }}>{weather.high}° / {weather.low}°F</div>
                  <div style={{ fontSize: 11, color: "#8a9980" }}>{weather.desc}</div>
                </>
              ) : (
                <div style={{ fontSize: 20 }}>🌍</div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#d4a843", textTransform: "uppercase", marginBottom: 12 }}>
            Today's Schedule
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {day.events.map((ev, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "12px 16px",
              }}>
                <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{ev.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: "#f5e6c8" }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "#d4a843", flexShrink: 0 }}>{ev.time}</div>
                  </div>
                  {ev.note && <div style={{ fontSize: 12, color: "#8a9980", marginTop: 3 }}>{ev.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concierge Tip */}
        {tip && (
          <div style={{
            background: "rgba(192,57,43,0.1)",
            border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#c0392b", textTransform: "uppercase", marginBottom: 6 }}>
              💡 Concierge Tip
            </div>
            <div style={{ fontSize: 13, color: "#ddd0b8", lineHeight: 1.6 }}>{tip}</div>
          </div>
        )}

        {/* AI Suggestions */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#d4a843", textTransform: "uppercase" }}>
              AI Concierge
            </div>
            {!aiSuggestions && (
              <button onClick={fetchAI} disabled={loadingAI} style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: "1px solid #d4a843",
                background: loadingAI ? "rgba(212,168,67,0.1)" : "rgba(212,168,67,0.15)",
                color: "#d4a843",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: loadingAI ? "default" : "pointer",
                letterSpacing: 1,
              }}>
                {loadingAI ? "Thinking…" : "✨ Get Today's Picks"}
              </button>
            )}
          </div>

          {loadingAI && (
            <div style={{
              background: "rgba(212,168,67,0.05)",
              border: "1px solid rgba(212,168,67,0.15)",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              color: "#8a9980",
              fontSize: 13,
              fontStyle: "italic",
            }}>
              Your concierge is crafting today's recommendations…
            </div>
          )}

          {aiSuggestions && !aiSuggestions.error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { key: "morning", icon: "🌅", label: "Morning" },
                { key: "lunch", icon: "🍽️", label: "Lunch" },
                { key: "dinner", icon: "🥂", label: "Dinner" },
                { key: "evening", icon: "🌙", label: "Evening" },
              ].map(({ key, icon, label }) => aiSuggestions[key] && (
                <div key={key} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,168,67,0.12)",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}>
                  <div style={{ fontSize: 11, color: "#d4a843", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                    {icon} {label}
                  </div>
                  <div style={{ fontSize: 14, color: "#f0e0c0", fontWeight: "bold", marginBottom: 4 }}>
                    {aiSuggestions[key].suggestion}
                  </div>
                  <div style={{ fontSize: 12, color: "#8a9980", lineHeight: 1.5 }}>
                    {aiSuggestions[key].why}
                  </div>
                </div>
              ))}

              {aiSuggestions.tip && (
                <div style={{
                  background: "rgba(212,168,67,0.08)",
                  border: "1px solid rgba(212,168,67,0.2)",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}>
                  <div style={{ fontSize: 11, color: "#d4a843", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                    🎯 Insider Pick
                  </div>
                  <div style={{ fontSize: 13, color: "#ddd0b8", lineHeight: 1.6 }}>{aiSuggestions.tip}</div>
                </div>
              )}

              <button onClick={fetchAI} style={{
                alignSelf: "flex-end",
                padding: "6px 14px",
                borderRadius: 16,
                border: "1px solid rgba(212,168,67,0.2)",
                background: "transparent",
                color: "#8a9980",
                fontSize: 11,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: 1,
              }}>
                ↻ Refresh picks
              </button>
            </div>
          )}

          {aiSuggestions?.error && (
            <div style={{ color: "#c0392b", fontSize: 13, padding: 16 }}>{aiSuggestions.error}</div>
          )}
        </div>

        {/* Madrid Restaurants Quick Reference */}
        {day.city === "Madrid" && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#d4a843", textTransform: "uppercase", marginBottom: 12 }}>
              📋 Madrid Restaurant List
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MADRID_RESTAURANTS.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.15s",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#f0e0c0", fontWeight: "bold" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#7a8878", marginTop: 2 }}>{r.notes.slice(0, 60)}…</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: "#d4a843" }}>★ {r.rating}</div>
                    <div style={{ fontSize: 11, color: "#5a7a58" }}>{r.price}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, fontSize: 11, color: "#3a4a3a", letterSpacing: 2 }}>
          SPAIN 2026 · CANTILLO FAMILY
        </div>
      </div>
    </div>
  );
}
