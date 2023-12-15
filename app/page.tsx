"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import Header from "./components/header";
import Routine from "./components/routine";
import { IRoutine } from "./types";
import { getIsNewUser, setIsNewUser } from "./utils/storage/newUser";
import {
  getTemplates,
  getTodayTemplate,
  setDefaultTemplates,
} from "./utils/storage/templates";
import { getMinutesFromRange, getSecondsToday } from "./utils/time";

function sortRoutines(routines: IRoutine[]) {
  return routines.sort((a, b) => {
    return a.startTime - b.startTime || a.endTime - b.endTime;
  });
}

export default function Page() {
  const [routines, setRoutines] = useState<IRoutine[]>([]);

  useEffect(() => {
    const templates = getTemplates();

    const isNewUser = getIsNewUser();
    if (isNewUser && !templates.length) {
      setDefaultTemplates();
      setIsNewUser(false);
    }
    const template = getTodayTemplate(templates);

    if (template) {
      setRoutines(sortRoutines(template.routines));
    }
  }, []);

  useEffect(() => {
    function interval() {
      setRoutines((routines) => {
        const secondsToday = Math.round(getSecondsToday() / 60);

        let beDoingNum = 0;
        return routines.map((d) => {
          let progress = 0;
          let firstBeDoing = false;
          const { startTime, endTime } = d;
          if (endTime >= startTime) {
            // in one day
            if (secondsToday > endTime) {
              progress = 100;
            } else if (secondsToday > startTime) {
              progress = Math.round(
                ((secondsToday - startTime) / (endTime - startTime)) * 100
              );

              beDoingNum++;
              if (beDoingNum === 1) {
                firstBeDoing = true;
              }
            }
          } else {
            // span two days
            if (secondsToday > endTime) {
              progress = Math.round(
                ((secondsToday - endTime) /
                  getMinutesFromRange(startTime, endTime)) *
                  100
              );

              beDoingNum++;
              if (beDoingNum === 1) {
                firstBeDoing = true;
              }
            } else if (secondsToday < startTime) {
              progress = Math.round(
                ((startTime - secondsToday) /
                  getMinutesFromRange(startTime, endTime)) *
                  100
              );

              beDoingNum++;
              if (beDoingNum === 1) {
                firstBeDoing = true;
              }
            }
          }

          return {
            ...d,
            progress,
            firstBeDoing,
          };
        });
      });
    }

    interval();

    const progressInterval = setInterval(interval, 1000 * 60);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

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
        <section>
          <p>No routines.</p>
          <p>
            Please <Link href="/select-template">select a template</Link>.
          </p>
        </section>
      )}
    </>
  );
}
