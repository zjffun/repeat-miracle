"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ITemplate } from "@/app/types";
import { getTemplate } from "@/app/utils/templates";
import Routine from "../../components/routine";
import SubHeader from "../../components/sub-header";

import styles from "./page.module.css";

export default function Page() {
  const [template, setTemplate] = useState<ITemplate | null>(null);

  const params = useParams();

  useEffect(() => {
    const tmp = getTemplate(params.slug as string);
    if (!tmp) {
      return;
    }

    setTemplate(tmp);
  }, [params.slug]);

  const routines = template?.routines || [];

  return (
    <>
      <SubHeader>Template {template?.name}</SubHeader>
      <main className={styles.main}>
        {routines.length ? (
          <ul className="routine-list">
            {routines.map((d, i) => {
              return (
                <li key={i}>
                  <Routine data={d}></Routine>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>No routines.</div>
        )}
      </main>
    </>
  );
}
