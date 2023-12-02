import dayjs from "dayjs";
import Link from "next/link";

export default function Header() {
  const date = dayjs().format("YYYY-MM-DD");

  return (
    <mwc-top-app-bar-fixed>
      <div
        slot="navigationIcon"
        style={{
          fontSize: "var(--mdc-typography-headline6-font-size, 1.25rem)",
        }}
      >
        Repeat Miracle
      </div>
      <div slot="title">{date}</div>

      <Link href="/config" slot="actionItems">
        <md-icon-button>
          <md-icon>settings</md-icon>
        </md-icon-button>
      </Link>
    </mwc-top-app-bar-fixed>
  );
}
