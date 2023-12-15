import { nanoid } from "nanoid";
import { IRoutine, ITemplate } from "../../types";
import {
  StorageKey,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "./storage";
import { formatDate } from "../time";
import { getTodayInfo } from "./todayInfo";

export function getTemplates(): ITemplate[] {
  return safeLocalStorageGetItem(StorageKey.Templates, []);
}

export function getTemplate(id: string) {
  const templates = getTemplates();
  return templates.find((day) => day.id === id);
}

export function saveTemplate(templates: ITemplate[]) {
  return safeLocalStorageSetItem(StorageKey.Templates, templates);
}

export function upsertTemplate({
  id,
  name,
  routines,
  daysOfWeek,
}: {
  id?: string;
  name: string;
  routines: IRoutine[];
  daysOfWeek: boolean[];
}) {
  const templates = getTemplates();

  if (id) {
    // update
    let newTemplate;
    const newTemplates = templates.map((d) => {
      if (d.id === id) {
        newTemplate = { ...d, name, routines, daysOfWeek };
        return newTemplate;
      }
      return d;
    });

    saveTemplate(newTemplates);
    return newTemplate;
  }

  // insert
  const newTemplate = { id: nanoid(), name, routines, daysOfWeek };
  const newTemplates = [...templates, newTemplate];
  saveTemplate(newTemplates);
  return newTemplate;
}

export function setTemplate({
  id,
  name,
  routines,
}: {
  id: string;
  name: string;
  routines: IRoutine[];
}) {
  const templates = getTemplates();
  const newTemplates = templates.map((d) => {
    if (d.id === id) {
      return { ...d, name, routines };
    }
    return d;
  });

  return safeLocalStorageSetItem(StorageKey.Templates, newTemplates);
}

export function setDefaultTemplates() {
  upsertTemplate({
    name: "Dream Weekdays",
    routines: [
      {
        id: "dream-work-day-1",
        name: "Sleep",
        startTime: 0,
        endTime: 480,
      },
      {
        id: "dream-work-day-2",
        name: "Work",
        startTime: 480,
        endTime: 960,
      },
      {
        id: "dream-work-day-3",
        name: "Recreation",
        startTime: 960,
        endTime: 0,
      },
    ],
    daysOfWeek: [false, true, true, true, true, true, false],
  });

  upsertTemplate({
    name: "Dream Weekends",
    routines: [
      {
        id: "dream-free-day-1",
        name: "Sleep",
        startTime: 0,
        endTime: 480,
      },
      {
        id: "dream-free-day-2",
        name: "Learn",
        startTime: 480,
        endTime: 960,
      },
      {
        id: "dream-free-day-3",
        name: "Recreation",
        startTime: 960,
        endTime: 0,
      },
    ],
    daysOfWeek: [true, false, false, false, false, false, true],
  });

  return;
}

export function getTodayTemplate(
  templates: ITemplate[]
): ITemplate | undefined {
  const date = new Date();
  const dateStr = formatDate(date);
  const todayInfo = getTodayInfo();

  let template;
  if (todayInfo.date !== dateStr) {
    template = templates.find((d) => d.id === todayInfo.templateId);
  }

  if (template) {
    return template;
  }

  const day = date.getDay();
  for (const template of templates) {
    if (template?.daysOfWeek?.[day]) {
      return template;
    }
  }

  return templates[0];
}
