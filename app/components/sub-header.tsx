"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import styles from "./sub-header.module.css";

export default function SubHeader({ children }: { children: React.ReactNode }) {
  function handleBackClick() {
    history.back();
  }

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        <div className={classnames(styles.back)} onClick={handleBackClick}>
          <FontAwesomeIcon height='1em' icon={faAngleLeft} />
        </div>

        {children}
      </h2>
    </header>
  );
}
