document.querySelectorAll('audio').forEach((audio) => {
    const controls = document.createElement('div');
    controls.innerHTML = `
      <button id="decrease-speed">-</button>
      <span id="speed">1x</span>
      <button id="increase-speed">+</button>
    `;
    controls.style.position = 'absolute';
    controls.style.top = '0';
    controls.style.right = '0';
    controls.style.background = 'rgba(255, 255, 255, 0.8)';
    controls.style.zIndex = '9999';
    audio.parentElement.style.position = 'relative';
    audio.parentElement.appendChild(controls);
  
    let playbackRate = 1;
  
    controls.querySelector('#increase-speed').addEventListener('click', () => {
      playbackRate = Math.min(playbackRate + 0.1, 4);
      audio.playbackRate = playbackRate;
      controls.querySelector('#speed').textContent = playbackRate.toFixed(1) + 'x';
    });
  
    controls.querySelector('#decrease-speed').addEventListener('click', () => {
      playbackRate = Math.max(playbackRate - 0.1, 0.1);
      audio.playbackRate = playbackRate;
      controls.querySelector('#speed').textContent = playbackRate.toFixed(1) + 'x';
    });
  });
  