import { IRoutine } from "../types";
import { minutesToHhmm } from "../utils/time";

export default function Routine({ data }: { data: IRoutine }) {
  const name = data.name;
  const startTime = minutesToHhmm(data.startTime);
  const endTime = minutesToHhmm(data.endTime);

  return (
    <>
      <md-list-item>
        <div slot="headline">{name}</div>
        <div
          slot="supporting-text"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <md-icon
            style={{
              fontSize: "1rem",
              height: "1rem",
              width: "1rem",
              marginRight: "0.25rem",
            }}
          >
            schedule
          </md-icon>
          {startTime} - {endTime}
        </div>
      </md-list-item>
      <md-divider></md-divider>
    </>
  );
}
