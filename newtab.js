import { getTree, moveBookmark } from "./bookmarkService.js";
import { buildTree, findNodeById, getFolderChildren } from "./treeBuilder.js";
import { getPinnedIds, isPinned, pinBookmark, unpinBookmark } from "./pinned.js";
import { flattenBookmarks, searchBookmarks } from "./search.js";
import { renderSidebar } from "./ui/sidebar.js";
import { getFolderBookmarks, renderBookmarkGrid } from "./ui/grid.js";
import { renderPinnedBar } from "./ui/pinnedBar.js";

const state = {
  root: null,
  selectedFolder: null,
  expandedIds: new Set(),
  allBookmarks: [],
  bookmarkById: new Map(),
  pinnedIds: [],
  searchQuery: ""
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();

  try {
    const [rawTree, pinnedIds] = await Promise.all([getTree(), getPinnedIds()]);
    const tree = buildTree(rawTree);
    state.root = tree[0] || null;
    state.allBookmarks = flattenBookmarks(state.root);
    state.bookmarkById = new Map(state.allBookmarks.map((bookmark) => [bookmark.id, bookmark]));
    state.pinnedIds = pinnedIds;
    state.selectedFolder = getDefaultFolder();

    seedExpandedFolders(state.selectedFolder);
    wireSearch();
    renderApp();
  } catch (error) {
    console.error("初始化书签新标签页失败", error);
    renderFatalError();
  }
}

function cacheElements() {
  elements.sidebar = document.getElementById("sidebar");
  elements.bookmarkGrid = document.getElementById("bookmarkGrid");
  elements.pinnedBar = document.getElementById("pinnedBar");
  elements.searchInput = document.getElementById("searchInput");
  elements.contentTitle = document.getElementById("contentTitle");
  elements.viewModeLabel = document.getElementById("viewModeLabel");
  elements.resultCount = document.getElementById("resultCount");
}

function wireSearch() {
  elements.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    renderContent();
  });
}

function renderApp() {
  renderSidebar(
    elements.sidebar,
    state.root,
    state.selectedFolder?.id,
    state.expandedIds,
    selectFolder,
    toggleFolder
  );
  renderPinnedBar(elements.pinnedBar, state.pinnedIds, state.bookmarkById, handleUnpin);
  renderContent();
}

function renderContent() {
  const query = state.searchQuery.trim();
  const searchMode = query.length > 0;
  const bookmarks = searchMode ? searchBookmarks(state.allBookmarks, query) : getFolderBookmarks(state.selectedFolder);

  elements.viewModeLabel.textContent = searchMode ? "搜索" : "文件夹";
  elements.contentTitle.textContent = searchMode ? `"${query}" 的搜索结果` : state.selectedFolder?.title || "书签";
  elements.resultCount.textContent = `${bookmarks.length} 个书签`;

  renderBookmarkGrid(elements.bookmarkGrid, {
    bookmarks,
    pinnedIds: state.pinnedIds,
    mode: searchMode ? "search" : "folder",
    currentFolder: state.selectedFolder,
    onTogglePinned: handleTogglePinned,
    onMoveBookmark: handleMoveBookmark
  });
}

function selectFolder(folder) {
  state.selectedFolder = folder;
  state.searchQuery = "";
  elements.searchInput.value = "";
  state.expandedIds.add(folder.id);
  renderApp();
}

function toggleFolder(folderId) {
  if (state.expandedIds.has(folderId)) {
    state.expandedIds.delete(folderId);
  } else {
    state.expandedIds.add(folderId);
  }

  renderSidebar(
    elements.sidebar,
    state.root,
    state.selectedFolder?.id,
    state.expandedIds,
    selectFolder,
    toggleFolder
  );
}

async function handleTogglePinned(bookmark) {
  state.pinnedIds = isPinned(bookmark.id, state.pinnedIds)
    ? await unpinBookmark(bookmark.id)
    : await pinBookmark(bookmark.id);

  renderPinnedBar(elements.pinnedBar, state.pinnedIds, state.bookmarkById, handleUnpin);
  renderContent();
}

async function handleUnpin(bookmark) {
  state.pinnedIds = await unpinBookmark(bookmark.id);
  renderPinnedBar(elements.pinnedBar, state.pinnedIds, state.bookmarkById, handleUnpin);
  renderContent();
}

async function handleMoveBookmark(bookmarkId, parentId, targetBookmarkInsertIndex) {
  if (!state.selectedFolder || parentId !== state.selectedFolder.id) {
    return;
  }

  const children = state.selectedFolder.children || [];
  const bookmarkChildren = children.filter((node) => node.url);
  const draggedBookmark = bookmarkChildren.find((bookmark) => bookmark.id === bookmarkId);

  if (!draggedBookmark) {
    return;
  }

  const currentBookmarkIndex = bookmarkChildren.findIndex((bookmark) => bookmark.id === bookmarkId);
  const adjustedBookmarkIndex = currentBookmarkIndex < targetBookmarkInsertIndex
    ? targetBookmarkInsertIndex - 1
    : targetBookmarkInsertIndex;

  if (currentBookmarkIndex === -1 || currentBookmarkIndex === adjustedBookmarkIndex) {
    return;
  }

  const folderChildTargetIndex = getFolderChildIndexForBookmarkDrop(children, bookmarkId, adjustedBookmarkIndex);
  const previousChildren = [...children];

  applyLocalBookmarkMove(state.selectedFolder, bookmarkId, folderChildTargetIndex);
  refreshBookmarkIndex();
  renderContent();

  try {
    await moveBookmark(bookmarkId, parentId, folderChildTargetIndex);
  } catch (error) {
    console.error("移动书签失败", error);
    state.selectedFolder.children = previousChildren;
    refreshBookmarkIndex();
    renderContent();
  }
}

function applyLocalBookmarkMove(folder, bookmarkId, targetChildIndex) {
  const children = folder.children || [];
  const fromIndex = children.findIndex((node) => node.id === bookmarkId);

  if (fromIndex === -1) {
    return;
  }

  const [moved] = children.splice(fromIndex, 1);
  children.splice(Math.max(0, Math.min(targetChildIndex, children.length)), 0, moved);
  folder.children = children;
}

function getFolderChildIndexForBookmarkDrop(allChildren, bookmarkId, targetBookmarkIndex) {
  const remainingChildren = allChildren.filter((node) => node.id !== bookmarkId);
  const remainingBookmarks = remainingChildren.filter((node) => node.url);

  if (!remainingBookmarks.length) {
    return remainingChildren.length;
  }

  if (targetBookmarkIndex <= 0) {
    return remainingChildren.findIndex((node) => node.id === remainingBookmarks[0].id);
  }

  if (targetBookmarkIndex >= remainingBookmarks.length) {
    const lastBookmark = remainingBookmarks[remainingBookmarks.length - 1];
    return remainingChildren.findIndex((node) => node.id === lastBookmark.id) + 1;
  }

  const targetBookmark = remainingBookmarks[targetBookmarkIndex];
  return remainingChildren.findIndex((node) => node.id === targetBookmark.id);
}

function getDefaultFolder() {
  const bookmarkBar = findNodeById(state.root, "1");
  const topLevelFolders = getFolderChildren(state.root);
  return bookmarkBar || topLevelFolders[0] || state.root;
}

function seedExpandedFolders(folder) {
  if (folder) {
    state.expandedIds.add(folder.id);
  }
}

function refreshBookmarkIndex() {
  state.allBookmarks = flattenBookmarks(state.root);
  state.bookmarkById = new Map(state.allBookmarks.map((bookmark) => [bookmark.id, bookmark]));
}

function renderFatalError() {
  elements.contentTitle.textContent = "无法加载书签";
  elements.viewModeLabel.textContent = "错误";
  elements.resultCount.textContent = "";
  elements.bookmarkGrid.replaceChildren();

  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "请刷新页面，或检查扩展权限。";
  elements.bookmarkGrid.append(message);
}
