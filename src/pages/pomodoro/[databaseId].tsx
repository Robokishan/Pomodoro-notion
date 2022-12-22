import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import Line from "../../Components/Line";
import ProjectSelection from "../../Components/ProjectSelection";
import Tabs from "../../Components/Tabs";
import Views from "../../Components/Views";
import usePieData from "../../hooks/usePieData";
import { queryDatabase } from "../../utils/apis/notion/database";
import { getProjectId, getProjectTitle } from "../../utils/notion";
import { actionTypes } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  try {
    const database = await queryDatabase(query.databaseId as string, true);
    return {
      props: {
        database,
      },
    };
  } catch (error) {
    const err = error as AxiosError;
    if (process.env.NODE_ENV === "development")
      return {
        props: {
          error: err.response?.data,
        },
      };
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }
};

const tabs = [
  {
    label: "Timer",
    value: "timer",
  },
  {
    label: "Noise",
    value: "noise",
  },
  {
    label: "Analytics",
    value: "analytics",
  },
];
export default function Pages({
  database,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [piedata] = usePieData({ inputData: database?.results || [] });
  const [project, setProject] = useState<
    Record<string, unknown> | undefined | null
  >(null);
  const [activeTab, setActiveTab] = useState(tabs[0]!.value);
  const [{ busyIndicator }, dispatch] = useStateValue();

  const projects = useMemo(() => {
    return (
      database?.results.map((project) => ({
        label: getProjectTitle(project),
        value: getProjectId(project),
      })) || []
    );
  }, [database?.results]);

  const onProjectSelect = (proj?: { label: string; value: string }) => {
    if (!proj)
      dispatch({
        type: actionTypes.RESET_TIMERS,
      });

    dispatch({
      type: actionTypes.SET_PROJECTID,
      payload: proj?.value,
    });

    dispatch({
      type: actionTypes.FROZE_POMODORO,
      payload: !proj,
    });
    setProject(proj);
  };

  return (
    <>
      <main className="container mx-auto flex  flex-col  items-center  p-4 ">
        <h2 className="flex items-center gap-5 text-4xl font-extrabold leading-normal text-gray-700">
          <Link href="/">
            <ArrowLeftIcon className="inline h-5 w-5 cursor-pointer text-gray-700 md:top-[45px] md:left-[-45px] md:h-[1.75rem] md:w-[1.75rem]" />
          </Link>
          <span>
            Pomo<span className="text-purple-300">doro</span>
          </span>
        </h2>
        <Line
          margin="10px 0px 10px 0px"
          height="1px"
          backgroundColor="#37415130"
          width="50%"
        />
        {!error ? (
          <>
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
            <div className="m-5">
              <ProjectSelection
                disabled={busyIndicator}
                value={project}
                handleSelect={onProjectSelect}
                projects={projects}
              />
            </div>
            <Views
              activeTab={activeTab}
              pieData={piedata}
              handleSelect={onProjectSelect}
              projectName={getProjectTitle(
                database?.results.find((pr) => pr.id == String(project)),
                "Please select project"
              )}
            />
          </>
        ) : (
          JSON.stringify(error)
        )}
      </main>
    </>
  );
}
