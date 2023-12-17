"use client";
import { useEffect, useState } from "react";

import AddDefaultTemplatesListItem from "./components/add-default-templates-list-item";
import Header from "./components/header";
import Routine from "./components/routine";
import { IRoutine } from "./types";
import { sortRoutines } from "./utils/routines";
import { getIsNewUser, setIsNewUser } from "./utils/storage/newUser";
import {
  getTemplates,
  getTodayTemplate,
  setDefaultTemplates,
} from "./utils/storage/templates";
import { getMinutesFromRange, getSecondsToday } from "./utils/time";

export default function Page() {
  const [routines, setRoutines] = useState<IRoutine[]>([]);

  function setTodayTemplate() {
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
  }

  useEffect(() => {
    setTodayTemplate();
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
            if (secondsToday <= endTime) {
              progress = Math.round(
                ((endTime - secondsToday) /
                  getMinutesFromRange(startTime, endTime)) *
                  100
              );

              beDoingNum++;
              if (beDoingNum === 1) {
                firstBeDoing = true;
              }
            } else if (secondsToday >= startTime) {
              progress = Math.round(
                ((secondsToday - startTime) /
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
        <AddDefaultTemplatesListItem
          onClick={setTodayTemplate}
        ></AddDefaultTemplatesListItem>
      )}
    </>
  );
}
