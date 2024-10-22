document.addEventListener('DOMContentLoaded', function() {
  const newItemInput = document.getElementById('newItem');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemsList = document.getElementById('items');

  // Carregar itens do banco de dados (IndexedDB ou localStorage)
  chrome.storage.local.get(['items'], function(result) {
    const items = result.items || [];
    items.forEach(item => {
      addItemToList(item);
    });
  });

  addItemBtn.addEventListener('click', function() {
    const newItem = newItemInput.value;
    if (newItem) {
      chrome.storage.local.get(['items'], function(result) {
        const items = result.items || [];
        items.push(newItem);
        chrome.storage.local.set({ items }, function() {
          addItemToList(newItem);
          newItemInput.value = '';
        });
      });
    }
  });

  function addItemToList(item) {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', function() {
      // Copiar o item para o clipboard
      navigator.clipboard.writeText(item).then(() => {
        // Inserir o item onde o cursor estiver
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: insertTextAtCursor,
            args: [item]
          });
        });
      });
    });
    itemsList.appendChild(li);
  }
});
