/*
 * ========================================
 * TOP RISE - PWA COMPANION APP (app.js)
 * ========================================
 */

// Get the button and status elements from our HTML
const startButton = document.getElementById('startSessionButton');
const statusEl = document.getElementById('status');

// Add a click listener to the button
startButton.addEventListener('click', startCoachingSession);

async function startCoachingSession() {
  console.log('User clicked "Start Session"...');

  try {
    // --- 1. UNLOCK THE "MOUTH" (SPEAKERS) ---
    // We must create an "Audio Context". This is the browser's audio engine.
    // It starts in a "suspended" state.
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // We must call .resume() on it after a user click.
    // This "unlocks" the audio and allows us to play sounds.
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    console.log('Audio Context is unlocked. AI can now speak.');

    // --- 2. UNLOCK THE "MIC" (MICROPHONE) ---
    // We request access to the user's microphone.
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, // We want audio
      video: false // We don't need video
    });

    console.log('Microphone access granted. User can now speak to AI.');
    // In a real app, we would now take this 'stream' and send it
    // to our Speech-to-Text server via a WebSocket.
    // For now, we'll just stop the track so the "mic on" icon goes away.
    stream.getTracks().forEach(track => track.stop());

    // --- 3. UPDATE THE UI ---
    // Let the user know they are connected.
    statusEl.textContent = 'Status: Connected! You are ready to race.';
    statusEl.className = 'status-connected';
    startButton.textContent = 'Session Active';
    startButton.style.backgroundColor = '#00C781'; // Green

    // TODO: This is where we will add WebSocket code
    // to connect to the main TOP Rise API.

  } catch (err) {
    // This happens if the user denies permission
    console.error('Error starting session:', err);
    statusEl.textContent = 'Error: Mic permission was denied.';
    statusEl.className = 'status-waiting';
    statusEl.style.color = '#FF4136'; // Red
  }
}
