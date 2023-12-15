"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ITemplate } from "@/app/types";
import { getTemplate } from "@/app/utils/storage/templates";
import Routine from "../components/routine";
import SubHeader from "../components/sub-header";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();

  const [template, setTemplate] = useState<ITemplate | null>(null);

  const params = useSearchParams();

  const id = params.get("id") || "";

  function handleEditClick() {
    const searchParams = new URLSearchParams({ id });

    router.push(`/upsert-template?${searchParams.toString()}`);
  }

  function updateTemplateData() {
    const tmp = getTemplate(id as string);
    if (!tmp) {
      return;
    }

    setTemplate(tmp);
  }

  useEffect(() => {
    updateTemplateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const routines = template?.routines || [];

  return (
    <>
      <SubHeader
        actionItems={
          <md-icon-button onClick={handleEditClick}>
            <md-icon>edit_square</md-icon>
          </md-icon-button>
        }
      >
        <span>{template?.name} - Template</span>
      </SubHeader>
      <main className={styles.main}>
        {routines.length ? (
          <md-list>
            {routines.map((d, i) => {
              return <Routine key={i} data={d}></Routine>;
            })}
          </md-list>
        ) : (
          <div>No routines.</div>
        )}
      </main>
    </>
  );
}
