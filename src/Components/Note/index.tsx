import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

type Props = {
  text: string;
  icon: any;
  onCloseClick: () => void;
  color: string;
  hoverColor: string;
};

export default function Note({
  color,
  text,
  hoverColor,
  icon,
  onCloseClick,
}: Props) {
  return (
    <div className={`${color} rounded-md`}>
      <div className="max-w-7xl px-2">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className={`flex rounded-lg  p-2`}>{icon}</span>
            <p className="ml-3 truncate font-medium text-white">
              <span className="md:hidden">{text}</span>
              <span className="hidden md:inline">{text}</span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              onClick={onCloseClick}
              type="button"
              className={`hover:${hoverColor} -mr-1 flex rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
