import Link from "next/link";

import SubHeader from "../components/sub-header";

import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <SubHeader>Config</SubHeader>
      <main className={styles.main}>
        <md-list>
          <Link href="/templates">
            <md-list-item>
              <div slot="headline">
                <md-icon
                  style={{
                    fontSize: "1rem",
                    height: "1rem",
                    width: "1rem",
                    marginRight: "0.25rem",
                  }}
                >
                  description
                </md-icon>
                Templates
              </div>
            </md-list-item>
          </Link>

          {/* TODO: implement */}
          {/* <li>
            <Link href="/routines">Today routines</Link>
          </li> */}
        </md-list>
      </main>
    </>
  );
}
