export async function openBookmark(bookmark, event) {
  if (!bookmark?.url) {
    return;
  }

  if (event?.ctrlKey || event?.metaKey) {
    event.preventDefault();
    event.stopPropagation();
    await chrome.tabs.create({ url: bookmark.url, active: false });
    return;
  }

  window.location.href = bookmark.url;
}

export function bindBookmarkOpen(element, bookmark) {
  let suppressClickUntil = 0;

  element.addEventListener("contextmenu", async (event) => {
    if (!event.ctrlKey) {
      return;
    }

    suppressClickUntil = Date.now() + 600;
    await openBookmark(bookmark, event);
  });

  element.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    openBookmark(bookmark, event);
  });
}
