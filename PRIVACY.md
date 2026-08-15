# Privacy Policy / 隐私政策

Effective date: August 15, 2026
生效日期：2026 年 8 月 15 日

## English

Bookmark Dashboard – New Tab (the "extension") replaces Chrome's new-tab page with a local bookmark dashboard. This policy explains how the extension handles user data.

### Data the extension accesses

The extension uses Chrome's `bookmarks` permission to access bookmark titles, URLs, identifiers, and folder structure. It uses this information only to display folders and bookmarks, search them locally, open selected bookmarks, and reorder bookmarks when the user explicitly drags them.

The extension uses Chrome's `storage` permission to save only the identifiers of bookmarks that the user pins. Pinned identifiers are stored in `chrome.storage.local` on the user's device.

### Data collection, transmission, and sharing

The extension does not send bookmark data or pinned identifiers to the developer or any external server. It contains no analytics, advertising, tracking, remote scripts, accounts, or developer-operated network service. The developer does not sell, share, or allow humans to read user data handled by the extension.

### Retention and deletion

Bookmark content remains in the user's Chrome browser profile. Pinned bookmark identifiers remain in local extension storage until the user unpins them, clears the extension's local data, or uninstalls the extension. References to deleted bookmarks are removed automatically when the extension runs.

### Permissions

- `bookmarks`: required to display and search bookmarks and to apply user-requested drag-and-drop reordering.
- `storage`: required to remember pinned bookmark identifiers locally.

### Limited Use

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements. Data is used only to provide the extension's disclosed, user-facing bookmark dashboard features.

### Changes and contact

Material changes to this policy will be published in this repository before the related extension update. Questions may be submitted through [GitHub Issues](https://github.com/PsyCompasss/bookmark-new-tab-extension/issues).

## 中文

书签桌面 – 新标签页（以下简称“本扩展”）会将 Chrome 默认新标签页替换为本地书签桌面。本政策说明扩展如何处理用户数据。

### 扩展访问的数据

本扩展使用 Chrome 的 `bookmarks` 权限访问书签标题、URL、标识符和文件夹结构。这些信息仅用于显示文件夹与书签、在本地搜索、打开用户选择的书签，以及在用户明确拖拽时调整书签顺序。

本扩展使用 Chrome 的 `storage` 权限，仅保存用户固定的书签标识符。这些标识符通过 `chrome.storage.local` 保存在用户设备上。

### 数据收集、传输与共享

本扩展不会把书签数据或固定书签标识符发送给开发者或任何外部服务器。扩展不包含数据分析、广告、跟踪、远程脚本、用户账号或由开发者运营的网络服务。开发者不会出售、共享扩展处理的用户数据，也不会允许人工阅读这些数据。

### 保留与删除

书签内容始终保留在用户的 Chrome 浏览器配置中。固定书签标识符会保留在扩展的本地存储中，直到用户取消固定、清除扩展本地数据或卸载扩展。扩展运行时会自动清理已删除书签的引用。

### 权限

- `bookmarks`：用于显示和搜索书签，并在用户拖放后执行用户要求的排序。
- `storage`：用于在本地记住已固定的书签标识符。

### Limited Use 限制性使用

本扩展对从 Google API 获取的信息之使用，将遵守 Chrome Web Store User Data Policy，包括 Limited Use 要求。数据仅用于提供已披露的、面向用户的书签桌面功能。

### 政策变更与联系

若本政策发生实质变更，将在相关扩展更新发布前先公布于本仓库。如有问题，可通过 [GitHub Issues](https://github.com/PsyCompasss/bookmark-new-tab-extension/issues) 提交。
