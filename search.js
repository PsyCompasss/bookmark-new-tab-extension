export function flattenBookmarks(nodes) {
  const source = Array.isArray(nodes) ? nodes : [nodes];
  const bookmarks = [];

  for (const node of source) {
    collectBookmarks(node, bookmarks);
  }

  return bookmarks;
}

function collectBookmarks(node, bookmarks) {
  if (!node) {
    return;
  }

  if (node.url) {
    bookmarks.push(node);
    return;
  }

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    collectBookmarks(child, bookmarks);
  }
}

export function searchBookmarks(bookmarks, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return bookmarks.filter((bookmark) => {
    const title = (bookmark.title || "").toLowerCase();
    const url = (bookmark.url || "").toLowerCase();
    return title.includes(normalizedQuery) || url.includes(normalizedQuery);
  });
}
