"use client";

import { useDrag } from "@use-gesture/react";
import classNames from "classnames";
import { useLayoutEffect, useState } from "react";

import { RoutineListItemContent } from "../components/routine";
import { IRoutine } from "../types";

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

  const bind = useDrag(
    ({ swipe: [swipeX], tap }) => {
      if (tap) {
        onEdit?.();
        return;
      }

      if (swipeX === -1) {
        setShowingDelete(true);
        return;
      }

      if (swipeX === 1) {
        setShowingDelete(false);
        return;
      }
    },
    {
      swipe: {
        distance: 10,
        velocity: 0.1,
      },
    }
  );

  function handleDeleteClick() {
    onDelete?.();
  }

  return (
    <div className={styles["list-item"]}>
      <md-list-item
        {...bind()}
        type="button"
        style={{
          touchAction: "none",
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
