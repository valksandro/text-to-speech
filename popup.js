document.addEventListener('DOMContentLoaded', async () => {
    let playbackRate = 1;
  
    const speedElement = document.getElementById('speed');
    const increaseButton = document.getElementById('increase-speed');
    const decreaseButton = document.getElementById('decrease-speed');
  
    // Função para obter o valor armazenado usando Promises
    async function getStoredPlaybackRate() {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['playbackRate'], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result.playbackRate);
          }
        });
      });
    }
  
    // Recupera a velocidade armazenada
    try {
      const storedPlaybackRate = await getStoredPlaybackRate();
      if (storedPlaybackRate) {
        playbackRate = storedPlaybackRate;
        speedElement.textContent = playbackRate.toFixed(1) + 'x';
        adjustAudioSpeed(playbackRate);
      }
    } catch (error) {
      console.error('Failed to retrieve playback rate:', error);
    }
  
    increaseButton.addEventListener('click', () => {
      playbackRate = Math.min(playbackRate + 0.1, 4);
      speedElement.textContent = playbackRate.toFixed(1) + 'x';
      adjustAudioSpeed(playbackRate);
      // Armazena a nova velocidade
      chrome.storage.sync.set({ playbackRate });
    });
  
    decreaseButton.addEventListener('click', () => {
      playbackRate = Math.max(playbackRate - 0.1, 0.1);
      speedElement.textContent = playbackRate.toFixed(1) + 'x';
      adjustAudioSpeed(playbackRate);
      // Armazena a nova velocidade
      chrome.storage.sync.set({ playbackRate });
    });
  
    function adjustAudioSpeed(rate) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (rate) => {
            document.querySelectorAll('audio').forEach((audio) => {
              audio.playbackRate = rate;
            });
          },
          args: [rate]
        });
      });
    }
  });
  