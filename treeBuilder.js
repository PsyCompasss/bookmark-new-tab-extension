export function buildTree(nodes) {
  const roots = Array.isArray(nodes) ? nodes : [nodes];
  return roots.map(normalizeNode).filter(Boolean);
}

function normalizeNode(node) {
  if (!node || typeof node.id !== "string") {
    return null;
  }

  const normalized = {
    id: node.id,
    title: node.title || "书签"
  };

  if (node.url) {
    normalized.url = node.url;
  }

  if (Array.isArray(node.children)) {
    normalized.children = node.children.map(normalizeNode).filter(Boolean);
  }

  return normalized;
}

export function getFolderChildren(folder) {
  return Array.isArray(folder?.children) ? folder.children.filter((node) => !node.url) : [];
}

export function getBookmarkChildren(folder) {
  return Array.isArray(folder?.children) ? folder.children.filter((node) => Boolean(node.url)) : [];
}

export function findFirstFolder(root) {
  if (!root) {
    return null;
  }

  if (!root.url) {
    return root;
  }

  if (!Array.isArray(root.children)) {
    return null;
  }

  for (const child of root.children) {
    const folder = findFirstFolder(child);
    if (folder) {
      return folder;
    }
  }

  return null;
}

export function findNodeById(root, id) {
  if (!root) {
    return null;
  }

  if (root.id === id) {
    return root;
  }

  if (!Array.isArray(root.children)) {
    return null;
  }

  for (const child of root.children) {
    const match = findNodeById(child, id);
    if (match) {
      return match;
    }
  }

  return null;
}
