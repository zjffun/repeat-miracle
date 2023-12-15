"use client";

import classNames from "classnames";
import { nanoid } from "nanoid";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";

import Routine from "@/app/components/routine";
import SubHeader from "../components/sub-header";
import { IRoutine } from "../types";
import { getTemplate, upsertTemplate } from "../utils/storage/templates";
import RoutineDialog from "./routine-dialog";
import DaysDialog from "./days-dialog";
import { daysOfWeekAbbr, getDefaultDaysArray } from "../utils/time";

import styles from "./page.module.scss";

export default function Page() {
  const params = useSearchParams();

  const templateId = params.get("id") || "";

  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [openingRoutineDialog, setOpeningRoutineDialog] = useState(false);
  const [openingDaysDialog, setOpeningDaysDialog] = useState(false);
  const [currentRoutine, setCurrentRoutine] =
    useState<Partial<IRoutine> | null>(null);
  const [currentDays, setCurrentDays] = useState<boolean[]>(
    getDefaultDaysArray()
  );

  let selectDaysOfWeekText = "Select Days";

  const currentDaysStr = currentDays.join(",");
  if (currentDaysStr === "true,true,true,true,true,true,true") {
    selectDaysOfWeekText = `${selectDaysOfWeekText} (Every day)`;
  } else if (currentDaysStr === "false,true,true,true,true,true,false") {
    selectDaysOfWeekText = `${selectDaysOfWeekText} (Weekdays)`;
  } else if (currentDaysStr === "true,false,false,false,false,false,true") {
    selectDaysOfWeekText = `${selectDaysOfWeekText} (Weekends)`;
  } else {
    const filteredDays = daysOfWeekAbbr.filter((_, i) => currentDays[i]);

    if (filteredDays.length > 0) {
      selectDaysOfWeekText = `${selectDaysOfWeekText} (${filteredDays.join(
        " "
      )})`;
    } else {
      selectDaysOfWeekText = `${selectDaysOfWeekText} (Never)`;
    }
  }

  function handleDeleteClick(index: number) {
    setRoutines((routines) => {
      return routines.filter((_, i) => i !== index);
    });
  }

  function handleAddClick(e: any) {
    setCurrentRoutine({
      name: "",
      startTime: 0,
      endTime: 8 * 60,
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
      daysOfWeek: currentDays,
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
    import("@material/web/button/filled-tonal-button.js");

    import("@/app/components/circular-time-range-picker.js");
  }, []);

  useEffect(() => {
    if (!templateId) return;

    const template = getTemplate(templateId);

    if (!template) return;

    setTemplateName(template.name || "");
    setRoutines(template.routines || []);
    setCurrentDays(template.daysOfWeek || getDefaultDaysArray());
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
      <div className={classNames(styles.page)}>
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

        <md-filled-tonal-button
          style={{
            display: "block",
            margin: "1rem 1rem 0",
          }}
          onClick={() => {
            setOpeningDaysDialog(true);
          }}
        >
          {selectDaysOfWeekText}
        </md-filled-tonal-button>

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

        <DaysDialog
          open={openingDaysDialog}
          days={currentDays}
          onClose={() => {
            setOpeningDaysDialog(false);
          }}
          onOk={(params) => {
            setCurrentDays(params.days);
            setOpeningDaysDialog(false);
          }}
        ></DaysDialog>

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
