export function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

export function localizeDocument(root = document) {
  document.documentElement.lang = t("localeCode");
  document.title = t("pageTitle");

  for (const element of root.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }

  localizeAttribute(root, "data-i18n-placeholder", "placeholder");
  localizeAttribute(root, "data-i18n-aria-label", "aria-label");
  localizeAttribute(root, "data-i18n-title", "title");
}

function localizeAttribute(root, dataAttribute, targetAttribute) {
  for (const element of root.querySelectorAll(`[${dataAttribute}]`)) {
    element.setAttribute(targetAttribute, t(element.getAttribute(dataAttribute)));
  }
}
