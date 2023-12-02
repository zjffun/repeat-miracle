import { nanoid } from "nanoid";
import { IRoutine, ITemplate } from "../types";

// TODO: use indexedDB instead of localStorage

export function getTemplates(): ITemplate[] {
  try {
    return JSON.parse(localStorage.getItem("repeat-miracle-templates") || "[]");
  } catch (error) {
    return [];
  }
}

export function getTemplate(id: string) {
  const templates = getTemplates();
  return templates.find((day) => day.id === id);
}

export function saveTemplate(templates: ITemplate[]) {
  localStorage.setItem("repeat-miracle-templates", JSON.stringify(templates));
}

export function upsertTemplate({
  id,
  name,
  routines,
}: {
  id?: string;
  name: string;
  routines: IRoutine[];
}) {
  const templates = getTemplates();

  if (id) {
    // update
    let newTemplate;
    const newTemplates = templates.map((d) => {
      if (d.id === id) {
        newTemplate = { ...d, name, routines };
        return newTemplate;
      }
      return d;
    });

    saveTemplate(newTemplates);
    return newTemplate;
  }

  // insert
  const newTemplate = { id: nanoid(), name, routines };
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

  localStorage.setItem(
    "repeat-miracle-templates",
    JSON.stringify(newTemplates)
  );
}
