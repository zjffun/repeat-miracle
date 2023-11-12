"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AddTemplate from "../components/add-template";
import SubHeader from "../components/sub-header";
import { ITemplate } from "../types";
import { getTemplates } from "../utils/templates";

import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const [addVisible, setAddVisible] = useState(false);

  function showTemplate(id: string) {
    router.push(`/template/${id}`);
  }

  function handleAddClick() {
    setAddVisible(true);
  }

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  return (
    <>
      <SubHeader>
        <div className="flex flex-1">
          Templates
          <span className="flex-1"></span>
          <button onClick={handleAddClick}>Add</button>
        </div>
      </SubHeader>
      <main className={styles.main}>
        <ul>
          {templates.map((d) => {
            return (
              <li key={d.id} onClick={() => showTemplate(d.id)}>
                {d.name}
              </li>
            );
          })}
        </ul>
      </main>
      {addVisible && (
        <AddTemplate
          onCreate={() => {
            setTemplates(getTemplates());
            setAddVisible(false);
          }}
          onCancel={() => setAddVisible(false)}
        ></AddTemplate>
      )}
    </>
  );
}
