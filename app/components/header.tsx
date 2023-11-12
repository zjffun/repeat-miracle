import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  const date = dayjs().format("YYYY-MM-DD");

  return (
    <header className={styles.header}>
      <h2 className={styles.date}>{date}</h2>
      <div className="flex-1"></div>
      <Link href="/config">
        <div className={styles.setting}>
          <FontAwesomeIcon width="1em" icon={faGear} />
        </div>
      </Link>
    </header>
  );
}
