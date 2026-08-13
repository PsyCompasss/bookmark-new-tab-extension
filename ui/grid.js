import { getBookmarkChildren } from "../treeBuilder.js";
import { isPinned } from "../pinned.js";
import { bindBookmarkOpen } from "../bookmarkNavigation.js";

export function renderBookmarkGrid(container, options) {
  const {
    bookmarks,
    pinnedIds,
    mode,
    currentFolder,
    onTogglePinned,
    onMoveBookmark
  } = options;

  container.replaceChildren();
  container.classList.toggle("is-search-mode", mode === "search");

  if (!bookmarks.length) {
    container.append(createEmptyState(mode === "search" ? "没有匹配的书签" : "这个文件夹里没有书签"));
    return;
  }

  for (const bookmark of bookmarks) {
    container.append(createBookmarkCard({
      bookmark,
      pinnedIds,
      draggable: mode === "folder",
      parentId: currentFolder?.id,
      onTogglePinned,
      onMoveBookmark
    }));
  }
}

function createBookmarkCard({ bookmark, pinnedIds, draggable, parentId, onTogglePinned, onMoveBookmark }) {
  const card = document.createElement("article");
  card.className = "bookmark-card";
  card.dataset.bookmarkId = bookmark.id;
  card.draggable = draggable;

  const openButton = document.createElement("button");
  openButton.className = "bookmark-open";
  openButton.type = "button";
  openButton.title = bookmark.url || bookmark.title;
  bindBookmarkOpen(openButton, bookmark);

  const icon = document.createElement("span");
  icon.className = "bookmark-icon";
  icon.textContent = getBookmarkIconText(bookmark);

  const title = document.createElement("span");
  title.className = "bookmark-title";
  title.textContent = bookmark.title || bookmark.url || "未命名";

  openButton.append(icon, title);

  const pinButton = document.createElement("button");
  const pinned = isPinned(bookmark.id, pinnedIds);
  pinButton.className = "pin-button";
  pinButton.classList.toggle("is-pinned", pinned);
  pinButton.type = "button";
  pinButton.title = pinned ? "取消固定" : "固定书签";
  pinButton.ariaLabel = pinned ? `取消固定${bookmark.title}` : `固定${bookmark.title}`;
  pinButton.textContent = pinned ? "★" : "☆";
  pinButton.addEventListener("click", () => onTogglePinned(bookmark));

  card.append(openButton, pinButton);

  if (draggable) {
    wireDragEvents(card, bookmark, parentId, onMoveBookmark);
  }

  return card;
}

function wireDragEvents(card, bookmark, parentId, onMoveBookmark) {
  card.addEventListener("dragstart", (event) => {
    card.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", bookmark.id);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
    for (const item of document.querySelectorAll(".bookmark-card.is-drop-target")) {
      item.classList.remove("is-drop-target");
    }
  });

  card.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    card.classList.add("is-drop-target");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("is-drop-target");
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    card.classList.remove("is-drop-target");
    const draggedId = event.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === bookmark.id) {
      return;
    }

    const grid = card.closest(".bookmark-grid");
    const cards = Array.from(grid.querySelectorAll(".bookmark-card"));
    const targetIndex = cards.indexOf(card);
    const rect = card.getBoundingClientRect();
    const insertAfterTarget = event.clientY > rect.top + rect.height / 2;
    onMoveBookmark(draggedId, parentId, targetIndex + (insertAfterTarget ? 1 : 0));
  });
}

export function getFolderBookmarks(folder) {
  return getBookmarkChildren(folder);
}

export function getBookmarkIconText(bookmark) {
  const title = bookmark.title?.trim();
  if (title) {
    return Array.from(title)[0].toUpperCase();
  }

  try {
    return new URL(bookmark.url).hostname.replace(/^www\./, "").slice(0, 1).toUpperCase();
  } catch {
    return "书";
  }
}

function createEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = message;
  return empty;
}
