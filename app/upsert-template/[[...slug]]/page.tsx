"use client";

import classNames from "classnames";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Routine from "@/app/components/routine";
import SubHeader from "../../components/sub-header";
import { IRoutine } from "../../types";
import { getTemplate, upsertTemplate } from "../../utils/templates";
import RoutineDialog from "./routine-dialog";

import styles from "./page.module.scss";

export default function Page() {
  const params = useParams();

  const templateId = params.slug?.[0];

  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [openingRoutineDialog, setOpeningRoutineDialog] = useState(false);
  const [currentRoutine, setCurrentRoutine] =
    useState<Partial<IRoutine> | null>(null);

  function handleDeleteClick(index: number) {
    setRoutines((routines) => {
      return routines.filter((_, i) => i !== index);
    });
  }

  function handleAddClick(e: any) {
    setCurrentRoutine({
      name: "",
      startTime: 0,
      endTime: 0,
    });
    setOpeningRoutineDialog(true);
  }

  function handleEditClick(data: IRoutine) {
    setCurrentRoutine(data);
    setOpeningRoutineDialog(true);
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

  useLayoutEffect(() => {
    import("@material/web/textfield/filled-text-field.js");
    import("@material/web/fab/fab.js");
    import("@material/web/dialog/dialog.js");
    import("@/app/components/circular-time-range-picker.js");
  }, []);

  useEffect(() => {
    if (!templateId) return;

    const template = getTemplate(templateId);

    if (!template) return;

    setTemplateName(template.name);
    setRoutines(template.routines);
  }, [templateId]);

  return (
    <>
      <SubHeader
        actionItems={
          <md-icon-button onClick={handleSaveClick}>
            <md-icon>save</md-icon>
          </md-icon-button>
        }
      >
        Templates
      </SubHeader>
      <div className={classNames(styles.page, "container")}>
        <md-filled-text-field
          style={{
            width: "100%",
          }}
          label="Template Name"
          type="text"
          value={templateName}
          onInput={handleTemplateNameInput}
          name="name"
        ></md-filled-text-field>

        <md-list>
          {routines.map((d, i) => {
            return (
              <div key={i} onClick={() => handleEditClick(d)}>
                <Routine
                  data={d}
                  interactive={true}
                  end={
                    <md-icon-button
                      slot="end"
                      onClick={(e: Event) => {
                        e.stopPropagation();
                        handleDeleteClick(i);
                      }}
                    >
                      <md-icon>delete</md-icon>
                    </md-icon-button>
                  }
                ></Routine>
              </div>
            );
          })}
        </md-list>

        <md-fab
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
          }}
          onClick={handleAddClick}
          size="small"
          label="Add Routine"
          aria-label="Add Routine"
        >
          <md-icon slot="icon">add</md-icon>
        </md-fab>

        <RoutineDialog
          open={openingRoutineDialog}
          name={currentRoutine?.name}
          startTime={currentRoutine?.startTime}
          endTime={currentRoutine?.endTime}
          onClose={() => {
            setCurrentRoutine(null);
            setOpeningRoutineDialog(false);
          }}
          onOk={(params) => {
            setRoutines((routines) => {
              // add
              if (!currentRoutine?.id)
                return [
                  ...routines,
                  {
                    id: nanoid(),
                    ...params,
                  },
                ];

              // update
              return routines.map((d) => {
                if (d.id === currentRoutine.id) {
                  return {
                    ...d,
                    name: params.name,
                    startTime: params.startTime,
                    endTime: params.endTime,
                  };
                }
                return d;
              });
            });

            setCurrentRoutine(null);
            setOpeningRoutineDialog(false);
          }}
        ></RoutineDialog>
      </div>
    </>
  );
}
