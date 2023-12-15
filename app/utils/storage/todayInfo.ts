import { ITodayInfo } from "@/app/types";
import {
  StorageKey,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "./storage";

export function setTodayInfo(value: ITodayInfo) {
  return safeLocalStorageSetItem(StorageKey.TodayInfo, value);
}

export function getTodayInfo(): ITodayInfo {
  return safeLocalStorageGetItem(StorageKey.TodayInfo, {});
}
