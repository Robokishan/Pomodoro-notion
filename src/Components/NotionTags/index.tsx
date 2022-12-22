import React from "react";
import MultiSelect from "../MultiSelect";

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
