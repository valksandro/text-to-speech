chrome.runtime.onInstalled.addListener(() => {
  // Remover qualquer menu existente (para evitar duplicação)
  chrome.contextMenus.removeAll(() => {
    // Criar o item principal do menu
    chrome.contextMenus.create({
      id: "itemsMenu",
      title: "Items",
      contexts: ["all"]
    });

    // Carregar itens do armazenamento
    chrome.storage.local.get(["items"], (result) => {
      const items = result.items || [];

      // Criar um submenu para cada item salvo
      items.forEach((item, index) => {
        chrome.contextMenus.create({
          id: `item-${index}`,
          parentId: "itemsMenu",
          title: item,
          contexts: ["all"]
        });
      });
    });
  });
});

// Listener para o evento de clique em um item do menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const itemId = info.menuItemId;

  // Verifica se o ID é de um item salvo
  if (itemId.startsWith("item-")) {
    const itemIndex = parseInt(itemId.split("-")[1], 10);

    // Recuperar o item correto a partir do índice
    chrome.storage.local.get(["items"], (result) => {
      const items = result.items || [];
      const selectedItem = items[itemIndex];

      // Copiar o item para o clipboard
      navigator.clipboard.writeText(selectedItem).then(() => {
        console.log("Item copiado para o clipboard: " + selectedItem);
      }).catch(err => {
        console.error("Erro ao copiar para o clipboard: ", err);
      });
    });
  }
});

// Função para atualizar o menu de contexto quando novos itens forem adicionados
function updateContextMenu() {
  chrome.contextMenus.removeAll(() => {
    // Recriar o menu principal
    chrome.contextMenus.create({
      id: "itemsMenu",
      title: "Items",
      contexts: ["all"]
    });

    // Carregar os itens do armazenamento e recriar o submenu
    chrome.storage.local.get(["items"], (result) => {
      const items = result.items || [];

      items.forEach((item, index) => {
        chrome.contextMenus.create({
          id: `item-${index}`,
          parentId: "itemsMenu",
          title: item,
          contexts: ["all"]
        });
      });
    });
  });
}

// Atualizar o menu quando novos itens forem adicionados
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.items) {
    updateContextMenu();
  }
});
