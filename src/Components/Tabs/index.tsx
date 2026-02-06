import React from "react";

type Tab = {
  label: string;
  value: string;
};

type Props = {
  tabs: Array<Tab>;
  activeTab: string;
  setActiveTab: (val: string) => void;
};

function Tab({
  activeTab,
  children,
  value,
  onClick,
}: {
  children: React.ReactNode;
  value: string;
  activeTab: boolean;
  onClick: (tab: any) => void;
}) {
  return (
    <li onClick={() => onClick(value)} className="mr-2">
      <span
        className={`active inline-block cursor-pointer rounded-t-lg p-4 ${
          activeTab
            ? `bg-surface-muted text-blue-600`
            : "hover:bg-surface-hover hover:text-body"
        }`}
      >
        {children}
      </span>
    </li>
  );
}

export default function Tabs({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <ul className="flex flex-wrap border-b border-theme text-center text-sm font-medium text-muted">
      {tabs.map((tab, index) => (
        <Tab
          value={tab.value}
          onClick={setActiveTab}
          activeTab={tab.value === activeTab}
          key={index}
        >
          {tab.label}
        </Tab>
      ))}
    </ul>
  );
}
