document.addEventListener('DOMContentLoaded', function() {
  const newItemInput = document.getElementById('newItem');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemsList = document.getElementById('items');

  // Carregar itens do banco de dados (chrome.storage.local)
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
    itemsList.appendChild(li);
  }
});
