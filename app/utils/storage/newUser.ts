import {
  StorageKey,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "./storage";

export function setIsNewUser(value: boolean) {
  return safeLocalStorageSetItem(StorageKey.IsNewUser, value);
}

export function getIsNewUser(): boolean {
  return safeLocalStorageGetItem(StorageKey.IsNewUser, true);
}
