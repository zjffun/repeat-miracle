import SubHeader from "../components/sub-header";

import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <SubHeader>Config</SubHeader>
      <main className={styles.main}>
        <ul>
          <li>
            <Link href="/templates">Templates</Link>
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
