import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Line from "../../Components/Line";
import NotionTags from "../../Components/NotionTags";
import ProjectSelection from "../../Components/ProjectSelection";
import Tabs from "../../Components/Tabs";
import Views from "../../Components/Views";
import useFormattedData from "../../hooks/useFormattedData";
import { getSession } from "next-auth/react";
import {
  queryDatabase,
  retrieveDatabase,
} from "../../utils/apis/notion/database";
import { getProjectId, getProjectTitle } from "../../utils/notionutils";
import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import { actionTypes as userActiontype } from "../../utils/Context/UserContext/reducer";
import { actionTypes as projActiontype } from "../../utils/Context/ProjectContext/reducer";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { notEmpty } from "../../types/notEmpty";
import { fetchNotionUser } from "../../utils/apis/firebase/userNotion";
import { useUserState } from "../../utils/Context/UserContext/Context";
import { useProjectState } from "@/utils/Context/ProjectContext/Context";

export const getServerSideProps = async ({
  query,
  req,
}: GetServerSidePropsContext) => {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) throw new Error("Session not found");
    const user = await fetchNotionUser(session?.user?.email);
    if (!user) throw new Error("User not found");
    const [database, db] = await Promise.all([
      queryDatabase(query.databaseId as string, true, user.accessToken),
      retrieveDatabase(query.databaseId as string, true, user.accessToken),
    ]);
    return {
      props: {
        userId: user.id,
        database,
        db,
        tab: (query?.tab as string) || null,
        databaseId: query.databaseId as string,
      },
    };
  } catch (error) {
    console.log(error);
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
  userId,
  database,
  db,
  tab,
  error,
  databaseId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [selectedProperties, setProperties] = useState<
    Array<{
      label: string;
      value: string;
      color: string;
    }>
  >([]);

  const [activeTab, setActiveTab] = useState(tab || tabs[0]!.value);

  const [{ busyIndicator, project }, dispatch] = usePomoState();
  const [, userDispatch] = useUserState();
  const [, projectDispatch] = useProjectState();

  useEffect(() => {
    router.push(
      {
        query: {
          databaseId: router.query.databaseId,
          tab: activeTab,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }, [activeTab]);

  useEffect(
    () =>
      userDispatch({
        type: userActiontype.SET_USERID,
        payload: userId,
      }),
    [userId]
  );

  useEffect(() => {
    if (databaseId)
      dispatch({
        type: actionTypes.SET_DATABASEID,
        payload: databaseId,
      });
  }, [databaseId]);

  useEffect(() => {
    if (database?.results) {
      const notionProjects =
        database?.results
          .map((project) => {
            // filter project list based on tags selected
            if (
              selectedProperties.every(
                (sp) =>
                  project.properties?.Tags?.multi_select?.findIndex(
                    (m) => m.id == sp.value
                  ) != -1
              ) ||
              selectedProperties.length == 0
            )
              return project;
            return null;
          })
          .filter(notEmpty) || [];
      projectDispatch({
        type: projActiontype.UPDATE_NOTION_PROJECTS,
        payload: notionProjects,
      });
    }
  }, [database?.results, selectedProperties]);

  const [piedata] = useFormattedData();

  const projects = useMemo(() => {
    return (
      database?.results
        .map((project) => {
          // filter project list based on tags selected
          if (
            selectedProperties.every(
              (sp) =>
                project.properties?.Tags?.multi_select?.findIndex(
                  (m) => m.id == sp.value
                ) != -1
            ) ||
            selectedProperties.length == 0
          )
            return {
              label: getProjectTitle(project),
              value: getProjectId(project),
            };
          return null;
        })
        .filter(notEmpty) || []
    );
  }, [database?.results, selectedProperties]);

  const properties = useMemo(() => {
    if (
      db?.properties &&
      db.properties.Tags?.multi_select &&
      db.properties.Tags.multi_select.options
    )
      return db?.properties?.Tags?.multi_select?.options.map((prp) => ({
        label: prp.name,
        value: prp.id,
        color: prp.color,
      }));
    else return [];
  }, []);

  const onProjectSelect = (proj: { label: string; value: string } | null) => {
    if (!proj)
      dispatch({
        type: actionTypes.RESET_TIMERS,
      });

    dispatch({
      type: actionTypes.SET_PROJECTID,
      payload: proj,
    });
    dispatch({
      type: actionTypes.FROZE_POMODORO,
      payload: !proj,
    });
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
            <NotionTags
              disabled={busyIndicator}
              handleSelect={setProperties}
              options={properties}
            />
            <Views
              activeTab={activeTab}
              pieData={piedata}
              projectName={getProjectTitle(
                database?.results.find((pr) => pr.id == String(project?.value)),
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
