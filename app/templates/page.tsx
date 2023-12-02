"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SubHeader from "../components/sub-header";
import { ITemplate } from "../types";
import { getTemplates } from "../utils/templates";

import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  const router = useRouter();

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  function handleAddClick() {
    router.push("/upsert-template");
  }

  useEffect(() => {
    setTemplates(getTemplates());
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
        Templates
      </SubHeader>
      <main className={styles.main}>
        <md-list className="list">
          {templates.map((d) => {
            return (
              <Link key={d.id} href={`/template/${d.id}`}>
                <md-list-item>
                  <div slot="headline">{d.name}</div>
                </md-list-item>
              </Link>
            );
          })}
        </md-list>
      </main>
    </>
  );
}
