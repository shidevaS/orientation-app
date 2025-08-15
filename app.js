function clearContent() {
  document.getElementById('content').innerHTML = '';
}

// Alarm Clock
function loadAlarmClock() {
  clearContent();
  document.getElementById('mode-title').textContent = '⏰ Alarm Clock';

  const content = document.getElementById('content');
  const timeInput = document.createElement('input');
  timeInput.type = 'time';

  const setBtn = document.createElement('button');
  setBtn.textContent = 'Set Alarm';

  let alarmTime = null;
  let interval;

  setBtn.onclick = () => {
    alarmTime = timeInput.value;
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      if (currentTime === alarmTime) {
        alert("🔔 Alarm Ringing!");
        clearInterval(interval);
      }
    }, 1000);
  };

  content.appendChild(timeInput);
  content.appendChild(setBtn);
}

// Stopwatch
function loadStopwatch() {
  clearContent();
  document.getElementById('mode-title').textContent = '⏱ Stopwatch';

  const content = document.getElementById('content');
  let time = 0, running = false, interval;

  const display = document.createElement('div');
  display.textContent = '00:00';
  display.style.fontSize = '32px';
  display.style.margin = '20px';

  const startBtn = document.createElement('button');
  const stopBtn = document.createElement('button');
  const resetBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  stopBtn.textContent = 'Stop';
  resetBtn.textContent = 'Reset';

  startBtn.onclick = () => {
    if (!running) {
      running = true;
      interval = setInterval(() => {
        time++;
        let mins = String(Math.floor(time / 60)).padStart(2, '0');
        let secs = String(time % 60).padStart(2, '0');
        display.textContent = `${mins}:${secs}`;
      }, 1000);
    }
  };

  stopBtn.onclick = () => {
    running = false;
    clearInterval(interval);
  };

  resetBtn.onclick = () => {
    running = false;
    clearInterval(interval);
    time = 0;
    display.textContent = '00:00';
  };

  content.appendChild(display);
  content.appendChild(startBtn);
  content.appendChild(stopBtn);
  content.appendChild(resetBtn);
}

// Timer
function loadTimer() {
  clearContent();
  document.getElementById('mode-title').textContent = '⏳ Timer';

  const content = document.getElementById('content');
  const input = document.createElement('input');
  input.type = 'number';
  input.placeholder = 'Enter seconds';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start Timer';

  const display = document.createElement('div');
  display.style.fontSize = '32px';
  display.style.marginTop = '20px';

  startBtn.onclick = () => {
    let seconds = parseInt(input.value);
    if (isNaN(seconds) || seconds <= 0) {
      alert("Enter a valid time.");
      return;
    }

    display.textContent = `${seconds}s`;
    const interval = setInterval(() => {
      seconds--;
      display.textContent = `${seconds}s`;
      if (seconds <= 0) {
        clearInterval(interval);
        alert("⏰ Timer Done!");
      }
    }, 1000);
  };

  content.appendChild(input);
  content.appendChild(startBtn);
  content.appendChild(display);
}

// Weather
function loadWeather() {
  clearContent();
  document.getElementById('mode-title').textContent = '🌤 Weather';

  const content = document.getElementById('content');
  const status = document.createElement('p');
  content.appendChild(status);

  if (!navigator.geolocation) {
    status.textContent = "Geolocation not supported.";
    return;
  }

  status.textContent = "Fetching location...";

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const apiKey = 'YOUR_API_KEY'; // <-- Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        status.textContent = `📍 ${data.name}\n${data.weather[0].description}, 🌡 ${data.main.temp}°C`;
      })
      .catch(() => {
        status.textContent = "Failed to load weather.";
      });
  }, () => {
    status.textContent = "Unable to retrieve your location.";
  });
}

// Detect orientation
function getOrientationMode() {
  const angle = screen.orientation ? screen.orientation.angle : window.orientation;

  if (angle === 0 || angle === undefined) return 'portrait-upright';
  if (angle === 180) return 'portrait-upside-down';
  if (angle === 90) return 'landscape-right';
  if (angle === -90 || angle === 270) return 'landscape-left';

  return 'unknown';
}

function updateUI(mode) {
  switch (mode) {
    case 'portrait-upright':
      loadAlarmClock();
      break;
    case 'portrait-upside-down':
      loadTimer();
      break;
    case 'landscape-right':
      loadStopwatch();
      break;
    case 'landscape-left':
      loadWeather();
      break;
    default:
      document.getElementById('content').textContent = 'Rotate your device!';
  }
}

window.addEventListener('orientationchange', () => {
  const mode = getOrientationMode();
  updateUI(mode);
});

window.addEventListener('load', () => {
  const mode = getOrientationMode();
  updateUI(mode);
});
