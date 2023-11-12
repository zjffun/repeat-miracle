import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

import { IRoutine } from "../types";

import styles from "./routine.module.css";

export default function Routine({ data }: { data: IRoutine }) {
  const name = data.name;
  const startTime = dayjs(data.startTime).format("hh:mm");
  const endTime = dayjs(data.endTime).format("hh:mm");
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
