export enum StorageKey {
  IsNewUser = "repeat-miracle-is-new-user",
  Templates = "repeat-miracle-templates",
  TodayInfo = "repeat-miracle-today",
}

export function safeLocalStorageGetItem(key: string, fallback: any) {
  try {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return fallback;
  } catch (error) {
    return fallback;
  }
}

export function safeLocalStorageSetItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}
