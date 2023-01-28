import dynamic from "next/dynamic";
import React from "react";
const MultiSelect = dynamic(() => import("../MultiSelect"), {
  loading: () => <div>Loading...</div>,
});

type Props = {
  options: Array<{ label: string; value: string; color: string }>;
  disabled: boolean;
  handleSelect: (e: any) => void;
};

export default function NotionTags({ options, disabled, handleSelect }: Props) {
  return (
    <MultiSelect
      disabled={disabled}
      handleSelect={handleSelect}
      options={options}
    />
  );
}
