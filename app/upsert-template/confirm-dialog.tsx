"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  onClose,
  onOk,
}: {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

    if (open) {
      dialogEl?.show?.();
    } else {
      dialogEl?.close?.();
    }
  }, [open]);

  return (
    <div>
      <md-dialog ref={dialogRef}>
        <div slot="content">Go back without saving?</div>
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
          <md-text-button value="ok" onClick={() => onOk()}>
            Ok
          </md-text-button>
        </div>
      </md-dialog>
    </div>
  );
}
