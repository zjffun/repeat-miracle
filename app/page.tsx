"use client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import Header from "./components/header";
import Routine from "./components/routine";
import { IRoutine } from "./types";
import { getDay, setDay } from "./utils/days";
import { getTemplates } from "./utils/templates";

export default function Page() {
  const date = dayjs().format("YYYY-MM-DD");

  const [routines, setRoutines] = useState<IRoutine[]>([]);

  useEffect(() => {
    const day = getDay(date);
    if (day) {
      setRoutines(day.routines);
      return;
    }

    try {
      // TODO: select
      const template = getTemplates()[0];
      if (!template) return;

      setDay({
        date,
        routines: template.routines,
      });

      setRoutines(template.routines);
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }, [date]);

  return (
    <>
      <Header></Header>
      {routines.length ? (
        <md-list className="routine-list">
          {routines.map((d, i) => {
            return <Routine key={i} data={d}></Routine>;
          })}
        </md-list>
      ) : (
        <div>No routines.</div>
      )}
    </>
  );
}
