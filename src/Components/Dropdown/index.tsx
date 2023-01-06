import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";

type ButtonType = {
  type: "button";
  onClick: any;
};

type LinkType = {
  type: "link";
  href: string;
};

type ComponentType = ButtonType | LinkType;

export interface MenuType {
  style?: string;
  label: string;
  value: string;
  component: ComponentType;
}

interface DropdownProps {
  menuList: MenuType[];
}

export default function Dropdown({ menuList }: DropdownProps) {
  const [show, setshow] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setshow((prev) => !prev);
          }}
        >
          <EllipsisHorizontalCircleIcon className="h-7 w-7 cursor-pointer" />
        </button>
      </div>

      <div
        className={`absolute  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition duration-75 ease-in focus:outline-none
        ${
          show
            ? "scale-100 transform opacity-100"
            : "pointer-events-none scale-95 transform opacity-0"
        }
        
        `}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {menuList.map((menu, index) => (
            <Components key={index} menu={menu} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Components = ({
  menu: { component, label, style },
}: {
  menu: MenuType;
}) => {
  switch (component.type) {
    case "button":
      return (
        <button
          onClick={component.onClick}
          className={`hover block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 ${
            style && style
          }`}
          role="menuitem"
          tabIndex={-1}
          id="menu-item-0"
        >
          <span>{label}</span>
        </button>
      );

    case "link":
      return (
        <Link href={component.href}>
          <a
            className={`hover block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 ${
              style && style
            }`}
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
          >
            <span>{label}</span>
          </a>
        </Link>
      );
  }
};
