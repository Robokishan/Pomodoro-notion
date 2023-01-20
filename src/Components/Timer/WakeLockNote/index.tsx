import {
  CheckBadgeIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import Note from "../../Note";

type Props = {
  type: "success" | "error";
  onCloseClick: () => void;
};

export default function WakeLockNote({ type, onCloseClick }: Props) {
  return (
    <div className="mt-5 w-full">
      {type === "success" ? (
        <Note
          color="bg-green-700"
          hoverColor="bg-green-800"
          onCloseClick={onCloseClick}
          icon={<CheckBadgeIcon className="h-6 w-6 fill-white" />}
          text="Wake Lock aquired"
        />
      ) : (
        <Note
          color="bg-red-700"
          hoverColor="bg-red-800"
          onCloseClick={onCloseClick}
          icon={<ShieldExclamationIcon className="h-6 w-6 fill-white" />}
          text="Wake Lock aquire failed"
        />
      )}
    </div>
  );
}
