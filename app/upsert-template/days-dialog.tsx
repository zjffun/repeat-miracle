"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { daysOfWeek } from "../utils/time";

export default function RoutineDialog({
  open,
  days = [],
  onClose,
  onOk,
}: {
  open: boolean;
  days?: boolean[];
  onClose: () => void;
  onOk: (params: { days: boolean[] }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentDays, setCurrentDays] = useState(days);

  useLayoutEffect(() => {
    import("@material/web/checkbox/checkbox.js");
  }, []);

  useLayoutEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    dialogEl.addEventListener("closed", onClose);
    return () => {
      dialogEl.removeEventListener("closed", onClose);
    };
  });

  useEffect(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    setCurrentDays(days);

    if (open) {
      dialogEl?.show?.();
    } else {
      dialogEl?.close?.();
    }
  }, [days, open]);

  return (
    <div>
      <md-dialog ref={dialogRef}>
        <div slot="content">
          <md-list>
            {daysOfWeek.map((day, i) => {
              return (
                <md-list-item
                  key={i}
                  onClick={() => {
                    setCurrentDays((days) => {
                      const newDays = [...days];
                      newDays[i] = !newDays[i];
                      return newDays;
                    });
                  }}
                  type="button"
                >
                  <div slot="headline">{day}</div>
                  <md-icon
                    style={{
                      display: currentDays[i] ? "block" : "none",
                    }}
                    slot="end"
                  >
                    checked
                  </md-icon>
                </md-list-item>
              );
            })}
          </md-list>
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
                days: currentDays,
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
