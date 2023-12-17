import {
  StorageKey,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "./storage/storage";

export function getIsDark() {
  const isDark = safeLocalStorageGetItem(StorageKey.Dark, true);

  return isDark;
}

export function toggleIsDark() {
  const isDark = safeLocalStorageGetItem(StorageKey.Dark, true);

  safeLocalStorageSetItem(StorageKey.Dark, !isDark);

  return;
}
