import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import SubHeader from "../components/sub-header";

import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <SubHeader>Config</SubHeader>
      <main className={styles.main}>
        <ul className="list">
          <li>
            <Link className="full-link" href="/templates">
              <FontAwesomeIcon width="1em" icon={faFile} /> Templates
            </Link>
          </li>
          {/* TODO: implement */}
          {/* <li>
            <Link href="/routines">Today routines</Link>
          </li> */}
        </ul>
      </main>
    </>
  );
}
