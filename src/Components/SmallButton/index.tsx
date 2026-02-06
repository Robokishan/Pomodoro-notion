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
      className={`cursor-pointer rounded-full bg-surface-btn p-3 shadow-xl shadow-theme transition delay-100 ease-in-out ${
        !disabled && `hover:scale-110`
      }`}
      type="button"
      id="reset"
    >
      {children}
    </button>
  );
}
