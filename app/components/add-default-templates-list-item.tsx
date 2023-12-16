"use client";
import { setDefaultTemplates } from "../utils/storage/templates";

export default function AddDefaultTemplatesListItem({
  onClick,
}: {
  onClick?: () => void;
}) {
  function handleAddDefaultClick() {
    setDefaultTemplates();
    onClick?.();
  }

  return (
    <md-list-item type="button" onClick={handleAddDefaultClick}>
      <md-icon slot="start">add</md-icon>
      <div slot="headline">No Templates. Click to add default template.</div>
    </md-list-item>
  );
}
