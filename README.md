# Bookmark New Tab Extension

A lightweight Chrome extension that replaces the new-tab page with a clean,
searchable view of your existing Chrome bookmarks.

The extension runs locally in the browser. It has no build step, no external
dependencies, and does not send bookmark data to a server.

## Screenshots

### Bookmark overview

![Bookmark overview with pinned bookmarks, folders, and bookmark cards](assets/screenshots/overview.jpg)

| Search bookmarks | Browse folders |
| --- | --- |
| ![Search results for Chrome bookmarks](assets/screenshots/search.jpg) | ![Bookmarks inside the Development folder](assets/screenshots/folder.jpg) |

The screenshots use fictional sample bookmarks; no personal bookmark data is included.

## Features

- Browse Chrome bookmark folders in a collapsible sidebar.
- Search bookmark titles and URLs.
- Pin frequently used bookmarks to the top of the page.
- Drag bookmarks to reorder them within the selected folder.
- Open a bookmark in the current tab, or use Command/Ctrl-click for a background tab.
- Store pinned bookmark IDs locally with `chrome.storage.local`.

## Install from source

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose this repository folder.
6. Open a new tab.

## Permissions

The extension requests only:

- `bookmarks` to display and reorder the user's Chrome bookmarks.
- `storage` to remember pinned bookmark IDs locally.

## Development

This is a dependency-free Manifest V3 extension. Edit the HTML, CSS, or JavaScript
files directly, then select **Reload** for the extension on `chrome://extensions`.

## Project structure

```text
manifest.json            Extension metadata and permissions
newtab.html              New-tab page shell
newtab.js                Application state and event coordination
bookmarkService.js       Chrome bookmarks API adapter
bookmarkNavigation.js    Bookmark opening behavior
treeBuilder.js           Bookmark tree normalization and traversal
search.js                Bookmark flattening and search
pinned.js                Pinned bookmark persistence
ui/                      Sidebar, grid, and pinned-bar rendering
styles.css               Responsive glass-style interface
```

## Privacy

The extension does not include analytics, advertising, remote scripts, or network
requests. Bookmark content remains in the user's browser profile.

## License

MIT

## 中文说明

这是一个无依赖的 Chrome 新标签页扩展，用于本地展示、搜索、固定和排序 Chrome 书签。
它不会上传书签数据，也不包含分析、广告或远程代码。
