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
  children: JSX.Element | React.ReactNode;
  value: string;
  activeTab: boolean;
  onClick: (tab: any) => void;
}) {
  return (
    <li onClick={() => onClick(value)} className="mr-2">
      <span
        className={`active inline-block cursor-pointer rounded-t-lg p-4 ${
          activeTab
            ? `bg-gray-100  text-blue-600 dark:bg-gray-800 dark:text-gray-200`
            : "hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        }`}
      >
        {children}
      </span>
    </li>
  );
}

export default function Tabs({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <ul className="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
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
