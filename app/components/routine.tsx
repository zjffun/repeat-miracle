import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IRoutine } from "../types";
import { minutesToHhmm } from "../utils/time";

import styles from "./routine.module.css";

export default function Routine({ data }: { data: IRoutine }) {
  const name = data.name;
  const startTime = minutesToHhmm(data.startTime);
  const endTime = minutesToHhmm(data.endTime);
  const note = "";

  return (
    <section className={styles.routine}>
      <div className={styles.name}>{name}</div>
      <div className={styles.time}>
        <FontAwesomeIcon className="mr-1" width="1em" icon={faClock} />{" "}
        {startTime} - {endTime}
      </div>
      <div className={styles.note}>{note}</div>
    </section>
  );
}
