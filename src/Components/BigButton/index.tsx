export default function BigButton({
  onClick,
  children,
  disabled = false,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="m-3 cursor-pointer rounded-full bg-surface-btn px-[1em] py-[1em] shadow-xl shadow-theme transition delay-100 ease-in-out hover:scale-110"
      type="button"
      id="reset"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
