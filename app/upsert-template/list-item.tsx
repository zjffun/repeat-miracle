"use client";

import classNames from "classnames";
import { useLayoutEffect, useState } from "react";

import { RoutineListItemContent } from "../components/routine";
import { IRoutine } from "../types";
import useSwipe from "../utils/useSwipe";

import styles from "./list-item.module.scss";

export default function ListItem({
  data,
  onEdit,
  onDelete,
}: {
  data: IRoutine;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [showingDelete, setShowingDelete] = useState(false);

  useLayoutEffect(() => {
    import("@material/web/button/filled-button.js");
  }, []);

  const search = new URLSearchParams({
    id: data.id,
  }).toString();

  const bind = useSwipe({
    tap() {
      onEdit?.();
    },
    left() {
      setShowingDelete(true);
    },
    right() {
      setShowingDelete(false);
    },
  });

  function handleDeleteClick() {
    onDelete?.();
  }

  return (
    <div className={styles["list-item"]}>
      <md-list-item
        {...bind()}
        style={{
          touchAction: "pan-y",
        }}
      >
        <RoutineListItemContent data={data}></RoutineListItemContent>
      </md-list-item>

      <md-filled-button
        class={classNames({
          [styles["delete-button"]]: true,
          [styles["delete-button--showing"]]: showingDelete,
        })}
        onClick={handleDeleteClick}
      >
        <md-icon>delete</md-icon>
      </md-filled-button>
    </div>
  );
}
