"use client";

import {
  Theme,
  applyTheme,
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { useLayoutEffect } from "react";

import { getIsDark } from "../utils/dark";

// https://github.com/material-foundation/material-color-utilities/issues/98#issuecomment-1535869882
function applySurfaceStyles(theme: Theme, { dark }: { dark: boolean }): void {
  if (dark) {
    const elevationProps = {
      "--md-sys-color-surface-dim": theme.palettes.neutral.tone(6),
      "--md-sys-color-surface-bright": theme.palettes.neutral.tone(24),
      "--md-sys-color-surface-container-lowest": theme.palettes.neutral.tone(4),
      "--md-sys-color-surface-container-low": theme.palettes.neutral.tone(10),
      "--md-sys-color-surface-container": theme.palettes.neutral.tone(12),
      "--md-sys-color-surface-container-high": theme.palettes.neutral.tone(17),
      "--md-sys-color-surface-container-highest":
        theme.palettes.neutral.tone(22),
    };

    for (const [property, argbColor] of Object.entries(elevationProps)) {
      document.body.style.setProperty(property, hexFromArgb(argbColor));
    }
  } else {
    const elevationProps = {
      "--md-sys-color-surface-dim": theme.palettes.neutral.tone(87),
      "--md-sys-color-surface-bright": theme.palettes.neutral.tone(98),
      "--md-sys-color-surface-container-lowest":
        theme.palettes.neutral.tone(100),
      "--md-sys-color-surface-container-low": theme.palettes.neutral.tone(96),
      "--md-sys-color-surface-container": theme.palettes.neutral.tone(94),
      "--md-sys-color-surface-container-high": theme.palettes.neutral.tone(92),
      "--md-sys-color-surface-container-highest":
        theme.palettes.neutral.tone(90),
    };

    for (const [property, argbColor] of Object.entries(elevationProps)) {
      document.body.style.setProperty(property, hexFromArgb(argbColor));
    }
  }
}

export default function MwcImport() {
  useLayoutEffect(() => {
    // theme
    const theme = themeFromSourceColor(argbFromHex("#00ff00"));

    const isDark = getIsDark();

    applyTheme(theme, { target: document.body, dark: isDark });
    applySurfaceStyles(theme, { dark: isDark });

    // components
    import("@material/mwc-top-app-bar-fixed");
    import("@material/web/icon/icon.js");
    import("@material/web/iconbutton/icon-button.js");
    import("@material/web/list/list.js");
    import("@material/web/list/list-item.js");
    import("@material/web/divider/divider.js");
    import("@material/web/button/text-button.js");

    // other components
    import("@dile/dile-toast/dile-toast.js");
  }, []);

  return null;
}
