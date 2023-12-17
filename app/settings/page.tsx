"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import AddDefaultTemplatesListItem from "../components/add-default-templates-list-item";
import SubHeader from "../components/sub-header";
import { ITemplate } from "../types";
import { getIsDark, toggleIsDark } from "../utils/dark";
import {
  getTemplates,
  processTemplate,
  upsertTemplate,
} from "../utils/storage/templates";
import useSwipe from "../utils/useSwipe";
import ListItem from "./list-item";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();

  const toastRef = useRef<any>(null);

  const [isDark, setIsDark] = useState(true);

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const { addListener, removeListener } = useSwipe();

  function handleAddClick() {
    router.push("/upsert-template");
  }

  function setTemplatesFromStorage() {
    setTemplates(getTemplates());
  }

  function handleToggleColorSchemeClick() {
    toggleIsDark();
    location.reload();
  }

  function handleExportClick() {
    const data = JSON.stringify(templates, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `repeat-miracle-templates-${new Date().toISOString()}.json`;
    a.click();
  }

  function handleImportClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      try {
        const file = input.files?.[0];
        if (!file) {
          return;
        }

        const data = await file.text();
        const templates = JSON.parse(data);

        for (const template of templates) {
          const processedTemplate = processTemplate(template);
          upsertTemplate(processedTemplate);
        }

        setTemplatesFromStorage();
      } catch (error) {
        console.error(error);
        toastRef.current?.open(
          "Import templates failed. Please check the json file.",
          "error"
        );
      }
    };
    input.click();
  }

  useLayoutEffect(() => {
    import("@material/web/switch/switch.js");
  }, []);

  useEffect(() => {
    setTemplatesFromStorage();
    setIsDark(getIsDark());
  }, []);

  return (
    <>
      <SubHeader
        actionItems={
          <md-icon-button onClick={handleAddClick}>
            <md-icon>add</md-icon>
          </md-icon-button>
        }
      >
        Settings
      </SubHeader>
      <main className={styles.main}>
        <md-list className="list">
          {templates.map((d) => {
            return (
              <ListItem
                key={d.id}
                data={d}
                onDelete={setTemplatesFromStorage}
                addListener={addListener}
                removeListener={removeListener}
              ></ListItem>
            );
          })}

          {!templates.length && (
            <AddDefaultTemplatesListItem
              onClick={setTemplatesFromStorage}
            ></AddDefaultTemplatesListItem>
          )}

          <md-divider></md-divider>

          <md-list-item type="button" onClick={handleToggleColorSchemeClick}>
            <md-icon slot="start">dark_mode</md-icon>
            <div slot="headline">Dark Mode</div>

            <md-switch
              slot="end"
              {...(isDark && {
                selected: true,
              })}
              show-only-selected-icon
            ></md-switch>
          </md-list-item>

          <md-divider></md-divider>

          <md-list-item type="button" onClick={handleExportClick}>
            <md-icon slot="start">download</md-icon>
            <div slot="headline">Export Templates</div>
          </md-list-item>

          <md-list-item type="button" onClick={handleImportClick}>
            <md-icon slot="start">upload</md-icon>
            <div slot="headline">Import Templates</div>
          </md-list-item>
        </md-list>
      </main>

      <dile-toast ref={toastRef} duration="3000"></dile-toast>
    </>
  );
}
