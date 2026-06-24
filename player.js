(function () {
  const audio      = document.getElementById('audioEl');
  const bar        = document.getElementById('playerBar');
  const playerName = document.getElementById('playerName');
  const playerMeta = document.getElementById('playerMeta');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn    = document.getElementById('stopBtn');
  const iconPlay   = document.getElementById('iconPlay');
  const iconPause  = document.getElementById('iconPause');
  const volSlider  = document.getElementById('volumeSlider');
  const errBadge   = document.getElementById('playerError');

  audio.volume = volSlider.value;

  function setPlaying(on) {
    iconPlay.hidden  =  on;
    iconPause.hidden = !on;
    document.querySelector('.player-wave').style.animationPlayState = on ? 'running' : 'paused';
  }

  function showError(msg) {
    errBadge.textContent = '⚠ ' + (msg || 'Stream unavailable (CORS/network)');
    errBadge.hidden = false;
    setPlaying(false);
  }

  // Called from app.js: window.playStation(station)
  window.playStation = function (station) {
    errBadge.hidden = true;
    bar.hidden = false;
    playerName.textContent = station.name || 'Unknown station';
    playerMeta.textContent = [station.country, station.genre].filter(Boolean).join(' · ') || '—';

    audio.pause();
    audio.src = '';
    audio.src = station.stream_url || station.url || '';

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPlaying(true))
        .catch(err => {
          // Most likely CORS or network error
          console.warn('[Player]', err.message);
          showError('Stream unavailable (CORS/network)');
        });
    }
  };

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(e => showError(e.message));
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.src = '';
    bar.hidden = true;
    setPlaying(false);
  });

  volSlider.addEventListener('input', () => { audio.volume = volSlider.value; });

  audio.addEventListener('error', () => showError('Stream unavailable (CORS/network)'));
  audio.addEventListener('stalled', () => showError('Stream stalled or timed out'));
  audio.addEventListener('playing', () => { errBadge.hidden = true; setPlaying(true); });
})();
