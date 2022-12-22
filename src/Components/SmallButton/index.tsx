export default function SmallButton({
  onClick,
  disabled,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  children: JSX.Element | React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      className={`m-3 cursor-pointer rounded-full bg-white p-3 shadow-xl shadow-gray-200 transition delay-100 ease-in-out ${
        !disabled && `hover:scale-110`
      }`}
      type="button"
      id="reset"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
