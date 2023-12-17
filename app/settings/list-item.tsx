"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { ITemplate, SwipeType } from "../types";
import { deleteTemplates } from "../utils/storage/templates";
import { ListenerFn } from "../utils/useSwipe";

import styles from "./list-item.module.scss";

export default function ListItem({
  data,
  onDelete,
  addListener,
  removeListener,
}: {
  data: ITemplate;
  onDelete?: () => void;
  addListener?: (el: HTMLElement, listener: ListenerFn) => void;
  removeListener?: (el: HTMLElement) => void;
}) {
  const router = useRouter();

  const elRef = useRef<HTMLElement>(null);

  const [showingDelete, setShowingDelete] = useState(false);

  useLayoutEffect(() => {
    import("@material/web/button/filled-button.js");
  }, []);

  const search = new URLSearchParams({
    id: data.id,
  }).toString();

  function handleDeleteClick() {
    deleteTemplates([data.id]);
    onDelete?.();
  }

  useLayoutEffect(() => {
    const el = elRef.current;
    if (el) {
      const listener = ({ type }: { type: SwipeType }) => {
        if (type === SwipeType.Left) {
          setShowingDelete(true);
        } else if (type === SwipeType.Right) {
          setShowingDelete(false);
        } else if (type === SwipeType.Tap) {
          router.push(`/upsert-template?${search}`);
        }
      };

      addListener?.(el, listener);

      return () => {
        removeListener?.(el);
      };
    }
  }, [addListener, removeListener, router, search]);

  return (
    <div className={styles["list-item"]}>
      <md-list-item
        ref={elRef}
        style={{
          touchAction: "pan-y",
        }}
      >
        <md-icon slot="start">description</md-icon>
        <div slot="headline">{data.name}</div>
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
