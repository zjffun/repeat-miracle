"use client";

import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";

import { RoutineListItemContent } from "../components/routine";
import { IRoutine, SwipeType } from "../types";
import { ListenerFn } from "../utils/useSwipe";

import styles from "./list-item.module.scss";

export default function ListItem({
  data,
  onEdit,
  onDelete,
  addListener,
  removeListener,
}: {
  data: IRoutine;
  onEdit?: () => void;
  onDelete?: () => void;
  addListener?: (el: HTMLElement, listener: ListenerFn) => void;
  removeListener?: (el: HTMLElement) => void;
}) {
  const elRef = useRef<HTMLElement>(null);
  const [showingDelete, setShowingDelete] = useState(false);

  useLayoutEffect(() => {
    import("@material/web/button/filled-button.js");
  }, []);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (el) {
      const listener = ({ type }: { type: SwipeType }) => {
        if (type === SwipeType.Left) {
          setShowingDelete(true);
        } else if (type === SwipeType.Right) {
          setShowingDelete(false);
        } else if (type === SwipeType.Tap) {
          // wait for touch end
          setTimeout(() => {
            onEdit?.();
          }, 100);
        }
      };

      addListener?.(el, listener);

      return () => {
        removeListener?.(el);
      };
    }
  }, [addListener, removeListener, onEdit]);

  function handleDeleteClick() {
    onDelete?.();
  }

  return (
    <div className={styles["list-item"]}>
      <md-list-item
        ref={elRef}
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
