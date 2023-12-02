"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ITemplate } from "@/app/types";
import { getTemplate } from "@/app/utils/templates";
import Routine from "../../components/routine";
import SubHeader from "../../components/sub-header";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();

  const [template, setTemplate] = useState<ITemplate | null>(null);

  const params = useParams();

  function handleEditClick() {
    router.push(`/upsert-template/${params.slug}`);
  }

  function updateTemplateData() {
    const tmp = getTemplate(params.slug as string);
    if (!tmp) {
      return;
    }

    setTemplate(tmp);
  }

  useEffect(() => {
    updateTemplateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

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
