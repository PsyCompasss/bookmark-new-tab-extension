import { getBookmarkIconText } from "./grid.js";
import { bindBookmarkOpen } from "../bookmarkNavigation.js";
import { t } from "../i18n.js";

export function renderPinnedBar(container, pinnedIds, bookmarkById, onUnpin) {
  container.replaceChildren();

  const pinnedBookmarks = pinnedIds.map((id) => bookmarkById.get(id)).filter(Boolean);

  if (!pinnedBookmarks.length) {
    const empty = document.createElement("p");
    empty.className = "pinned-empty";
    empty.textContent = t("emptyPinnedBar");
    container.append(empty);
    return;
  }

  for (const bookmark of pinnedBookmarks) {
    container.append(createPinnedCard(bookmark, onUnpin));
  }
}

function createPinnedCard(bookmark, onUnpin) {
  const card = document.createElement("article");
  card.className = "pinned-card";

  const openButton = document.createElement("button");
  openButton.className = "pinned-open";
  openButton.type = "button";
  openButton.title = bookmark.url || bookmark.title;
  bindBookmarkOpen(openButton, bookmark);

  const icon = document.createElement("span");
  icon.className = "pinned-icon";
  icon.textContent = getBookmarkIconText(bookmark);

  const title = document.createElement("span");
  title.className = "pinned-title";
  title.textContent = bookmark.title || bookmark.url || t("untitledBookmark");

  openButton.append(icon, title);

  const unpinButton = document.createElement("button");
  unpinButton.className = "pinned-remove";
  unpinButton.type = "button";
  unpinButton.title = t("unpin");
  unpinButton.ariaLabel = t("unpinSpecific", bookmark.title);
  unpinButton.textContent = "×";
  unpinButton.addEventListener("click", () => onUnpin(bookmark));

  card.append(openButton, unpinButton);
  return card;
}
