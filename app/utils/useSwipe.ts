"use client";

import { useLayoutEffect } from "react";

import { SwipeType } from "../types";

export type ListenerFn = (params: { type: SwipeType }) => void;

export default function useSwipe() {
  const elListenerWeakMap = new WeakMap<HTMLElement, ListenerFn>();
  let swiping = false;
  let scrolling = true;
  let clientX = 0;
  let clientY = 0;
  let initClientX = 0;
  let initClientY = 0;
  let currentListener: ListenerFn | undefined = undefined;

  function down(e: any) {
    let el = e.target;
    currentListener = elListenerWeakMap.get(el);

    while (!currentListener && el.parentElement) {
      el = el.parentElement;
      currentListener = elListenerWeakMap.get(el);
    }

    if (!currentListener) {
      scrolling = true;
      return;
    }

    swiping = false;
    scrolling = false;
    clientX = e.clientX || e.targetTouches[0].clientX;
    clientY = e.clientY || e.targetTouches[0].clientY;
    initClientX = clientX;
    initClientY = clientY;
  }

  function move(e: any) {
    if (scrolling) {
      return;
    }

    // prevent touch scroll
    e.preventDefault();

    const currentClientX = e.clientX || e.targetTouches[0].clientX;
    const currentClientY = e.clientY || e.targetTouches[0].clientY;

    const deltaX = currentClientX - clientX;
    const deltaY = currentClientY - clientY;
    if (swiping === false && Math.abs(deltaY) > 30) {
      scrolling = true;
      return;
    }

    if (deltaX < -20) {
      swiping = true;
      currentListener?.({
        type: SwipeType.Left,
      });
      clientX = currentClientX;
      return;
    }

    if (deltaX > 20) {
      swiping = true;
      currentListener?.({
        type: SwipeType.Right,
      });
      clientX = currentClientX;
      return;
    }
  }

  function up(e: any) {
    swiping = false;
    scrolling = true;
    if (currentListener) {
      const currentClientX = e.clientX || e.changedTouches[0].clientX;
      const currentClientY = e.clientY || e.changedTouches[0].clientY;

      const deltaX = currentClientX - initClientX;
      const deltaY = currentClientY - initClientY;

      if (Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3) {
        currentListener({
          type: SwipeType.Tap,
        });
      }
    }
  }

  function addListener(el: HTMLElement, listener: ListenerFn) {
    elListenerWeakMap.set(el, listener);
  }

  function removeListener(el: HTMLElement) {
    elListenerWeakMap.delete(el);
  }

  useLayoutEffect(() => {
    document.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchstart", down);
    document.addEventListener("touchmove", move, {
      // passive: false,
    });
    document.addEventListener("touchend", up);

    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchstart", down);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", up);
    };
  });

  return {
    addListener,
    removeListener,
  };
}
