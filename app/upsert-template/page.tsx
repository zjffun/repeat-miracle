"use client";

import classNames from "classnames";
import { nanoid } from "nanoid";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";

import { IRoutine } from "../types";
import { sortRoutines } from "../utils/routines";
import { getTemplate, upsertTemplate } from "../utils/storage/templates";
import { daysOfWeekAbbr, getDefaultDaysArray } from "../utils/time";
import useSwipe from "../utils/useSwipe";
import ConfirmDialog from "./confirm-dialog";
import DaysDialog from "./days-dialog";
import ListItem from "./list-item";
import RoutineDialog from "./routine-drawer";

import styles from "./page.module.scss";

export default function Page() {
  const params = useSearchParams();

  const templateId = params.get("id") || "";

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [openingRoutineDialog, setOpeningRoutineDialog] = useState(false);
  const [openingDaysDialog, setOpeningDaysDialog] = useState(false);
  const [openingConfirmDialog, setOpeningConfirmDialog] = useState(false);
  const [currentRoutine, setCurrentRoutine] =
    useState<Partial<IRoutine> | null>(null);
  const [currentDays, setCurrentDays] = useState<boolean[]>(
    getDefaultDaysArray()
  );

  const { addListener, removeListener } = useSwipe();

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
    // wait for tap event end
    setTimeout(() => {
      setCurrentRoutine(data);
      setOpeningRoutineDialog(true);
    }, 0);
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

  function handleBackClick() {
    let changed = true;

    if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        changed =
          template.name !== templateName ||
          JSON.stringify(template.routines) !== JSON.stringify(routines) ||
          JSON.stringify(template.daysOfWeek) !== JSON.stringify(currentDays);
      }
    }

    if (changed) {
      setOpeningConfirmDialog(true);
      return;
    }

    router.back();
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

    setTitle(template.name || "");
    setTemplateName(template.name || "");
    setRoutines(template.routines || []);
    setCurrentDays(template.daysOfWeek || getDefaultDaysArray());
  }, [templateId]);

  return (
    <>
      <mwc-top-app-bar-fixed>
        <div slot="navigationIcon" onClick={handleBackClick}>
          <md-icon-button>
            <md-icon>arrow_back_ios_new</md-icon>
          </md-icon-button>
        </div>

        <div slot="title">{templateId ? title : "New Template"}</div>

        <md-icon-button slot="actionItems" onClick={handleSaveClick}>
          <md-icon>save</md-icon>
        </md-icon-button>
      </mwc-top-app-bar-fixed>

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
              <div key={d.id}>
                <ListItem
                  data={d}
                  onEdit={() => handleEditClick(d)}
                  onDelete={() => handleDeleteClick(i)}
                  addListener={addListener}
                  removeListener={removeListener}
                ></ListItem>
                <md-divider></md-divider>
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
                return sortRoutines([
                  ...routines,
                  {
                    id: nanoid(),
                    ...params,
                  },
                ]);

              // update
              return sortRoutines(
                routines.map((d) => {
                  if (d.id === currentRoutine.id) {
                    return {
                      ...d,
                      name: params.name,
                      startTime: params.startTime,
                      endTime: params.endTime,
                    };
                  }
                  return d;
                })
              );
            });

            setCurrentRoutine(null);
            setOpeningRoutineDialog(false);
          }}
        ></RoutineDialog>

        <ConfirmDialog
          open={openingConfirmDialog}
          onOk={() => {
            history.back();
          }}
          onClose={() => {
            setOpeningConfirmDialog(false);
          }}
        ></ConfirmDialog>
      </div>
    </>
  );
}
