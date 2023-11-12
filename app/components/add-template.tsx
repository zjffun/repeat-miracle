import { useRef, useState } from "react";

import { IRoutine } from "../types";
import { addTemplate } from "../utils/templates";
import { hhmmToMinutes, minutesToHhmm } from "../utils/time";

import styles from "./add-template.module.scss";

export default function AddTemplate({
  onCreate,
  onCancel,
}: {
  onCreate: () => void;
  onCancel: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const templateNameInputRef = useRef<HTMLInputElement>(null);

  const [routines, setRoutines] = useState<IRoutine[]>([]);

  function handleDeleteClick(index: number) {
    setRoutines((routines) => {
      return routines.filter((_, i) => i !== index);
    });
  }

  function handleAddClick(e: any) {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const startTime = hhmmToMinutes(formData.get("startTime") as string);
    const endTime = hhmmToMinutes(formData.get("endTime") as string);

    setRoutines((routines) => {
      return [
        ...routines,
        {
          name,
          startTime,
          endTime,
        },
      ];
    });
  }

  function handleCreateClick() {
    addTemplate({
      name: templateNameInputRef.current?.value || "template",
      routines,
    });

    onCreate();
  }

  function handleCancelClick() {
    onCancel();
  }

  return (
    <section className={styles.addTemplate}>
      <span>Name:</span>
      <input ref={templateNameInputRef} name="name" type="text" />
      <button onClick={handleCreateClick}>Create</button>
      <button onClick={handleCancelClick}>Cancel</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start time</th>
            <th>End time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {routines.map((d, i) => {
            return (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{minutesToHhmm(d.startTime)}</td>
                <td>{minutesToHhmm(d.endTime)}</td>
                <td onClick={() => handleDeleteClick(i)}>
                  <button>delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <form ref={formRef}>
        <label>
          <span>Name:</span>
          <input name="name" type="text" />
        </label>
        <label>
          <span>Start time:</span>
          <input name="startTime" type="time" />
        </label>
        <label>
          <span>End time:</span>
          <input name="endTime" type="time" />
        </label>
        <div>
          <button onClick={handleAddClick}>Add Routine</button>
        </div>
      </form>
    </section>
  );
}
