import { getFolderChildren } from "../treeBuilder.js";

export function renderSidebar(container, root, selectedFolderId, expandedIds, onSelectFolder, onToggleFolder) {
  container.replaceChildren();

  const topLevelFolders = getFolderChildren(root);

  if (!topLevelFolders.length) {
    container.append(createEmptyState("没有文件夹"));
    return;
  }

  const tree = document.createElement("ul");
  tree.className = "folder-list";
  for (const folder of topLevelFolders) {
    tree.append(createFolderItem(folder, selectedFolderId, expandedIds, onSelectFolder, onToggleFolder, 0));
  }
  container.append(tree);
}

function createFolderItem(folder, selectedFolderId, expandedIds, onSelectFolder, onToggleFolder, depth) {
  const folderChildren = getFolderChildren(folder);
  const hasChildren = folderChildren.length > 0;
  const isExpanded = expandedIds.has(folder.id);
  const item = document.createElement("li");
  item.className = "folder-item";

  const row = document.createElement("div");
  row.className = "folder-row";
  row.classList.toggle("is-selected", folder.id === selectedFolderId);
  row.style.setProperty("--depth", String(depth));

  const toggleButton = document.createElement("button");
  toggleButton.className = "folder-toggle";
  toggleButton.type = "button";
  toggleButton.textContent = hasChildren ? (isExpanded ? "⌄" : "›") : "";
  toggleButton.ariaLabel = hasChildren ? `${isExpanded ? "折叠" : "展开"}${folder.title}` : "";
  toggleButton.disabled = !hasChildren;
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (hasChildren) {
      onToggleFolder(folder.id);
    }
  });

  const label = document.createElement("button");
  label.className = "folder-label";
  label.type = "button";
  label.title = folder.title;
  label.textContent = folder.title || "未命名文件夹";
  label.addEventListener("click", () => onSelectFolder(folder));

  row.append(toggleButton, label);
  item.append(row);

  if (hasChildren && isExpanded) {
    const nestedList = document.createElement("ul");
    nestedList.className = "folder-list";
    for (const child of folderChildren) {
      nestedList.append(createFolderItem(child, selectedFolderId, expandedIds, onSelectFolder, onToggleFolder, depth + 1));
    }
    item.append(nestedList);
  }

  return item;
}

function createEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = message;
  return empty;
}
