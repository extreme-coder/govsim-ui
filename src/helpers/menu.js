
const getMenuItems = (gameCode) => {
  return [
    { key: 'navigation', label: 'Navigation', isTitle: true },
    {
      key: 'apps-crm',
      label: 'Game',
      isTitle: false,
      icon: 'uil-tachometer-fast',
      url: `/game/${gameCode}`,
    },
    {
      key: 'apps-chat',
      label: 'Chat',
      isTitle: false,
      icon: 'uil-comments-alt',
      url: `/chat/${gameCode}`,
    },
    {
      key: 'apps-calendar',
      label: 'History',
      isTitle: false,
      icon: 'uil-calender',
      url: `/history/${gameCode}`,
    },
  ];
};

const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem['parentKey']);

  if (parent) {
    parents.push(parent['key']);
    if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
  }
  return parents;
};

const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      var found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export { getMenuItems, findAllParent, findMenuItem };
