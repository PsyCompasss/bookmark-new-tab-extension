const PINNED_KEY = "pinned";

export async function getPinnedIds() {
  const result = await chrome.storage.local.get({ [PINNED_KEY]: [] });
  return Array.isArray(result[PINNED_KEY]) ? result[PINNED_KEY].filter((id) => typeof id === "string") : [];
}

export async function setPinnedIds(ids) {
  const uniqueIds = Array.from(new Set(ids.filter((id) => typeof id === "string")));
  await chrome.storage.local.set({ [PINNED_KEY]: uniqueIds });
  return uniqueIds;
}

export async function pinBookmark(id) {
  const pinnedIds = await getPinnedIds();
  if (!pinnedIds.includes(id)) {
    pinnedIds.push(id);
  }
  return setPinnedIds(pinnedIds);
}

export async function unpinBookmark(id) {
  const pinnedIds = await getPinnedIds();
  return setPinnedIds(pinnedIds.filter((pinnedId) => pinnedId !== id));
}

export function isPinned(id, pinnedIds) {
  return Array.isArray(pinnedIds) && pinnedIds.includes(id);
}
