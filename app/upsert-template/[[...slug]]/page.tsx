"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { IRoutine } from "../../types";
import { getTemplate, upsertTemplate } from "../../utils/templates";
import { hhmmToMinutes, minutesToHhmm } from "../../utils/time";

import { useParams, useRouter } from "next/navigation";
import SubHeader from "../../components/sub-header";
import styles from "./page.module.scss";

export default function Page() {
  const params = useParams();

  const templateId = params.slug?.[0];

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [templateName, setTemplateName] = useState("");
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

  function handleSaveClick() {
    upsertTemplate({
      id: templateId,
      name: templateName || "template",
      routines,
    });

    router.back();
  }

  function handleTemplateNameInput(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setTemplateName(name);
  }

  useEffect(() => {
    if (!templateId) return;

    const template = getTemplate(templateId);

    if (!template) return;

    setTemplateName(template.name);
    setRoutines(template.routines);
  }, [templateId]);

  return (
    <section className={styles.addTemplate}>
      <SubHeader
        actionItems={
          <md-icon-button onClick={handleSaveClick}>
            <md-icon>save</md-icon>
          </md-icon-button>
        }
      >
        Templates
      </SubHeader>
      <label>
        <span>Name: </span>
        <input
          value={templateName}
          onInput={handleTemplateNameInput}
          name="name"
          type="text"
        />
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
