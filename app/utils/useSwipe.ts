"use client";

import { useDrag } from "@use-gesture/react";

export default function useSwipe({
  tap,
  left,
  right,
}: {
  tap?: () => void;
  left?: () => void;
  right?: () => void;
}) {
  let deltaX = 0;

  return useDrag(({ delta, movement, tap: isTap }) => {
    deltaX += delta[0];

    if (Math.abs(movement[1]) > 50) {
      return;
    }

    if (isTap) {
      tap?.();
      deltaX = 0;
      return;
    }

    if (deltaX < -30) {
      left?.();
      deltaX = 0;
      return;
    }

    if (deltaX > 30) {
      right?.();
      deltaX = 0;
      return;
    }
  });
}
