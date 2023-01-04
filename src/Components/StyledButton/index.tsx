export default function StyledButton({
  onClick,
  children,
  disabled = false,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element | React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="flex h-28 w-28 cursor-pointer  items-center justify-center rounded-xl bg-gradient-to-r from-slate-50
    via-slate-100
    to-slate-50	
    p-3
    text-center
   text-slate-500 shadow-md"
      type="button"
      id="reset"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
