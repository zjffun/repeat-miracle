"use client";

import { useDrag } from "@use-gesture/react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import { ITemplate } from "../types";
import { deleteTemplates } from "../utils/storage/templates";

import styles from "./list-item.module.scss";

export default function ListItem({
  data,
  onDelete,
}: {
  data: ITemplate;
  onDelete?: () => void;
}) {
  const router = useRouter();

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
        router.push(`/upsert-template?${search}`);
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
    deleteTemplates([data.id]);
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
