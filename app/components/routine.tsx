import classNames from "classnames";
import { useEffect, useRef } from "react";

import { IRoutine, RoutineState } from "../types";
import { minutesToHhmm } from "../utils/time";

import styles from "./routine.module.scss";

export default function Routine({
  data,
  interactive,
  end,
}: {
  data: IRoutine;
  interactive?: boolean;
  end?: React.ReactElement;
}) {
  const routineEl = useRef<HTMLDivElement>(null);
  const name = data.name;
  const startTime = minutesToHhmm(data.startTime);
  const endTime = minutesToHhmm(data.endTime);

  const progress = data.progress || 0;
  let state;
  if (progress === 100) {
    state = RoutineState.Done;
  } else if (progress > 0 && progress < 100) {
    state = RoutineState.BeDoing;
  } else {
    state = RoutineState.Todo;
  }

  useEffect(() => {
    // wait for elements stable
    setTimeout(() => {
      if (data?.firstBeDoing) {
        const element = routineEl?.current;
        if (element) {
          element.scrollIntoView();
        }
      }
    }, 500);
  }, [data?.firstBeDoing]);

  return (
    <>
      <div
        ref={routineEl}
        className={classNames(styles["routine"], {
          [styles["routine--done"]]: state === RoutineState.Done,
          [styles["routine--be-doing"]]: state === RoutineState.BeDoing,
          [styles["routine--todo"]]: state === RoutineState.Todo,
        })}
        style={{
          background: `linear-gradient(to right, var(--background) 0%, var(--background) ${progress}%, transparent ${progress}%, transparent 100%)`,
        }}
      >
        <md-list-item interactive={interactive}>
          <div slot="headline">{name}</div>
          <div
            slot="supporting-text"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <md-icon
              style={{
                fontSize: "1rem",
                height: "1rem",
                width: "1rem",
                marginRight: "0.25rem",
              }}
            >
              schedule
            </md-icon>
            {startTime} - {endTime}
          </div>
          {end}
        </md-list-item>
      </div>
      <md-divider></md-divider>
    </>
  );
}
