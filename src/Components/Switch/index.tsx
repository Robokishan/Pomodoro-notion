import { ChangeEventHandler } from "react";

type Props = {
    checked: boolean,
    text?: string,
    disabled?: boolean,
    loading?: boolean,
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}

export default function Switch({ checked, disabled, loading, onChange, text = "Switch" }: Props) {
    return (
        <label className={`relative inline-flex items-center ${disabled || loading ? "cursor-wait opacity-70" : "cursor-pointer"}`}>
            <input
                disabled={disabled || loading}
                checked={checked}
                onChange={onChange}
                type="checkbox"
                value=""
                className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 animate-spin text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                )}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900 ">
                {text}
            </span>
        </label>
    )
}