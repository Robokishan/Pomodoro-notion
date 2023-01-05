import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React from "react";
import Modal from "../Modal";

type Props = {
  setModal: (openModal: boolean) => void;
};

export default function NotionModifyModal({ setModal }: Props) {
  const { data: session } = useSession();
  return (
    <Modal
      confirmText="Modify"
      title="Modify Notion Connection"
      description="Make sure to keep selected your current databases. if
  you accidently deselect your current databases you may
  loose your time logs. You can add additional databases. Don't select pages as pages are not supported currently"
      onCancelClick={() => setModal(false)}
      onConfirmClick={() =>
        (window.location.href = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NOTION_AUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${process.env.NEXT_PUBLIC_NOTION_AUTH_REDIRECT_URI}&state=${session?.user?.email}`)
      }
      icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
    />
  );
}
