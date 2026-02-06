import React from "react";

type Props = {
  menu: {
    label: string;
    value: string;
    onClick: (value: string) => void;
  }[];
};

export default function Menu({ menu }: Props) {
  return (
    <div>
      <button
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Dropdown button
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        id="dropdown"
        className="z-10 hidden w-44 divide-y divide-gray-100 rounded bg-surface-card shadow"
      >
        <ul
          className="py-1 text-sm text-heading"
          aria-labelledby="dropdownDefault"
        >
          {menu.map((m) => (
            <li key={m.value} onClick={() => m.onClick(m.value)}>
              <span className="block py-2 px-4 hover:bg-surface-hover">
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
