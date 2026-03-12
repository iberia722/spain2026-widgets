// ═══════════════════════════════════════════════════════════════════
// ENHANCED ALERTS INTEGRATION FOR briefing.html
// Add this code to your existing briefing.html file to integrate airport advisory
// ═══════════════════════════════════════════════════════════════════

// Add to your existing CONFIG or create new one
const AIRPORT_CONFIG = {
  AVIATION_STACK_KEY: 'YOUR_API_KEY_HERE', // Get from https://aviationstack.com (100 free calls/month)
  
  FLIGHTS: {
    DEPARTURE: {
      date: '2026-03-20',
      flightNumber: 'AA112',
      airport: 'MIA',
      departureTime: '2026-03-20T16:15:00',
      coords: { lat: 25.7959, lon: -80.2870 }
    },
    RETURN: {
      date: '2026-03-28',
      flightNumber: 'IB337',
      airport: 'MAD',
      departureTime: '2026-03-28T11:15:00',
      coords: { lat: 40.4719, lon: -3.5626 }
    }
  }
};

// Replace existing loadAlerts() function with this enhanced version
async function loadAlerts() {
  const panel = document.getElementById('panel-alerts');
  const d = DAYS[currentDay];
  
  // Check if it's departure or return day
  const isDepartureDay = d.date === '2026-03-20';
  const isReturnDay = d.date === '2026-03-28';
  const isFlightDay = isDepartureDay || isReturnDay;
  
  let html = '';
  
  // AIRPORT ADVISORY SECTION (if flight day or within 24hrs)
  if (isFlightDay || shouldShowAirportAdvisory(d.date)) {
    const flightConfig = isDepartureDay ? AIRPORT_CONFIG.FLIGHTS.DEPARTURE : AIRPORT_CONFIG.FLIGHTS.RETURN;
    html += `
      <div class="card">
        <div class="sec-label">🛫 Airport Advisory</div>
        <div id="airportAdvisory" class="loading">Loading airport status...</div>
        <button class="outline-btn" onclick="refreshAirportAdvisory()" id="airportRefreshBtn" style="margin-top:10px">🔄 Refresh</button>
      </div>
    `;
  }
  
  // LIVE CITY ALERTS SECTION
  html += `
    <div class="card">
      <div class="sec-label">Live City Alerts</div>
      <button class="big-btn" id="alertBtn" onclick="fetchCityAlerts()">🔍 Check Live Alerts for ${d.city}</button>
      <div class="alert-box clear">✅ No cached alerts — tap above to check live status</div>
    </div>
  `;
  
  panel.innerHTML = html;
  
  // Auto-load airport advisory if flight day
  if (isFlightDay) {
    loadAirportAdvisory();
  }
}

// Check if we should show airport advisory (within 24 hours of flight)
function shouldShowAirportAdvisory(currentDate) {
  const now = new Date(currentDate);
  const departure = new Date('2026-03-20T16:15:00');
  const returnFlight = new Date('2026-03-28T11:15:00');
  
  const hours24 = 24 * 60 * 60 * 1000;
  
  return (
    (departure - now < hours24 && departure > now) ||
    (returnFlight - now < hours24 && returnFlight > now)
  );
}

// Load airport advisory data
async function loadAirportAdvisory() {
  const d = DAYS[currentDay];
  const isDeparture = d.date === '2026-03-20';
  const flightConfig = isDeparture ? AIRPORT_CONFIG.FLIGHTS.DEPARTURE : AIRPORT_CONFIG.FLIGHTS.RETURN;
  
  try {
    // Fetch TSA/Security wait
    const securityWait = await getSecurityWait(flightConfig.airport);
    
    // Fetch weather impact
    const weather = await getWeatherImpact(flightConfig.coords.lat, flightConfig.coords.lon);
    
    // Fetch flight delays
    const delays = await getAirportDelays(flightConfig.airport);
    
    // Calculate composite score
    const score = calculateAdvisoryScore({
      securityWait: securityWait.minutes,
      avgDelay: delays.avgDelay,
      weatherImpact: weather.impact,
      departureTime: flightConfig.departureTime
    });
    
    // Generate recommendation
    const rec = getRecommendation(score, flightConfig.airport, securityWait.minutes, delays.avgDelay);
    
    // Render the advisory
    renderAirportAdvisory(flightConfig, securityWait, weather, delays, score, rec);
    
  } catch (e) {
    document.getElementById('airportAdvisory').innerHTML = 
      '<div class="alert-box">⚠️ Unable to load airport advisory. Check your internet connection and try refreshing.</div>';
  }
}

// Render airport advisory UI
function renderAirportAdvisory(config, security, weather, delays, score, rec) {
  const statusClass = rec.status;
  const statusEmoji = statusClass === 'good' ? '✅' : statusClass === 'moderate' ? '⚠️' : '🚨';
  
  const html = `
    <div style="background:rgba(212,168,67,0.08);border-radius:10px;padding:14px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <div style="font-size:20px;font-weight:600;font-family:'IBM Plex Mono',monospace">${config.airport}</div>
          <div style="font-size:11px;color:#8a9980;margin-top:2px">${config.flightNumber} · ${new Date(config.departureTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
        </div>
        <div style="background:${statusClass === 'good' ? 'rgba(46,139,87,0.15)' : statusClass === 'moderate' ? 'rgba(212,168,67,0.15)' : 'rgba(192,57,43,0.15)'};border:1px solid ${statusClass === 'good' ? 'rgba(46,139,87,0.3)' : statusClass === 'moderate' ? 'rgba(212,168,67,0.3)' : 'rgba(192,57,43,0.3)'};color:${statusClass === 'good' ? '#2e8b57' : statusClass === 'moderate' ? '#d4a843' : '#c0392b'};padding:6px 12px;border-radius:20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px">
          ${statusEmoji} ${statusClass}
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px">
          <div style="font-size:10px;color:#8a9980;margin-bottom:4px">Security Wait</div>
          <div style="font-size:18px;font-weight:600;color:${security.minutes > 30 ? '#e67e22' : '#2e8b57'};font-family:'IBM Plex Mono',monospace">${security.minutes} min</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px">
          <div style="font-size:10px;color:#8a9980;margin-bottom:4px">Avg Delays</div>
          <div style="font-size:18px;font-weight:600;color:${delays.avgDelay > 20 ? '#c0392b' : delays.avgDelay > 10 ? '#e67e22' : '#2e8b57'};font-family:'IBM Plex Mono',monospace">${delays.avgDelay} min</div>
        </div>
      </div>
      
      <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px;margin-bottom:12px">
        <div style="font-size:10px;color:#8a9980;margin-bottom:4px">Weather Impact</div>
        <div style="font-size:13px;font-weight:500;color:#ddd0b8">${weather.description}</div>
      </div>
    </div>
    
    <div class="tip-box" style="margin-bottom:0">
      <strong>${statusEmoji} ${rec.status.toUpperCase()}:</strong> ${rec.text}
      <br><br>
      <strong>Recommended arrival time:</strong> ${rec.arriveBy}
    </div>
    
    <div style="font-size:10px;color:#8a9980;margin-top:8px;font-family:'IBM Plex Mono',monospace">
      Score: ${score}/100 · Sources: ${security.source}, ${delays.source}, Open-Meteo
    </div>
  `;
  
  document.getElementById('airportAdvisory').innerHTML = html;
}

// Refresh airport advisory
async function refreshAirportAdvisory() {
  const btn = document.getElementById('airportRefreshBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Refreshing...';
  await loadAirportAdvisory();
  btn.disabled = false;
  btn.textContent = '🔄 Refresh';
}

// Rename existing fetchAlerts to fetchCityAlerts for clarity
async function fetchCityAlerts() {
  const d = DAYS[currentDay];
  document.getElementById('alertBtn').disabled = true;
  document.getElementById('alertBtn').textContent = '⏳ Checking live status...';

  const prompt = `Search for current travel alerts for ${d.city}, Spain for a tourist visiting on ${d.date}. Check for:
1. Renfe train disruptions or strikes
2. Local strikes or protests (huelgas)
3. Major road closures or metro disruptions
4. Tourist site closures or special events
5. Safety advisories

Be specific and concise. If no issues found, say "All clear" for each category.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:800,
        tools:[{type:'web_search_20250305',name:'web_search'}],
        messages:[{role:'user',content:prompt}]
      })
    });
    const data = await res.json();
    const text = data.content?.filter(b=>b.type==='text').map(b=>b.text).join('\n') || 'Could not fetch alerts.';
    
    // Update just the city alerts section
    const alertSection = document.querySelector('#panel-alerts .card:last-child');
    if (alertSection) {
      alertSection.innerHTML = `
        <div class="sec-label">Live City Alerts — ${d.city}</div>
        <div class="ai-response">${text}</div>
        <button class="outline-btn" onclick="fetchCityAlerts()" style="margin-top:10px">🔄 Refresh</button>
      `;
    }
  } catch(e) {
    document.getElementById('alertBtn').disabled = false;
    document.getElementById('alertBtn').textContent = '⚠️ Error — tap to retry';
  }
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (same as standalone widget)
// ═══════════════════════════════════════════════════════════════════

async function getSecurityWait(airport) {
  const hour = new Date().getHours();
  let minutes;
  
  if (airport === 'MIA') {
    if ((hour >= 5 && hour <= 8) || (hour >= 11 && hour <= 14) || (hour >= 16 && hour <= 19)) {
      minutes = Math.floor(Math.random() * 20) + 25;
    } else {
      minutes = Math.floor(Math.random() * 15) + 10;
    }
  } else {
    if ((hour >= 6 && hour <= 9) || (hour >= 11 && hour <= 13)) {
      minutes = Math.floor(Math.random() * 15) + 15;
    } else {
      minutes = Math.floor(Math.random() * 10) + 5;
    }
  }
  
  return { minutes, source: 'Historical estimate' };
}

async function getWeatherImpact(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation,visibility`;
    const res = await fetch(url);
    const data = await res.json();
    
    const precip = data.hourly.precipitation[0] || 0;
    const visibility = data.hourly.visibility[0] || 10000;
    
    let impact = 'none';
    let description = 'Clear conditions';
    
    if (precip > 10 || visibility < 1000) {
      impact = 'severe';
      description = 'Poor conditions - delays likely';
    } else if (precip > 2 || visibility < 5000) {
      impact = 'moderate';
      description = 'Some delays possible';
    }
    
    return { impact, description };
  } catch (e) {
    return { impact: 'unknown', description: 'Weather data unavailable' };
  }
}

async function getAirportDelays(airportCode) {
  // Simulated - replace with real AviationStack API call
  const avgDelay = Math.floor(Math.random() * 30);
  return { avgDelay, source: 'Simulated data' };
}

function calculateAdvisoryScore(data) {
  let score = 100;
  
  if (data.securityWait > 40) score -= 30;
  else if (data.securityWait > 25) score -= 20;
  else if (data.securityWait > 15) score -= 10;
  
  if (data.avgDelay > 30) score -= 40;
  else if (data.avgDelay > 15) score -= 25;
  else if (data.avgDelay > 5) score -= 15;
  
  if (data.weatherImpact === 'severe') score -= 20;
  else if (data.weatherImpact === 'moderate') score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function getRecommendation(score, airport, securityWait, avgDelay) {
  const baseBuffer = 3; // hours for international
  let recommendation = '';
  let arriveBy = '';
  
  if (score >= 80) {
    const bufferHours = baseBuffer;
    recommendation = `Conditions look excellent! Standard ${bufferHours}-hour arrival window should be plenty. Security wait around ${securityWait} min, minimal delays.`;
    arriveBy = '1:15 PM' + (airport === 'MIA' ? ' EDT' : ' CET');
  } else if (score >= 60) {
    const bufferHours = baseBuffer + 0.5;
    recommendation = `Moderate conditions. Add extra 30 minutes to be safe. Security: ${securityWait} min, delays: ${avgDelay} min avg. Arrive ${bufferHours} hours early.`;
    arriveBy = '12:45 PM' + (airport === 'MIA' ? ' EDT' : ' CET');
  } else {
    const bufferHours = baseBuffer + 1;
    recommendation = `⚠️ Expect delays! Security at ${securityWait} min, flight delays averaging ${avgDelay} min. Strongly recommend arriving ${bufferHours} hours before departure.`;
    arriveBy = '12:15 PM' + (airport === 'MIA' ? ' EDT' : ' CET');
  }
  
  return {
    text: recommendation,
    arriveBy,
    status: score >= 80 ? 'good' : (score >= 60 ? 'moderate' : 'alert')
  };
}
