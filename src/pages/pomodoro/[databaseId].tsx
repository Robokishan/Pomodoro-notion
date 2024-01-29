import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Line from "../../Components/Line";
import NotionTags from "../../Components/NotionTags";

import { useProjectState } from "@/utils/Context/ProjectContext/Context";
import { trpc } from "@/utils/trpc";
import ContentLoader from "react-content-loader";
import PlaceHolderLoader from "../../Components/PlaceHolderLoader";
import Tabs from "../../Components/Tabs";
import { TabsOptions } from "../../Components/Views/utils";
import useFormattedData from "../../hooks/useFormattedData";
import { notEmpty } from "../../types/notEmpty";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import { actionTypes as projActiontype } from "../../utils/Context/ProjectContext/reducer";
import { useUserState } from "../../utils/Context/UserContext/Context";
import { actionTypes as userActiontype } from "../../utils/Context/UserContext/reducer";
import { getProjectId, getProjectTitle } from "../../utils/notionutils";

const ProjectSelection = dynamic(
  () => import("../../Components/ProjectSelection"),
  {
    loading: () => <PlaceHolderLoader />,
  }
);

const Views = dynamic(() => import("../../Components/Views"), {
  loading: () => <PlaceHolderLoader />,
});

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  try {
    return {
      props: {
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
        destination: "/login",
      },
      props: {},
    };
  }
};

export default function Pages({
  tab,
  databaseId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isFetching, error } = trpc.private.getDatabaseDetail.useQuery({
    databaseId: databaseId as string,
  });

  const router = useRouter();
  const [selectedProperties, setProperties] = useState<
    Array<{
      label: string;
      value: string;
      color: string;
    }>
  >([]);

  const [activeTab, setActiveTab] = useState(tab || TabsOptions[0]!.value);

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

  useEffect(() => {
    if (data?.userId && !isFetching)
      userDispatch({
        type: userActiontype.SET_USERID,
        payload: data?.userId,
      });
  }, [data, isFetching]);

  useEffect(() => {
    if (databaseId)
      dispatch({
        type: actionTypes.SET_DATABASEID,
        payload: databaseId,
      });
  }, [databaseId]);

  useEffect(() => {
    if (data?.database?.results) {
      const notionProjects =
        data.database?.results
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
  }, [data?.database?.results, selectedProperties]);

  const [piedata] = useFormattedData();

  const projects = useMemo(() => {
    return (
      data?.database?.results
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
  }, [data?.database?.results, selectedProperties]);

  const properties = useMemo(() => {
    if (
      data?.db?.properties &&
      data?.db.properties.Tags?.multi_select &&
      data?.db.properties.Tags.multi_select.options
    )
      return data?.db?.properties?.Tags?.multi_select?.options.map((prp) => ({
        label: prp.name,
        value: prp.id,
        color: prp.color,
      }));
    else return [];
  }, [data?.db]);

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
              tabs={TabsOptions}
            />
            {isFetching ? (
              <div className="m-5 flex flex-col gap-3">
                {new Array(2).fill(0).map((val, index) => (
                  <ContentLoader
                    key={`database-loader-${index}`}
                    className="mt-2"
                    height={48}
                    width={310}
                    viewBox="0 0 310 48"
                  >
                    <rect x="0" y="0" rx="5" ry="5" width="310" height="48" />
                  </ContentLoader>
                ))}
              </div>
            ) : (
              <>
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
                    data?.database?.results.find(
                      (pr) => pr.id == String(project?.value)
                    ),
                    "Please select project"
                  )}
                />
              </>
            )}
          </>
        ) : (
          JSON.stringify(error)
        )}
      </main>
    </>
  );
}
