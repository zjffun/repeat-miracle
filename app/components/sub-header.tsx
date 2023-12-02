"use client";

export default function SubHeader({
  children,
  actionItems,
}: {
  children: React.ReactNode;
  actionItems?: React.ReactNode[] | React.ReactNode;
}) {
  function handleBackClick() {
    history.back();
  }

  let _actionItems: React.ReactNode[] = [];

  if (actionItems) {
    _actionItems = Array.isArray(actionItems) ? actionItems : [actionItems];
  }

  return (
    <mwc-top-app-bar-fixed>
      <div slot="navigationIcon" onClick={handleBackClick}>
        <md-icon-button>
          <md-icon>arrow_back_ios_new</md-icon>
        </md-icon-button>
      </div>

      <div slot="title">{children}</div>

      {_actionItems.map((item, index) => (
        <div key={index} slot="actionItems">
          {item}
        </div>
      ))}
    </mwc-top-app-bar-fixed>
  );
}
