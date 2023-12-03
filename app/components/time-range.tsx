import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { minutesToHhmm, minutesToReadable } from "../utils/time";

function secondsToMinutes(seconds: number) {
  return Math.round(seconds / 60 / 5) * 5;
}

export default function TimeRange({
  startMinute,
  endMinute,
  onChange,
}: {
  startMinute: number;
  endMinute: number;
  onChange?: ({
    startMinute,
    endMinute,
  }: {
    startMinute: number;
    endMinute: number;
  }) => void;
}) {
  const circularTimeRangePickerRef = useRef<HTMLElement>(null);
  const [currentStartMinute, setCurrentStartMinute] = useState(startMinute);
  const [currentEndMinute, setCurrentEndMinute] = useState(endMinute);

  useLayoutEffect(() => {
    const circularTimeRangePickerEl = circularTimeRangePickerRef.current;

    if (!circularTimeRangePickerEl) return;

    function handleInput(e: any) {
      setCurrentStartMinute(secondsToMinutes(e.detail.start));
      setCurrentEndMinute(secondsToMinutes(e.detail.end));
    }

    function handleChange(e: any) {
      onChange?.({
        startMinute: secondsToMinutes(e.detail.start),
        endMinute: secondsToMinutes(e.detail.end),
      });
    }

    circularTimeRangePickerEl.addEventListener("input", handleInput);
    circularTimeRangePickerEl.addEventListener("change", handleChange);

    return () => {
      circularTimeRangePickerEl.removeEventListener("input", handleInput);
      circularTimeRangePickerEl.removeEventListener("change", handleChange);
    };
  });

  useEffect(() => {
    setCurrentStartMinute(startMinute);
    setCurrentEndMinute(endMinute);
  }, [startMinute, endMinute]);

  return (
    <section>
      <p
        style={{
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        {minutesToHhmm(currentStartMinute)} - {minutesToHhmm(currentEndMinute)}
      </p>
      <div>
        <circular-time-range-picker
          ref={circularTimeRangePickerRef}
          start={startMinute * 60}
          end={endMinute * 60}
        ></circular-time-range-picker>
      </div>
      <p
        style={{
          textAlign: "center",
        }}
      >
        {minutesToReadable(currentStartMinute, currentEndMinute)}
      </p>
    </section>
  );
}
