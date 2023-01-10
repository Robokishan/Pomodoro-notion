import { useProjectState } from "@/utils/Context/ProjectContext/Context";
import { exportTimesheet } from "@/utils/timesheetapis/timesheet";
import { getUtcTimeRange, getZonedUtcTime } from "@/utils/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  addDays,
  endOfToday,
  getUnixTime,
  parseISO,
  startOfToday,
  subDays,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { toast } from "react-toastify";

type Props = {
  setModal: (openModal: boolean) => void;
  modalIsOpen: boolean;
};

// type Props = {
//   disabled: boolean;
//   value: Record<string, unknown> | undefined | null;
//   projects: Array<Record<string, unknown>>;
//   handleSelect: ({ label, value }: { label: string; value: string }) => void;
// };

const colourStyles = ({
  backgroundColor = "white",
  margin = "unset",
  padding = "12px 16px 12px, 16px",
  border = `1px solid #DAE6EF`,
  borderRadius = "6px",
  minWidth = "310px",
  controlFontWeight = 400,
  whiteBackground = "white",
  minHeight = "48px",
}) => {
  return {
    menuPortal: (base: any) => {
      const { ...rest } = base;
      return { ...rest, zIndex: 9999 };
    },
    control: (styles: any) => {
      return {
        ...styles,
        fontWeight: controlFontWeight,
        minWidth,
        boxShadow: "unset",
        cursor: "pointer",
        margin,
        padding,
        backgroundColor,
        border: border,
        "&:hover": {
          fontWeight: 0,
          backgroundColor: whiteBackground,
        },
        borderRadius,
        minHeight,
      };
    },
    menu: (styles: any) => ({
      ...styles,
      minWidth,
      boxShadow: `0px 2px 24px #DAE6EF`,
      zIndex: 99999, //fix so that it can overlap over other components
    }),
    dropdownIndicator: (style: any) => ({
      ...style,
    }),
    menuList: (styles: any) => ({
      ...styles,
      padding: "0px",
      borderRadius,
    }),
    indicatorSeparator: (styles: any) => ({ ...styles, display: "none" }),
  };
};

export const DATE_PICKER_LIST = [
  {
    label: "Last Week",
    value: {
      startDate: getUtcTimeRange(getZonedUtcTime(subDays(startOfToday(), 6))),
      endDate: getUtcTimeRange(getZonedUtcTime(addDays(endOfToday(), 1))),
      index: 0,
    },
  },
  {
    label: "Last Month",
    value: {
      startDate: getUtcTimeRange(getZonedUtcTime(subDays(startOfToday(), 29))),
      endDate: getUtcTimeRange(getZonedUtcTime(addDays(endOfToday(), 1))),
      index: 1,
    },
  },
  {
    label: "Last Quarter",
    value: {
      startDate: getUtcTimeRange(getZonedUtcTime(subDays(startOfToday(), 89))),
      endDate: getUtcTimeRange(getZonedUtcTime(addDays(endOfToday(), 1))),
      index: 2,
    },
  },
  {
    label: "Last Six Months",
    value: {
      startDate: getUtcTimeRange(getZonedUtcTime(subDays(startOfToday(), 179))),
      endDate: getUtcTimeRange(getZonedUtcTime(addDays(endOfToday(), 1))),
      index: 3,
    },
  },
];

const fileTypes = [
  {
    label: "Excel",
    value: "excel",
  },
  {
    label: "CSV",
    value: "csv",
    disabled: true,
  },
];

const customStyles = {
  content: {
    boxShadow: "0px 6px 28px 4px rgba(90, 106, 157, 0.2)",
    width: "30%",
    border: "0px",
    minWidth: "400px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    maxHeight: "calc(100vh - 15rem)",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "16px",
    padding: "40px 44px 18px",
  },
  overlay: {
    zIndex: 50,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E5E5E580",
  },
} as const;

Modal.setAppElement("#popup");

export default function ExportAsModal({ setModal, modalIsOpen }: Props) {
  const [dateRange, setDateRange] = useState(DATE_PICKER_LIST[0]);
  const [fileType, setFileType] = useState(fileTypes[0]);
  const [selectedDatabases, setDatabases] = useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);

  const [{ notionDatabase }] = useProjectState();

  const databaseOptions = useMemo(
    () =>
      notionDatabase.map((database) => ({
        label: database.title
          ? database?.title
              .map(function (t) {
                return t.text?.content;
              })
              .join("")
          : "No DB Title",
        value: database.id,
      })),
    [notionDatabase]
  );

  // PLEASE DO NOT REMOVE THIS CODE
  // this is workaround for next js document related problem regarding server-side rendering
  const [_document, setDocument] = useState<Document>();
  useEffect(() => {
    setDocument(document);
  }, []);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModal(false)}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div>
        {/* title */}
        <div className="flex items-center gap-5 ">
          <span>Select Date Range</span>
          <XMarkIcon
            onClick={() => setModal(false)}
            className="ml-auto h-6 w-6 cursor-pointer text-slate-500"
          />
        </div>
        {/* body */}
        <div className="my-5">
          <Select
            value={dateRange}
            menuPortalTarget={_document?.body}
            menuPosition="fixed"
            id="dateRange"
            styles={colourStyles({})}
            options={DATE_PICKER_LIST}
            isClearable={true}
            placeholder="Select Project"
            onChange={(e: any) => {
              setDateRange(e);
            }}
          />
        </div>
        <div className="my-5">
          <Select
            isMulti
            name="databases"
            options={databaseOptions}
            onChange={(e: any) => {
              setDatabases(e);
            }}
          />
        </div>
        <div className="my-5">
          <Select
            value={fileType}
            menuPortalTarget={_document?.body}
            menuPosition="fixed"
            id="fileType"
            styles={colourStyles({})}
            isOptionDisabled={(option) => option.disabled ?? false}
            options={fileTypes}
            isClearable={true}
            placeholder="Select FileType"
            onChange={(e: any) => {
              setFileType(e);
            }}
          />
        </div>
        <div className="flex gap-3 ">
          <button
            className="text-slate ml-auto cursor-pointer rounded-md bg-slate-100 p-2 text-slate-600 shadow-xl shadow-gray-200"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button
            disabled={selectedDatabases.length == 0}
            className="text-slate cursor-pointer rounded-md bg-slate-800 p-2 text-slate-300 shadow-xl shadow-gray-200"
            onClick={() => {
              if (
                dateRange?.value.startDate &&
                dateRange.value.endDate &&
                fileType?.value
              ) {
                const databaseIds = selectedDatabases.map(
                  (database) => database.value
                );
                exportTimesheet({
                  startDate: getUnixTime(parseISO(dateRange?.value.startDate)),
                  endDate: getUnixTime(parseISO(dateRange?.value.endDate)),
                  databaseId: databaseIds,
                  type: fileType?.value,
                })
                  .then((d) => {
                    toast.success(d.message ?? "Email will be sent", {
                      autoClose: 2000,
                    });
                  })
                  .catch(() => toast.error("Something went wrong"));
              }
              //   setModal(false);
            }}
          >
            Export as Excel
          </button>
        </div>
      </div>
    </Modal>
  );
}
