interface SmallButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled: boolean;
  children: React.ReactNode;
}

export default function SmallButton({
  disabled,
  children,
  ...props
}: SmallButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`cursor-pointer rounded-full bg-white p-3 shadow-xl shadow-gray-200 transition delay-100 ease-in-out ${
        !disabled && `hover:scale-110`
      }`}
      type="button"
      id="reset"
    >
      {children}
    </button>
  );
}
