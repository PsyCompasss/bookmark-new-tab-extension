import { getTree, moveBookmark } from "./bookmarkService.js";
import { buildTree, findNodeById, getFolderChildren } from "./treeBuilder.js";
import { getPinnedIds, isPinned, pinBookmark, setPinnedIds, unpinBookmark } from "./pinned.js";
import { flattenBookmarks, searchBookmarks } from "./search.js";
import { renderSidebar } from "./ui/sidebar.js";
import { getFolderBookmarks, renderBookmarkGrid } from "./ui/grid.js";
import { renderPinnedBar } from "./ui/pinnedBar.js";
import { localizeDocument, t } from "./i18n.js";

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
let bookmarkRefreshTimer = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  localizeDocument();
  cacheElements();

  try {
    const [rawTree, pinnedIds] = await Promise.all([getTree(), getPinnedIds()]);
    const tree = buildTree(rawTree);
    state.root = tree[0] || null;
    state.allBookmarks = flattenBookmarks(state.root);
    state.bookmarkById = new Map(state.allBookmarks.map((bookmark) => [bookmark.id, bookmark]));
    state.pinnedIds = await removeStalePinnedIds(pinnedIds);
    state.selectedFolder = getDefaultFolder();

    seedExpandedFolders(state.selectedFolder);
    wireSearch();
    wireBookmarkChanges();
    renderApp();
  } catch (error) {
    console.error(t("initializationError"), error);
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
  elements.reorderHint = document.getElementById("reorderHint");
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

  elements.viewModeLabel.textContent = searchMode ? t("searchEyebrow") : t("folderEyebrow");
  elements.contentTitle.textContent = searchMode ? t("searchResultsTitle", query) : state.selectedFolder?.title || t("appTitle");
  const bookmarkCountKey = bookmarks.length === 1 ? "bookmarkCountOne" : "bookmarkCountOther";
  elements.resultCount.textContent = t(bookmarkCountKey, String(bookmarks.length));
  elements.reorderHint.hidden = searchMode;

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
  const currentFolderChildIndex = children.findIndex((node) => node.id === bookmarkId);
  const chromeMoveIndex = currentFolderChildIndex < folderChildTargetIndex
    ? folderChildTargetIndex + 1
    : folderChildTargetIndex;
  const previousChildren = [...children];

  applyLocalBookmarkMove(state.selectedFolder, bookmarkId, folderChildTargetIndex);
  refreshBookmarkIndex();
  renderContent();

  try {
    await moveBookmark(bookmarkId, parentId, chromeMoveIndex);
  } catch (error) {
    console.error(t("moveBookmarkError"), error);
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

async function removeStalePinnedIds(pinnedIds) {
  const validIds = pinnedIds.filter((id) => state.bookmarkById.has(id));
  if (validIds.length !== pinnedIds.length) {
    return setPinnedIds(validIds);
  }
  return validIds;
}

function wireBookmarkChanges() {
  const events = ["onCreated", "onRemoved", "onChanged", "onMoved", "onChildrenReordered", "onImportEnded"];
  for (const eventName of events) {
    chrome.bookmarks[eventName]?.addListener(scheduleBookmarkRefresh);
  }
}

function scheduleBookmarkRefresh() {
  window.clearTimeout(bookmarkRefreshTimer);
  bookmarkRefreshTimer = window.setTimeout(refreshBookmarksFromChrome, 120);
}

async function refreshBookmarksFromChrome() {
  const selectedFolderId = state.selectedFolder?.id;

  try {
    const rawTree = await getTree();
    const tree = buildTree(rawTree);
    state.root = tree[0] || null;
    refreshBookmarkIndex();
    state.pinnedIds = await removeStalePinnedIds(state.pinnedIds);
    state.selectedFolder = findNodeById(state.root, selectedFolderId) || getDefaultFolder();
    renderApp();
  } catch (error) {
    console.error(t("refreshBookmarksError"), error);
  }
}

function renderFatalError() {
  elements.contentTitle.textContent = t("loadBookmarksErrorTitle");
  elements.viewModeLabel.textContent = t("errorEyebrow");
  elements.resultCount.textContent = "";
  elements.reorderHint.hidden = true;
  elements.bookmarkGrid.replaceChildren();

  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = t("loadBookmarksErrorMessage");
  elements.bookmarkGrid.append(message);
}
