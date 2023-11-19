import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
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

  function handleCloseClick() {
    onCancel();
  }

  return (
    <section className={styles.addTemplate}>
      <header className={styles.header}>
        <div className={classnames(styles.close)} onClick={handleCloseClick}>
          <FontAwesomeIcon height="1em" icon={faClose} />
        </div>

        <span className={styles.title}>New Template</span>

        <button className={styles.save} onClick={handleCreateClick}>
          Save
        </button>
      </header>
      <label>
        <span>Name: </span>
        <input ref={templateNameInputRef} name="name" type="text" />
      </label>
      <table className="mt-2 mb-2">
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
                  <FontAwesomeIcon height="1em" icon={faTrash} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <form ref={formRef}>
        <label>
          <span>Name: </span>
          <input name="name" type="text" />
        </label>
        <label>
          <span>Start time: </span>
          <input name="startTime" type="time" />
        </label>
        <label>
          <span>End time: </span>
          <input name="endTime" type="time" />
        </label>
        <div className="mt-2">
          <button onClick={handleAddClick}>Add Routine</button>
        </div>
      </form>
    </section>
  );
}
