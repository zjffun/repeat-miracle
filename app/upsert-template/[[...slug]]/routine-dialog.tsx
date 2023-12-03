"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import TimeRange from "@/app/components/time-range";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentName, setCurrentName] = useState(name);
  const [currentStartTime, setCurrentStartTime] = useState(startTime);
  const [currentEndTime, setCurrentEndTime] = useState(endTime);

  useLayoutEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    dialogEl.addEventListener("closed", onClose);
    return () => {
      dialogEl.removeEventListener("closed", onClose);
    };
  });

  useEffect(() => {
    setCurrentName(name);
    setCurrentStartTime(startTime);
    setCurrentEndTime(endTime);
  }, [name, startTime, endTime]);

  useEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    if (open) {
      dialogEl?.show?.();
    } else {
      dialogEl?.close?.();
    }
  }, [open]);

  return (
    <div>
      <md-dialog ref={dialogRef}>
        <div slot="content">
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

        <div slot="actions">
          <md-text-button
            value="cancel"
            onClick={() => {
              dialogRef.current?.close();
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
          <md-text-button
            value="ok"
            onClick={() =>
              onOk({
                name: currentName,
                startTime: currentStartTime,
                endTime: currentEndTime,
              })
            }
          >
            Ok
          </md-text-button>
        </div>
      </md-dialog>
    </div>
  );
}
