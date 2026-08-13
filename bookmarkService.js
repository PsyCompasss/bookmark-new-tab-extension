export async function getTree() {
  return chrome.bookmarks.getTree();
}

export async function moveBookmark(id, parentId, index) {
  return chrome.bookmarks.move(id, { parentId, index });
}
