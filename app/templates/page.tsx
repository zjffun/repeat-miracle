"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import SubHeader from "../components/sub-header";
import { ITemplate } from "../types";
import {
  getTemplates,
  processTemplate,
  upsertTemplate,
  setDefaultTemplates,
} from "../utils/storage/templates";

import styles from "./page.module.css";
import AddDefaultTemplatesListItem from "../components/add-default-templates-list-item";

export default function Page() {
  const router = useRouter();

  const toastRef = useRef<any>(null);

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  function handleAddClick() {
    router.push("/upsert-template");
  }

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

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

        setTemplates(templates);
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

  function handleAddDefaultClick() {
    setDefaultTemplates();
    setTemplates(getTemplates());
  }

  return (
    <>
      <SubHeader
        actionItems={
          <md-icon-button onClick={handleAddClick}>
            <md-icon>add</md-icon>
          </md-icon-button>
        }
      >
        Templates
      </SubHeader>
      <main className={styles.main}>
        <md-list className="list">
          {templates.map((d) => {
            const search = new URLSearchParams({
              id: d.id,
            }).toString();
            return (
              <>
                <Link key={d.id} href={`/upsert-template?${search}`}>
                  <md-list-item type="button">
                    <md-icon slot="start">description</md-icon>
                    <div slot="headline">{d.name}</div>
                  </md-list-item>
                </Link>
              </>
            );
          })}

          <AddDefaultTemplatesListItem
            onClick={() => setTemplates(getTemplates())}
          ></AddDefaultTemplatesListItem>

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
