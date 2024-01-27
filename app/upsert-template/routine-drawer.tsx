"use client";

import { useEffect, useState } from "react";
import classnames from "classnames";

import TimeRange from "@/app/components/time-range";

import styles from "./routine-drawer.module.scss";

export default function RoutineDialog({
  open,
  name = "",
  startTime = 0,
  endTime = 0,
  onClose,
  onOk,
}: {
  open: boolean;
  name?: string;
  startTime?: number;
  endTime?: number;
  onClose: () => void;
  onOk: (params: { name: string; startTime: number; endTime: number }) => void;
}) {
  const [currentName, setCurrentName] = useState(name);
  const [currentStartTime, setCurrentStartTime] = useState(startTime);
  const [currentEndTime, setCurrentEndTime] = useState(endTime);

  useEffect(() => {
    setCurrentName(name);
    setCurrentStartTime(startTime);
    setCurrentEndTime(endTime);
  }, [name, startTime, endTime]);

  return (
    <div className={classnames(styles.drawer, open && styles["drawer--open"])}>
      <div className={styles.header}>
        <md-text-button
          onClick={() => {
            onClose();
          }}
          style={{
            "--md-text-button-label-text-color":
              "var(--md-sys-color-on-surface)",
            "--md-text-button-hover-label-text-color":
              "var(--md-sys-color-on-surface)",
          }}
        >
          Cancel
        </md-text-button>
        <h3 className={styles.headerTitle}>Change Routine</h3>
        <md-text-button
          onClick={() =>
            onOk({
              name: currentName,
              startTime: currentStartTime,
              endTime: currentEndTime,
            })
          }
        >
          Done
        </md-text-button>
      </div>

      <div className={styles.content}>
        <md-filled-text-field
          key={open}
          label="Name"
          type="text"
          name="name"
          value={currentName}
          onInput={(e: any) => setCurrentName(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "1rem",
          }}
        ></md-filled-text-field>

        <TimeRange
          startMinute={currentStartTime}
          endMinute={currentEndTime}
          onChange={(params) => {
            setCurrentStartTime(params.startMinute);
            setCurrentEndTime(params.endMinute);
          }}
        ></TimeRange>
      </div>
    </div>
  );
}
