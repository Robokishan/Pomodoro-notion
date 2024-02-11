import { ChangeEventHandler } from "react";

type Props = {
    checked: boolean,
    text?: string,
    disabled?:boolean,
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}

export default function Switch({ checked, disabled, onChange, text = "Switch" }: Props) {
    return (
        <label className="relative inline-flex cursor-pointer items-center">
            <input
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                type="checkbox"
                value=""
                className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white "></div>
            <span className="ml-3 text-sm font-medium text-gray-900 ">
                {text}
            </span>
        </label>
    )
}