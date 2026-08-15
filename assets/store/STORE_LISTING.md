# Chrome Web Store listing and SEO

Prepared for version `1.1.6`. Keep the manifest, listing, privacy fields, privacy policy, and actual extension behavior consistent.

## Global settings

- Primary category: `Workflow & Planning`
- Alternative category if the dashboard does not offer that option: `Tools`
- Pricing: Free
- Mature content: No
- Regions: All supported regions
- Intended visibility after approval: Public
- Homepage: `https://github.com/PsyCompasss/bookmark-new-tab-extension`
- Support: `https://github.com/PsyCompasss/bookmark-new-tab-extension/issues`
- Privacy policy: `https://github.com/PsyCompasss/bookmark-new-tab-extension/blob/main/PRIVACY.md`
- Official URL: Leave empty unless the publisher verifies a domain in Google Search Console.

Do not enter the privacy-policy URL until `PRIVACY.md` is publicly available on the default branch.

## English listing

### Name

```text
Bookmark Dashboard – New Tab
```

### Short description

```text
Turn your Chrome bookmarks into a searchable, privacy-friendly new-tab dashboard.
```

### Detailed description

```text
Open every new tab to the bookmarks you already saved.

Bookmark Dashboard replaces Chrome's default new-tab page with a clean workspace for browsing folders, finding saved sites, pinning frequently used links, and arranging bookmarks in the order you prefer.

WHAT YOU CAN DO

- Browse your existing bookmark folders in a collapsible sidebar.
- Search saved titles and URLs instantly.
- Pin frequently used bookmarks to the top of the page.
- Drag and drop bookmarks to reorder them inside the selected folder.
- Open links in the current tab or use Command/Ctrl-click for a background tab.
- Use the interface in English or Simplified Chinese.

PRIVACY BY DESIGN

- Everything runs locally in your browser.
- No account, analytics, advertising, tracking, or remote scripts.
- Bookmark titles, URLs, and folder structure are used only to provide the visible dashboard features.
- Only the IDs of bookmarks you pin are stored locally with chrome.storage.local.
- No bookmark data is sent to the developer or any external server.

Important: Drag-and-drop reordering changes the actual order in your Chrome bookmarks.

Bookmark Dashboard is free, open source, dependency-free, and built with Manifest V3.
```

### Screenshot upload order

1. `screenshots/en/01-overview.png` — complete dashboard with folders, pinned links, and bookmark cards.
2. `screenshots/en/02-search.png` — local search across saved titles and URLs.
3. `screenshots/en/03-folder.png` — browsing a nested folder.
4. `screenshots/en/04-pinned.png` — pinning a frequently used bookmark.
5. `screenshots/en/05-reorder.png` — drag-and-drop reorder state.

## Simplified Chinese listing

### Name

```text
书签桌面 – 新标签页
```

### Short description

```text
把 Chrome 书签变成可搜索、注重隐私的新标签页桌面。
```

### Detailed description

```text
每次打开新标签页，直接使用你已经收藏的 Chrome 书签。

书签桌面会把 Chrome 默认新标签页变成一个整洁的工作台，让你可以浏览文件夹、快速查找已收藏的网站、固定常用链接，并调整书签顺序。

主要功能

- 在可折叠侧边栏中浏览现有书签文件夹。
- 按标题或 URL 即时搜索。
- 将常用书签固定在页面顶部。
- 通过拖放调整选中文件夹中的书签顺序。
- 在当前标签页打开链接，或使用 Command/Ctrl + 单击在后台标签页打开。
- 根据 Chrome 界面语言显示英文或简体中文。

注重隐私

- 所有功能都在浏览器本地运行。
- 不需要账号，不包含数据分析、广告、跟踪或远程脚本。
- 书签标题、URL 和文件夹结构仅用于提供界面上的书签桌面功能。
- 只会通过 chrome.storage.local 在本地保存用户固定的书签 ID。
- 不会把书签数据发送给开发者或任何外部服务器。

请注意：拖放排序会改变 Chrome 收藏夹中的实际书签顺序。

书签桌面完全免费、开源、无外部依赖，并使用 Manifest V3 构建。
```

### Screenshot upload order

1. `screenshots/zh_CN/01-overview.png` — 书签桌面总览。
2. `screenshots/zh_CN/02-search.png` — 按标题和 URL 本地搜索。
3. `screenshots/zh_CN/03-folder.png` — 浏览嵌套文件夹。
4. `screenshots/zh_CN/04-pinned.png` — 固定常用书签。
5. `screenshots/zh_CN/05-reorder.png` — 拖放排序状态。

## Privacy practices fields

Use English for reviewer-facing justification fields.

### Single purpose

```text
Replace Chrome's new-tab page with a local dashboard for browsing, searching, pinning, opening, and reordering the user's existing bookmarks.
```

### `bookmarks` permission justification

```text
Required to read bookmark titles, URLs, IDs, and folder structure so the extension can display and search the user's existing bookmarks. It is also required to move a bookmark only when the user explicitly reorders it by drag and drop.
```

### `storage` permission justification

```text
Required to store only the IDs of bookmarks the user chooses to pin. These IDs are saved locally with chrome.storage.local and are not transmitted.
```

### Remote code

Select: `No, I am not using remote code.`

All HTML, CSS, JavaScript, icons, and localization files executed by the extension are included in the submitted ZIP.

### Data handling summary

```text
The extension locally processes bookmark titles, URLs, IDs, and folder structure to provide its visible bookmark dashboard. It stores only pinned bookmark IDs in chrome.storage.local. It does not transmit user data, use analytics or advertising, operate a server, sell or share data, or allow humans to read user data.
```

The dashboard's available data-type labels can change. During submission:

1. If a dedicated `Bookmarks` data type is shown, select it.
2. Otherwise, if bookmark URLs are grouped under `Web history`, select `Web history` and rely on the precise local-processing explanation above.
3. Do not select unrelated categories such as personally identifiable information, financial information, authentication information, location, personal communications, or health information.
4. Complete every applicable Limited Use certification truthfully.

## Release notes

### English

```text
Initial Chrome Web Store release of Bookmark Dashboard. Includes folder browsing, local bookmark search, pinned bookmarks, drag-and-drop reordering, English and Simplified Chinese interfaces, and a privacy-first local architecture with no analytics or ads.
```

### Simplified Chinese

```text
书签桌面首个 Chrome Web Store 版本。支持文件夹浏览、本地书签搜索、固定常用书签、拖放排序以及中英文界面；不包含数据分析或广告。
```

## GitHub SEO recommendations

### Repository description

```text
Privacy-friendly Chrome new-tab extension that turns bookmarks into a searchable dashboard with folders, pinning, and drag-and-drop reordering.
```

### Topics

```text
bookmarks
bookmark-manager
chrome-extension
browser-extension
manifest-v3
new-tab-page
productivity
privacy
javascript
```

### Social preview

Upload `promo/github-social-preview-1280x640.png` in repository Settings → Social preview.

## Keyword map

Use these phrases naturally; do not paste them as a keyword list into the store description.

| Intent | English | Simplified Chinese |
|---|---|---|
| Primary | bookmark dashboard, Chrome bookmarks, new tab | Chrome 书签, 新标签页, 书签桌面 |
| Feature | search bookmarks, bookmark folders, pin bookmarks | 书签搜索, 书签文件夹, 固定书签 |
| Trust | private bookmarks, local processing, open source | 本地处理, 不上传书签, 开源扩展 |

Avoid claiming cloud sync, AI organization, duplicate removal, bookmark import/export, cross-browser support, or mobile support. Those features do not exist in version `1.1.6`.
