
chrome.runtime.onInstalled.addListener(() => {
  const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  chrome.contextMenus.create({
    id: "sendText",
    title: "Converter texto em fala",
    contexts: ["selection"]
  });

  voices.forEach(voice => {
    chrome.contextMenus.create({
      id: voice,
      title: voice.charAt(0).toUpperCase() + voice.slice(1), // Capitalize the voice name
      parentId: "sendText",
      contexts: ["selection"]
    });
  });
});



chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  if (voices.includes(info.menuItemId) && info.selectionText) {
      const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        });
   

        
      chrome.scripting.executeScript({
          target: {tabId: tab.id},
          args: [info.selectionText, info.menuItemId],
          function: (selectionText, menuItemId)  =>  {
              fetch('https://api.openai.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                    'Authorization': 'Bearer ',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    model: "tts-1",
                    input:  selectionText,
                    voice: menuItemId
                  })
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.blob();
                })
                .then(blob => {
                  const value = URL.createObjectURL(blob);
                  let audio = new Audio(value);
                  audio.playbackRate = 1.3;
                  audio.play();

                  const a = document.createElement('a');
                  a.href = value;
                  a.download = "output.mp3"; // Name the file
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                })
                .catch(error => {
                  console.error('Failed to fetch or play:', error);
                })}
      }).then(()=>{
          console.log('teste2')
          console.log("we have injected the content script")
      }).catch(err=> console.log(err, "error in background script line 10"))
  }
});



/*
const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

chrome.runtime.onInstalled.addListener( () => {

    chrome.contextMenus.create({
      id: "sendText",
      title: "Converter texto em fala",
      contexts: ["selection"]
    });
  

  voices.forEach(voice => {
    chrome.contextMenus.create({
      id: voice,
      title: voice.charAt(0).toUpperCase() + voice.slice(1), // Capitalize the voice name
      parentId: "sendText",
      contexts: ["selection"]
    });
  });
  });


  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    const voice = info.menuItemId;
    if (voices.includes(info.menuItemId) && info.selectionText) {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            args: [info.selectionText],
            function: (arg) =>  {
                console.log(arg)
                fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                      'Authorization': 'Bearer 
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      model: "tts-1",
                      input:  arg,
                      voice: voice
                    })
                  })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.blob();
                  })
                  .then(blob => {
                    const value = URL.createObjectURL(blob);
                    let audio = new Audio(value);
                    audio.playbackRate = 1.3;
                    audio.play();

                    const a = document.createElement('a');
                    a.href = value;
                    a.download = "output.mp3"; // Name the file
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  })
                  .catch(error => {
                    console.error('Failed to fetch or play:', error);
                  })}
        }).then((e)=>{
            console.log(`teste2 ${e}`)
            console.log("we have injected the content script")
        }).catch(err=> console.log(err, "error in background script line 10"))
    }
  });
  
  */