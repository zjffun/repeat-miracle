"use client";

import { useLayoutEffect } from "react";

export default function MwcImport() {
  useLayoutEffect(() => {
    import("@material/mwc-top-app-bar-fixed");
    import("@material/web/icon/icon.js");
    import("@material/web/iconbutton/icon-button.js");
    import("@material/web/list/list.js");
    import("@material/web/list/list-item.js");
    import("@material/web/divider/divider.js");
  }, []);

  return null;
}
