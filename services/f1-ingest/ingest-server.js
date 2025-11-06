/*
 * ========================================
 * TOP RISE - F1 INGESTION SERVER (v2)
 * ========================================
 * This server uses the pure-JS parser to avoid
 * build errors on fly.io.
 */

// Import the NEW library
const { F1TelemetryClient, constants } = require("@deltazeroproduction/f1-udp-parser");
const { PACKETS } = constants;

console.log("Starting TOP Rise Ingestion Server...");

// This IS THE CRITICAL CHANGE FOR FLY.IO
// We must tell the server to listen on a special
// internal address, which we will set in fly.toml
const host = process.env.HOST || '0.0.0.0';

// Initialize the client
const client = new F1TelemetryClient({ 
  port: 20777,
  host: host // Bind to the special fly.io internal address
});

// --- EVENT LISTENERS (These are mostly the same) ---

client.on(PACKETS.session, (data) => {
  console.log(
    `[SESSION] Connected! Track: ${
      data.m_trackId
    } | Weather: ${data.m_weather} | Player Index: ${data.m_header.m_playerCarIndex}`
  );
});

client.on(PACKETS.lapData, (data) => {
  const playerIndex = data.m_header.m_playerCarIndex;
  const playerLapData = data.m_lapData[playerIndex];

  console.log(
    `[LAP DATA] Lap ${playerLapData.m_currentLapNum} | Pos: ${
      playerLapData.m_carPosition
    } | Current Time: ${playerLapData.m_currentLapTimeInMS} ms`
  );
});

let lastTelemetryLog = 0;
client.on(PACKETS.carTelemetry, (data) => {
  const now = Date.now();
  if (now - lastTelemetryLog > 1000) {
    const playerIndex = data.m_header.m_playerCarIndex;
    const playerTelemetry = data.m_carTelemetryData[playerIndex];

    console.log(
      `[TELEMETRY] Speed: ${playerTelemetry.m_speed} km/h | Throttle: ${playerTelemetry.m_throttle.toFixed(
        2
      )} | Brake: ${playerTelemetry.m_brake.toFixed(2)} | Gear: ${
        playerTelemetry.m_gear
      }`
    );
    lastTelemetryLog = now;
  }
});

// --- START THE SERVER ---
client.start();

console.log(
  `\n✅ TOP Rise Server is LIVE and listening on ${host}:${20777}.`
);
console.log("Waiting for F1 25 to start sending data...");