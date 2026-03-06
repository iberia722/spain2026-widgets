import { useState, useEffect, useRef } from "react";

// ─── TRIP DATA ────────────────────────────────────────────────────────────────
const TRIP = [
  {
    date:"2026-03-20",day:"Friday",city:"Miami",emoji:"🇺🇸",tag:"Departure Day",
    hotel:null,hotelCoords:null,
    flights:[{code:"AA112",from:"MIA",to:"BCN"}],trains:[],
    events:[{time:"4:15 PM",icon:"✈️",title:"AA 112 departs MIA → BCN",note:"Seats 19A, 19B, 19C · Conf IFEXMM"}],
    coords:{lat:25.77,lon:-80.19},
    reminders:["✅ Double-check passports tonight","✅ Print/screenshot all confirmations","✅ Notify bank of travel dates","✅ Charge all devices + download offline maps","✅ Check AA app for gate info 24hrs before"],
  },
  {
    date:"2026-03-21",day:"Saturday",city:"Barcelona",emoji:"🏙️",tag:"Arrival Day",
    hotel:"HCC St. Moritz",hotelCoords:{lat:41.3917,lon:2.1631},
    flights:[{code:"AA112",from:"MIA",to:"BCN"}],trains:[],
    events:[
      {time:"6:05 AM",icon:"✈️",title:"AA 112 arrives Barcelona–El Prat",note:"Conf IFEXMM"},
      {time:"10:50 AM",icon:"⏰",title:"Leave for Sagrada Família meeting point",note:"Meet 10 min before tour"},
      {time:"11:00 AM",icon:"🎟️",title:"Sagrada Família Guided Tour",note:"Ref 1365576215 · Viator"},
      {time:"2:00 PM",icon:"🏨",title:"Hotel check-in opens",note:"HCC St. Moritz · Conf 6091140659"},
    ],
    coords:{lat:41.38,lon:2.17},
    reminders:["🎟️ Sagrada Família at 11AM — meet 10 min early","🚕 Airport to hotel: taxi ~35 min or Aerobus","💶 Get euros at airport ATM","📱 Enable international data or buy local SIM","😴 Power through jet lag until 9PM local time"],
  },
  {
    date:"2026-03-22",day:"Sunday",city:"Barcelona",emoji:"🏙️",tag:"Barcelona Day 2",
    hotel:"HCC St. Moritz",hotelCoords:{lat:41.3917,lon:2.1631},
    flights:[],trains:[],
    events:[{time:"All day",icon:"🗺️",title:"Explore Barcelona",note:"Gothic Quarter · Barceloneta · Park Güell"}],
    coords:{lat:41.38,lon:2.17},
    reminders:["🏛️ Park Güell: timed entry required — book online","🏖️ Barceloneta beach is 20 min walk from Gothic Quarter","🔒 Watch for pickpockets in Las Ramblas","🚇 T-Casual metro card (10 trips) is best value","🥘 Sunday: many locals do special menú del día"],
  },
  {
    date:"2026-03-23",day:"Monday",city:"Zaragoza",emoji:"🏛️",tag:"Travel Day",
    hotel:"Catalonia El Pilar",hotelCoords:{lat:41.6570,lon:-0.8773},
    flights:[],trains:[{code:"AVE 03112",from:"Barcelona-Sants",to:"Zaragoza Delicias",locator:"5WMXVS"}],
    events:[
      {time:"9:30 AM",icon:"🚕",title:"Taxi to Barcelona-Sants station",note:"Check out by 9:00 AM"},
      {time:"11:00 AM",icon:"🚄",title:"AVE 03112 departs Barcelona-Sants",note:"Seats 04A/B/C · Car 3 · Locator 5WMXVS"},
      {time:"12:28 PM",icon:"🏁",title:"Arrive Zaragoza Delicias",note:"Taxi to hotel ~10 min"},
      {time:"3:00 PM",icon:"🏨",title:"Hotel check-in opens",note:"Catalonia El Pilar · Conf 6101844399"},
    ],
    coords:{lat:41.65,lon:-0.88},
    reminders:["🚄 Leave hotel by 9:30AM sharp","🎫 Screenshot Renfe locator 5WMXVS","🕌 Aljafería Palace: check Monday hours","🌆 Plaza del Pilar at sunset is unmissable","🍷 Try Garnacha wine from Aragón at dinner"],
  },
  {
    date:"2026-03-24",day:"Tuesday",city:"Madrid",emoji:"👑",tag:"Travel Day",
    hotel:"Lujo en el Centro",hotelCoords:{lat:40.4143,lon:-3.6996},
    flights:[],trains:[{code:"AVE 03304",from:"Zaragoza Delicias",to:"Madrid Atocha",locator:"VRNV7L"}],
    events:[
      {time:"10:45 AM",icon:"🚕",title:"Taxi to Zaragoza Delicias",note:"Check out 10:30 AM · Drop bags first"},
      {time:"11:43 AM",icon:"🚄",title:"AVE 03304 departs Zaragoza Delicias",note:"Seats 5A/B/C · Car 3 · Locator VRNV7L"},
      {time:"1:44 PM",icon:"🏁",title:"Arrive Madrid Puerta de Atocha",note:"Taxi to hotel ~10 min"},
      {time:"3:00 PM",icon:"🏨",title:"Hotel check-in opens",note:"Lujo en el Centro · Conf 6175087861"},
    ],
    coords:{lat:40.42,lon:-3.7},
    reminders:["🚄 Renfe locator VRNV7L — screenshot it","🏨 Hotel not ready until 3PM — drop bags + walk to Mercado San Miguel","🍽️ First Madrid dinner tonight!","🗺️ Your hotel is perfectly central — everything walkable"],
  },
  {
    date:"2026-03-25",day:"Wednesday",city:"Madrid",emoji:"👑",tag:"Madrid Day 2",
    hotel:"Lujo en el Centro",hotelCoords:{lat:40.4143,lon:-3.6996},
    flights:[],trains:[],
    events:[
      {time:"Morning",icon:"🎨",title:"Museo del Prado",note:"Book tickets in advance · Allow 2-3 hours"},
      {time:"Afternoon",icon:"🌳",title:"Parque del Retiro",note:"10 min walk from Prado · Palacio de Cristal inside"},
      {time:"Evening",icon:"🌇",title:"Rooftop sunset",note:"Azotea del Círculo or Torre de Madrid"},
    ],
    coords:{lat:40.42,lon:-3.7},
    reminders:["🎨 Prado is free Mon–Sat after 6PM","🚣 Rent a rowboat on Retiro lake (~€6)","🌆 Azotea del Círculo: call ahead for reservations","🍫 Chocolatería San Ginés open 24hrs — late night churros!"],
  },
  {
    date:"2026-03-26",day:"Thursday",city:"Madrid",emoji:"👑",tag:"Madrid Day 3 — Segovia?",
    hotel:"Lujo en el Centro",hotelCoords:{lat:40.4143,lon:-3.6996},
    flights:[],trains:[],
    events:[
      {time:"8:55 AM",icon:"🚄",title:"AVE to Segovia from Atocha",note:"~30 min · ~€12 each way · Book at Renfe.com"},
      {time:"All day",icon:"🏰",title:"Segovia — Aqueduct + Alcázar + cochinillo",note:"Full day trip"},
      {time:"6:00 PM",icon:"🏙️",title:"Return to Madrid",note:"Evening free"},
    ],
    coords:{lat:40.42,lon:-3.7},
    reminders:["🏰 Segovia Alcázar: book online to skip queue","🐷 Must eat: cochinillo asado at Mesón de Cándido","🚄 Last train back ~9PM — plenty of flexibility","📸 Roman aqueduct is free and jaw-dropping"],
  },
  {
    date:"2026-03-27",day:"Friday",city:"Madrid",emoji:"👑",tag:"Last Full Day",
    hotel:"Lujo en el Centro",hotelCoords:{lat:40.4143,lon:-3.6996},
    flights:[],trains:[],
    events:[
      {time:"Morning",icon:"👑",title:"Royal Palace + Almudena Cathedral",note:"Book tickets at patrimonio.es"},
      {time:"Afternoon",icon:"🛍️",title:"Gran Vía + Salamanca district",note:"Last chance for souvenirs"},
      {time:"Evening",icon:"🥂",title:"Farewell dinner",note:"Last night in Spain!"},
    ],
    coords:{lat:40.42,lon:-3.7},
    reminders:["👑 Royal Palace: verify open — sometimes closed for official events","🛍️ El Corte Inglés on Callao for last-minute gifts","🥂 Book tonight's dinner in advance — make it special","📦 Pack tonight — flight tomorrow at 4:25PM"],
  },
  {
    date:"2026-03-28",day:"Saturday",city:"Madrid",emoji:"✈️",tag:"Departure Day",
    hotel:null,hotelCoords:null,
    flights:[{code:"IB337",from:"MAD",to:"MIA"}],trains:[],
    events:[
      {time:"11:00 AM",icon:"🏨",title:"Hotel check-out",note:"Can hold bags if needed"},
      {time:"1:30 PM",icon:"🚇",title:"Head to Barajas Airport T4",note:"Metro Line 8 from Nuevos Ministerios ~30 min · ~€5"},
      {time:"4:25 PM",icon:"✈️",title:"IB 337 departs MAD → MIA",note:"Arrives 9:45 PM EDT · Conf IFEXMM"},
    ],
    coords:{lat:40.42,lon:-3.7},
    reminders:["✈️ Online check-in opens 24hrs before — do tonight","🚇 Metro Line 8 to T4 from Nuevos Ministerios","🏨 Hotel stores luggage after checkout","☕ Last café con leche at the airport — earned it!"],
  },
];

const MADRID_PLACES = [
  {name:"El Tormo",type:"Restaurant",rating:4.8,price:"$$",notes:"Castilian/La Mancha. Ring doorbell. Reservations essential. Closed Mon–Tue.",url:"https://eltormorestaurante.com/",coords:{lat:40.4117,lon:-3.7053}},
  {name:"La Mi Venta",type:"Restaurant",rating:4.7,price:"$$",notes:"Family-owned since 1962. Callos a la madrileña, paella marinera.",url:"https://www.lamiventa.com/en/",coords:{lat:40.4175,lon:-3.7142}},
  {name:"Gozar Neotaberna",type:"Restaurant",rating:4.7,price:"$",notes:"Creative Spanish — torreznos with satay, ensaladilla with fried egg.",url:"https://somosdegozar.com/",coords:{lat:40.4043,lon:-3.7175}},
  {name:"El Minibar",type:"Restaurant",rating:4.7,price:"$",notes:"Croquetas, tuna tataki. Open until 2AM.",url:"https://maps.google.com/?q=El+Minibar+Madrid",coords:{lat:40.4142,lon:-3.7087}},
  {name:"Casa Benigna",type:"Restaurant",rating:4.7,price:"$$$",notes:"Polished Chamartín gem. Excellent wine list.",url:"https://casabenigna.com/",coords:{lat:40.4512,lon:-3.6821}},
  {name:"La Menina Taberna",type:"Restaurant",rating:4.5,price:"$$",notes:"Barrio de las Letras. Brioche de gambas, jamón ibérico.",url:"https://tabernalamenina.com/",coords:{lat:40.4128,lon:-3.6962}},
  {name:"Taberna El Sur",type:"Restaurant",rating:4.5,price:"$",notes:"Grilled octopus, chipirones. Arrive before 7PM.",url:"https://maps.google.com/?q=Taberna+El+Sur+Madrid",coords:{lat:40.4082,lon:-3.7020}},
  {name:"La Vaca y La Huerta",type:"Restaurant",rating:4.4,price:"$$$",notes:"Quality meat + seasonal veg. Reserve ahead.",url:"https://lavacaylahuerta.com/",coords:{lat:40.4211,lon:-3.6921}},
  {name:"VALDEMESO",type:"Restaurant",rating:4.3,price:"$",notes:"Classic tapas from 8AM. Cocido madrileño.",url:"https://valdemeso.es/",coords:{lat:40.4175,lon:-3.7032}},
  {name:"Chocolatería San Ginés",type:"Food",rating:4.4,price:"$",notes:"Legendary churros con chocolate. Open 24hrs.",url:"https://www.chocolateriasangines.com/",coords:{lat:40.4153,lon:-3.7093}},
  {name:"Mercado de San Miguel",type:"Food",rating:4.4,price:"$$",notes:"Iconic covered market. Tapas, wine, jamón.",url:"https://www.mercadodesanmiguel.es/en/",coords:{lat:40.4151,lon:-3.7087}},
  {name:"Calle 365 Discoteca",type:"Restaurant",rating:4.8,price:"$$",notes:"Stylish nightclub — cocktails, tacos, live shows. Opens 6PM.",url:"https://calle365madrid.com",coords:{lat:40.4131,lon:-3.6971}},
  {name:"Museo del Prado",type:"Museum",rating:4.8,price:"$$",notes:"World-class. Velázquez, Goya, El Bosco. Book ahead.",url:"https://www.museodelprado.es/en/visit",coords:{lat:40.4138,lon:-3.6922}},
  {name:"Parque del Retiro",type:"Site",rating:4.9,price:"$",notes:"Beautiful park. Rowboats on lake. Palacio de Cristal inside.",url:"https://maps.google.com/?q=Parque+del+Retiro+Madrid",coords:{lat:40.4153,lon:-3.6844}},
  {name:"Azotea del Círculo",type:"Rooftop",rating:4.5,price:"$$",notes:"Panoramic views. Reservations recommended.",url:"https://www.circulobellasartes.com/azotea/",coords:{lat:40.4183,lon:-3.6992}},
  {name:"Torre de Madrid Rooftop",type:"Rooftop",rating:4.5,price:"$$",notes:"360° views. Book in advance.",url:"https://torremadrid.es/en/",coords:{lat:40.4237,lon:-3.7117}},
  {name:"Plaza Mayor",type:"Site",rating:4.7,price:"$",notes:"Iconic main square. Great for morning coffee or evening stroll.",url:"https://maps.google.com/?q=Plaza+Mayor+Madrid",coords:{lat:40.4154,lon:-3.7074}},
  {name:"Royal Palace",type:"Site",rating:4.7,price:"$$",notes:"Official royal residence. Book at patrimonio.es.",url:"https://entradas.patrimonionacional.es/",coords:{lat:40.4179,lon:-3.7143}},
];

function getWeatherEmoji(c){return c<=1?"☀️":c<=3?"⛅":c<=48?"🌫️":c<=67?"🌧️":c<=77?"❄️":c<=82?"🌦️":"⛈️";}
function getWeatherDesc(c){return c===0?"Clear sky":c<=2?"Partly cloudy":c<=3?"Overcast":c<=48?"Foggy":c<=55?"Drizzle":c<=67?"Rain":c<=77?"Snow":c<=82?"Showers":"Thunderstorm";}
function getTodayIndex(){const t=new Date().toISOString().split("T")[0];const i=TRIP.findIndex(d=>d.date===t);return i>=0?i:0;}
function dist(lat1,lon1,lat2,lon2){const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

async function callClaude(messages,system){
  const resp=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages,tools:[{type:"web_search_20250305",name:"web_search"}]}),
  });
  const data=await resp.json();
  return data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
}

const CACHE_KEY = (date,type) => `spain2026_${date}_${type}`;

export default function SpainBriefing(){
  const [dayIdx,setDayIdx]=useState(getTodayIndex());
  const [weather,setWeather]=useState(null);
  const [loadingWeather,setLoadingWeather]=useState(false);
  const [briefing,setBriefing]=useState(null);
  const [loadingBriefing,setLoadingBriefing]=useState(false);
  const [alerts,setAlerts]=useState(null);
  const [loadingAlerts,setLoadingAlerts]=useState(false);
  const [chatMessages,setChatMessages]=useState([]);
  const [chatInput,setChatInput]=useState("");
  const [loadingChat,setLoadingChat]=useState(false);
  const [activeTab,setActiveTab]=useState("briefing");
  const [eurAmount,setEurAmount]=useState("1");
  const [usdAmount,setUsdAmount]=useState("");
  const [eurRate,setEurRate]=useState(null);
  const [userCoords,setUserCoords]=useState(null);
  const [locating,setLocating]=useState(false);
  const [nearbyPlaces,setNearbyPlaces]=useState(null);
  const [offlineSaved,setOfflineSaved]=useState(false);
  const chatEndRef=useRef(null);
  const day=TRIP[dayIdx];

  // Weather
  useEffect(()=>{
    setBriefing(null);setAlerts(null);setChatMessages([]);setActiveTab("briefing");setWeather(null);setNearbyPlaces(null);
    if(!day.coords)return;
    setLoadingWeather(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${day.coords.lat}&longitude=${day.coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=16`)
      .then(r=>r.json()).then(data=>{
        const i=data.daily.time.findIndex(t=>t===day.date);
        if(i>=0)setWeather({emoji:getWeatherEmoji(data.daily.weathercode[i]),desc:getWeatherDesc(data.daily.weathercode[i]),high:Math.round(data.daily.temperature_2m_max[i]),low:Math.round(data.daily.temperature_2m_min[i])});
        setLoadingWeather(false);
      }).catch(()=>setLoadingWeather(false));
  },[dayIdx]);

  // EUR/USD rate
  useEffect(()=>{
    fetch("https://api.frankfurter.app/latest?from=EUR&to=USD")
      .then(r=>r.json()).then(data=>{
        const rate=data.rates?.USD;
        if(rate){setEurRate(rate);setUsdAmount((1*rate).toFixed(2));}
      }).catch(()=>{setEurRate(1.09);setUsdAmount("1.09");});
  },[]);

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatMessages]);

  const systemPrompt=`You are a luxury travel concierge for the Cantillo family — John (54, BJJ brown belt, fluent Spanish/English), Aymara, and Maria Elena — Spain trip March 20–28 2026.
Today: ${day.day} ${day.date}, City: ${day.city} (${day.tag})
${weather?`Weather: ${weather.emoji} ${weather.high}°F/${weather.low}°F, ${weather.desc}`:""}
Schedule: ${day.events.map(e=>`${e.time}: ${e.title}`).join("; ")}
${day.trains.length?`Trains: ${day.trains.map(t=>`${t.code} ${t.from}→${t.to} locator ${t.locator}`).join("; ")}`:""} 
${day.flights.length?`Flights: ${day.flights.map(f=>`${f.code} ${f.from}→${f.to}`).join("; ")}`:""} 
${day.city==="Madrid"?`Madrid places:\n${MADRID_PLACES.map(r=>`${r.name} (${r.type}, ${r.rating}★ ${r.price||""}): ${r.notes}`).join("\n")}`:""}
You have web search. Use it for live info. Be warm, concise, specific. English unless John writes Spanish.`;

  async function fetchBriefing(){
    const cacheKey=CACHE_KEY(day.date,"briefing");
    const cached=sessionStorage.getItem(cacheKey);
    if(cached){setBriefing(JSON.parse(cached));return;}
    setLoadingBriefing(true);setBriefing(null);
    try{
      const text=await callClaude([{role:"user",content:`Create a personalized daily briefing for today in JSON. Return ONLY valid JSON:\n{"morning":{"suggestion":"...","why":"..."},"lunch":{"suggestion":"...","why":"..."},"dinner":{"suggestion":"...","why":"..."},"evening":{"suggestion":"...","why":"..."},"tip":"..."}`}],systemPrompt);
      const clean=text.replace(/\`\`\`json|\`\`\`/g,"").trim();
      const parsed=JSON.parse(clean.slice(clean.indexOf("{"),clean.lastIndexOf("}")+1));
      setBriefing(parsed);
      sessionStorage.setItem(cacheKey,JSON.stringify(parsed));
    }catch{setBriefing({error:"Could not load. Try again."});}
    setLoadingBriefing(false);
  }

  async function fetchAlerts(){
    setLoadingAlerts(true);setAlerts(null);
    const trains=day.trains.map(t=>t.code).join(", ");
    const flights=day.flights.map(f=>f.code).join(", ");
    try{
      const text=await callClaude([{role:"user",content:`Search for travel alerts for ${day.date} in ${day.city} Spain.${trains?` Renfe alerts for ${trains}.`:""}${flights?` Flight status for ${flights}.`:""} Any strikes, closures, major events. Bullet points. If nothing found, say so.`}],systemPrompt);
      setAlerts(text);
    }catch{setAlerts("Could not fetch. Check Renfe.com and FlightAware directly.");}
    setLoadingAlerts(false);
  }

  async function sendChat(){
    if(!chatInput.trim()||loadingChat)return;
    const userMsg=chatInput.trim();setChatInput("");
    const newMessages=[...chatMessages,{role:"user",content:userMsg}];
    setChatMessages(newMessages);setLoadingChat(true);
    try{
      const text=await callClaude(newMessages,systemPrompt);
      setChatMessages([...newMessages,{role:"assistant",content:text}]);
    }catch{setChatMessages([...newMessages,{role:"assistant",content:"Sorry, try again."}]);}
    setLoadingChat(false);
  }

  function handleEurChange(v){
    setEurAmount(v);
    if(eurRate&&!isNaN(v))setUsdAmount((parseFloat(v||0)*eurRate).toFixed(2));
  }
  function handleUsdChange(v){
    setUsdAmount(v);
    if(eurRate&&!isNaN(v))setEurAmount((parseFloat(v||0)/eurRate).toFixed(2));
  }

  function findNearMe(){
    setLocating(true);setNearbyPlaces(null);
    navigator.geolocation.getCurrentPosition(pos=>{
      const{latitude:lat,longitude:lon}=pos.coords;
      setUserCoords({lat,lon});
      const places=MADRID_PLACES
        .map(p=>({...p,distance:dist(lat,lon,p.coords.lat,p.coords.lon)}))
        .sort((a,b)=>a.distance-b.distance)
        .slice(0,8);
      setNearbyPlaces(places);
      setLocating(false);
    },()=>{
      // fallback to hotel coords
      const hc=day.hotelCoords||day.coords;
      const places=MADRID_PLACES
        .map(p=>({...p,distance:dist(hc.lat,hc.lon,p.coords.lat,p.coords.lon)}))
        .sort((a,b)=>a.distance-b.distance)
        .slice(0,8);
      setNearbyPlaces(places);
      setLocating(false);
    });
  }

  function getDirectionsUrl(place){
    const origin=userCoords?`${userCoords.lat},${userCoords.lon}`:day.hotelCoords?`${day.hotelCoords.lat},${day.hotelCoords.lon}`:"";
    const dest=`${place.coords.lat},${place.coords.lon}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`;
  }

  function getMapUrl(){
    if(day.city!=="Madrid")return null;
    const markers=MADRID_PLACES.slice(0,10).map(p=>`markers=color:red%7C${p.coords.lat},${p.coords.lon}`).join("&");
    return `https://www.google.com/maps/search/restaurants+and+sites/@${day.coords.lat},${day.coords.lon},14z`;
  }

  function saveOffline(){
    const data={day,weather,briefing,alerts,savedAt:new Date().toISOString()};
    sessionStorage.setItem(`spain2026_offline_${day.date}`,JSON.stringify(data));
    setOfflineSaved(true);setTimeout(()=>setOfflineSaved(false),2000);
  }

  const G="#d4a843";const DIM="#8a9980";const LIGHT="#f0e0c0";
  const card={background:"rgba(255,255,255,0.03)",border:"1px solid rgba(212,168,67,0.15)",borderRadius:12,padding:"14px 18px",marginBottom:10};
  const label={fontSize:10,letterSpacing:3,color:G,textTransform:"uppercase",marginBottom:8};
  const btn=(active,extra={})=>({padding:"9px 16px",borderRadius:20,border:`1px solid ${active?G:"rgba(212,168,67,0.25)"}`,background:active?G:"rgba(212,168,67,0.08)",color:active?"#0f1923":G,fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",fontWeight:active?"bold":"normal",transition:"all 0.2s",...extra});

  const tabs=[
    {id:"briefing",label:"📋 Picks"},
    {id:"alerts",label:"🚨 Alerts"},
    {id:"chat",label:"💬 Concierge"},
    {id:"currency",label:"💶 Currency"},
    {id:"nearby",label:"📍 Near Me"},
    {id:"reminders",label:"🎫 Reminders"},
    ...(day.city==="Madrid"?[{id:"restaurants",label:"🍽️ All Places"}]:[]),
  ];

  return(
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",minHeight:"100vh",background:"linear-gradient(135deg,#0f1923 0%,#1a2d3d 50%,#0f1923 100%)",color:"#e8d5b0"}}>
      <div style={{maxWidth:700,margin:"0 auto",padding:"20px 14px 80px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:10,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:6}}>España · March 2026</div>
          <div style={{fontSize:24,fontWeight:"bold",color:LIGHT}}>🇪🇸 Daily Briefing</div>
          <button onClick={saveOffline} style={{...btn(false),fontSize:10,marginTop:8,padding:"5px 12px",opacity:0.6}}>
            {offlineSaved?"✅ Saved!":"💾 Save for offline"}
          </button>
        </div>

        {/* Day pills */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:18,scrollbarWidth:"none"}}>
          {TRIP.map((d,i)=>(
            <button key={d.date} onClick={()=>setDayIdx(i)} style={btn(i===dayIdx,{flexShrink:0,lineHeight:1.4})}>
              {d.date.slice(5).replace("-","/")} <br/><span style={{fontSize:10,opacity:0.8}}>{d.city.slice(0,3).toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Day header */}
        <div style={{background:"linear-gradient(135deg,rgba(212,168,67,0.12),rgba(192,57,43,0.08))",border:"1px solid rgba(212,168,67,0.25)",borderRadius:16,padding:"18px 22px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:20,fontWeight:"bold",color:LIGHT}}>{day.emoji} {day.day}, {new Date(day.date+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric"})}</div>
              <div style={{fontSize:13,color:G,marginTop:3}}>{day.city} · <span style={{color:DIM}}>{day.tag}</span></div>
              {day.hotel&&<div style={{fontSize:11,color:DIM,marginTop:5}}>🏨 {day.hotel}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              {loadingWeather?<div style={{fontSize:11,color:DIM}}>…</div>
                :weather?<><div style={{fontSize:26}}>{weather.emoji}</div><div style={{fontSize:13,fontWeight:"bold"}}>{weather.high}°/{weather.low}°F</div><div style={{fontSize:11,color:DIM}}>{weather.desc}</div></>
                :<div style={{fontSize:20}}>🌍</div>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{marginBottom:14}}>
          <div style={label}>Today's Schedule</div>
          {day.events.map((ev,i)=>(
            <div key={i} style={{...card,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{fontSize:18,flexShrink:0}}>{ev.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                  <div style={{fontSize:14,fontWeight:"bold",color:LIGHT}}>{ev.title}</div>
                  <div style={{fontSize:11,color:G,flexShrink:0}}>{ev.time}</div>
                </div>
                {ev.note&&<div style={{fontSize:11,color:DIM,marginTop:2}}>{ev.note}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setActiveTab(t.id)} style={btn(activeTab===t.id,{padding:"7px 12px",fontSize:11})}>{t.label}</button>)}
        </div>

        {/* BRIEFING */}
        {activeTab==="briefing"&&<>
          {!briefing&&!loadingBriefing&&<button onClick={fetchBriefing} style={btn(true,{width:"100%",padding:"13px",fontSize:13,marginBottom:12})}>✨ Get Today's AI Picks</button>}
          {loadingBriefing&&<div style={{...card,textAlign:"center",color:DIM,fontStyle:"italic",padding:24}}>Crafting your picks…</div>}
          {briefing&&!briefing.error&&<>
            {[["morning","🌅","Morning"],["lunch","🍽️","Lunch"],["dinner","🥂","Dinner"],["evening","🌙","Evening"]].map(([k,ic,lb])=>briefing[k]&&(
              <div key={k} style={card}>
                <div style={label}>{ic} {lb}</div>
                <div style={{fontSize:14,color:LIGHT,fontWeight:"bold",marginBottom:4}}>{briefing[k].suggestion}</div>
                <div style={{fontSize:12,color:DIM,lineHeight:1.5}}>{briefing[k].why}</div>
              </div>
            ))}
            {briefing.tip&&<div style={{...card,background:"rgba(212,168,67,0.08)",border:"1px solid rgba(212,168,67,0.2)"}}>
              <div style={label}>🎯 Insider Tip</div>
              <div style={{fontSize:13,color:"#ddd0b8",lineHeight:1.6}}>{briefing.tip}</div>
            </div>}
            <button onClick={()=>{sessionStorage.removeItem(CACHE_KEY(day.date,"briefing"));fetchBriefing();}} style={btn(false,{fontSize:11,marginTop:4})}>↻ Refresh</button>
          </>}
          {briefing?.error&&<div style={{color:"#c0392b",fontSize:13}}>{briefing.error}</div>}
        </>}

        {/* ALERTS */}
        {activeTab==="alerts"&&<>
          <div style={{...card,background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.2)",marginBottom:12,fontSize:12,color:DIM,lineHeight:1.6}}>
            Searches live for Renfe disruptions, flight status, strikes, closures in {day.city} for {day.date}.
          </div>
          {!alerts&&!loadingAlerts&&<button onClick={fetchAlerts} style={btn(true,{width:"100%",padding:"13px",fontSize:13})}>🔍 Check Live Alerts for {day.city}</button>}
          {loadingAlerts&&<div style={{...card,textAlign:"center",color:DIM,fontStyle:"italic",padding:24}}>Searching for disruptions…</div>}
          {alerts&&<>
            <div style={card}>
              <div style={label}>🚨 Live Alerts — {day.city}</div>
              <div style={{fontSize:13,color:"#ddd0b8",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{alerts}</div>
            </div>
            <button onClick={fetchAlerts} style={btn(false,{fontSize:11})}>↻ Refresh</button>
          </>}
        </>}

        {/* CHAT */}
        {activeTab==="chat"&&<>
          <div style={{...card,background:"rgba(212,168,67,0.05)",marginBottom:10,fontSize:12,color:DIM,lineHeight:1.6}}>
            Ask anything — restaurant questions, live reviews, directions, alternatives, local tips. Has web search + knows your full trip.
          </div>
          {chatMessages.length===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
              {["What's the best dinner pick tonight and why?","Search recent reviews for El Tormo","Any transport disruptions today?","I'm not in the mood for Spanish food — alternatives?","What should we do between 3PM and 7PM?"].map((q,i)=>(
                <button key={i} onClick={()=>setChatInput(q)} style={btn(false,{textAlign:"left",borderRadius:10,fontSize:12})}>{q}</button>
              ))}
            </div>
          )}
          <div style={{maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
            {chatMessages.map((msg,i)=>(
              <div key={i} style={{alignSelf:msg.role==="user"?"flex-end":"flex-start",maxWidth:"85%",background:msg.role==="user"?"rgba(212,168,67,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${msg.role==="user"?"rgba(212,168,67,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"10px 14px",fontSize:13,color:msg.role==="user"?LIGHT:"#ddd0b8",lineHeight:1.6,whiteSpace:"pre-wrap"}}>
                {msg.content}
              </div>
            ))}
            {loadingChat&&<div style={{alignSelf:"flex-start",padding:"10px 14px",background:"rgba(255,255,255,0.05)",borderRadius:12,fontSize:13,color:DIM,fontStyle:"italic"}}>Searching and thinking…</div>}
            <div ref={chatEndRef}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask your concierge anything…" style={{flex:1,padding:"10px 14px",borderRadius:20,border:"1px solid rgba(212,168,67,0.3)",background:"rgba(255,255,255,0.05)",color:LIGHT,fontSize:13,fontFamily:"Georgia,serif",outline:"none"}}/>
            <button onClick={sendChat} disabled={loadingChat||!chatInput.trim()} style={btn(true,{flexShrink:0,opacity:(!chatInput.trim()||loadingChat)?0.5:1})}>Send</button>
          </div>
        </>}

        {/* CURRENCY */}
        {activeTab==="currency"&&<>
          <div style={label}>💶 EUR / USD Converter</div>
          <div style={card}>
            <div style={{fontSize:11,color:DIM,marginBottom:12}}>
              Live rate: 1 EUR = <span style={{color:G,fontWeight:"bold"}}>{eurRate?eurRate.toFixed(4):"loading…"}</span> USD
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:120}}>
                <div style={{fontSize:10,color:DIM,marginBottom:4,letterSpacing:2}}>EUROS €</div>
                <input value={eurAmount} onChange={e=>handleEurChange(e.target.value)} type="number" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(212,168,67,0.3)",background:"rgba(255,255,255,0.05)",color:LIGHT,fontSize:18,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{fontSize:20,color:G,paddingTop:16}}>⇄</div>
              <div style={{flex:1,minWidth:120}}>
                <div style={{fontSize:10,color:DIM,marginBottom:4,letterSpacing:2}}>US DOLLARS $</div>
                <input value={usdAmount} onChange={e=>handleUsdChange(e.target.value)} type="number" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(212,168,67,0.3)",background:"rgba(255,255,255,0.05)",color:LIGHT,fontSize:18,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
          </div>
          <div style={label}>Quick Reference</div>
          {[[1,"Coffee / café con leche"],[3,"Beer / cerveza"],[15,"Menú del día (lunch)"],[25,"Dinner per person ($$)"],[60,"Dinner per person ($$$)"],[12,"AVE train Atocha–Segovia"],[6,"Retiro rowboat rental"],[5,"Metro to airport"]].map(([eur,label_])=>(
            <div key={eur} style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px"}}>
              <div style={{fontSize:13,color:DIM}}>{label_}</div>
              <div style={{textAlign:"right"}}>
                <span style={{color:G,fontWeight:"bold"}}>€{eur}</span>
                {eurRate&&<span style={{color:DIM,fontSize:11,marginLeft:8}}>${(eur*eurRate).toFixed(2)}</span>}
              </div>
            </div>
          ))}
        </>}

        {/* NEAR ME */}
        {activeTab==="nearby"&&<>
          <div style={{...card,background:"rgba(212,168,67,0.05)",marginBottom:12,fontSize:12,color:DIM,lineHeight:1.6}}>
            {day.city==="Madrid"?"Shows your saved Madrid places sorted by distance from your current location (or hotel if GPS unavailable). Tap any for walking directions.":"Near Me works in Madrid where your full places database is loaded."}
          </div>
          {day.city==="Madrid"&&<>
            {!nearbyPlaces&&<button onClick={findNearMe} disabled={locating} style={btn(true,{width:"100%",padding:"13px",fontSize:13,marginBottom:12})}>
              {locating?"📍 Getting your location…":"📍 Find Places Near Me"}
            </button>}
            {nearbyPlaces&&<>
              <div style={{fontSize:11,color:DIM,marginBottom:10}}>Sorted by distance from {userCoords?"your location":"your hotel"} · Tap for walking directions</div>
              {nearbyPlaces.map((p,i)=>(
                <a key={i} href={getDirectionsUrl(p)} target="_blank" rel="noreferrer" style={{...card,display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:"inherit",cursor:"pointer"}}>
                  <div style={{fontSize:22,flexShrink:0}}>{p.type==="Restaurant"?"🍽️":p.type==="Museum"?"🎨":p.type==="Site"?"🗺️":p.type==="Rooftop"?"🌆":"🍴"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:LIGHT,fontWeight:"bold"}}>{p.name}</div>
                    <div style={{fontSize:11,color:DIM,marginTop:2}}>{p.notes.slice(0,55)}…</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,color:G}}>{p.distance<1?(p.distance*1000).toFixed(0)+"m":`${p.distance.toFixed(1)}km`}</div>
                    <div style={{fontSize:10,color:DIM}}>🚶 walk</div>
                    {p.rating&&<div style={{fontSize:11,color:G}}>★{p.rating}</div>}
                  </div>
                </a>
              ))}
              <button onClick={()=>{setNearbyPlaces(null);}} style={btn(false,{fontSize:11,marginTop:4})}>↻ Refresh</button>
            </>}
            <div style={{marginTop:16}}>
              <a href={`https://www.google.com/maps/search/restaurants/@${day.coords.lat},${day.coords.lon},15z`} target="_blank" rel="noreferrer" style={btn(true,{display:"block",textAlign:"center",textDecoration:"none",padding:"12px",fontSize:13})}>
                🗺️ Open All Places in Google Maps
              </a>
            </div>
          </>}
        </>}

        {/* REMINDERS */}
        {activeTab==="reminders"&&<>
          <div style={label}>🎫 Today's Reminders</div>
          {day.reminders.map((r,i)=><div key={i} style={{...card,fontSize:13,color:"#ddd0b8",lineHeight:1.6}}>{r}</div>)}
        </>}

        {/* ALL PLACES (Madrid) */}
        {activeTab==="restaurants"&&day.city==="Madrid"&&<>
          {["Restaurant","Food","Museum","Site","Rooftop"].map(type=>{
            const places=MADRID_PLACES.filter(p=>p.type===type);
            if(!places.length)return null;
            return(
              <div key={type}>
                <div style={{...label,marginTop:type==="Restaurant"?0:16}}>{type==="Restaurant"?"🍽️":type==="Food"?"🥐":type==="Museum"?"🎨":type==="Site"?"🗺️":"🌆"} {type}{type==="Restaurant"?"s":type==="Site"?"s":type==="Museum"?"s":type==="Rooftop"?"s":"s"}</div>
                {places.map((p,i)=>(
                  <div key={i} style={{...card,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:13,color:LIGHT,fontWeight:"bold",textDecoration:"none"}}>{p.name}</a>
                      <div style={{fontSize:11,color:DIM,marginTop:2}}>{p.notes}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end",flexShrink:0}}>
                      {p.rating&&<div style={{fontSize:11,color:G}}>★{p.rating}</div>}
                      {p.price&&<div style={{fontSize:11,color:"#5a7a58"}}>{p.price}</div>}
                      <a href={getDirectionsUrl(p)} target="_blank" rel="noreferrer" style={{fontSize:10,color:DIM,textDecoration:"none"}}>🚶 Walk</a>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </>}

        <div style={{textAlign:"center",marginTop:40,fontSize:10,color:"#2a3a2a",letterSpacing:3}}>SPAIN 2026 · CANTILLO FAMILY</div>
      </div>
    </div>
  );
}
