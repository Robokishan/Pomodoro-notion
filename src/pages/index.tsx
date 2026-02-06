import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import NotionConnectModal from "../Components/NotionConnectModal";
import { useTheme } from "../utils/Context/ThemeContext";
import ContentLoader from "react-content-loader";

function Home() {
  const [showModal, setModal] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, isFetching } = trpc.private.getDatabases.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center p-4">
        {isFetching && (
          <div>
            <ContentLoader className="mt-2" height={100} width={160} viewBox="0 0 160 100"
              backgroundColor={isDark ? "#374151" : "#e0e0e0"} foregroundColor={isDark ? "#4b5563" : "#f5f5f5"}>
              <rect x="0" y="0" rx="5" ry="5" width="160" height="100" />
            </ContentLoader>
            <ContentLoader className="mt-2" height={100} width={160} viewBox="0 0 160 100"
              backgroundColor={isDark ? "#374151" : "#e0e0e0"} foregroundColor={isDark ? "#4b5563" : "#f5f5f5"}>
              <rect x="0" y="0" rx="5" ry="5" width="160" height="100" />
            </ContentLoader>
          </div>
        )}
        {!isFetching && data && (
          <>
            <Header imgSrc={data?.workspace?.workspace_icon} />
            {data?.databases?.results && data?.databases.results.length > 0 ? (
              <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
                {data.databases.results.map((d) => (
                  <DatabaseCard
                    key={d.id}
                    title={(d.title && d?.title[0]?.text?.content) || "Unkown"}
                    description={
                      (d.description && d.description?.length > 0 && JSON.stringify(d.description)) || "No description"
                    }
                    databasehref={`database/${d.id}`}
                    pomodorohref={`pomodoro/${d.id}`}
                  />
                ))}
              </div>
            ) : (
              <>
                <h2 className="w-100 mt-10 text-center text-4xl leading-normal text-muted">
                  No Database found
                </h2>
                <button
                  onClick={() => setModal(true)}
                  className="mt-5 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                >
                  Add Notion
                </button>
                <section className="mt-10"><Footer /></section>
                {showModal && <NotionConnectModal setModal={setModal} />}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Home;

type DatabaseProps = {
  title: string;
  description: string;
  databasehref: string;
  pomodorohref: string;
};

const DatabaseCard = ({ title, description, pomodorohref }: DatabaseProps) => {
  return (
    <Link href={pomodorohref} className="flex cursor-pointer flex-col justify-center rounded-md border-2 border-theme bg-surface-card p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
        <h2 className="text-lg text-heading">{title}</h2>
        <p className="text-sm text-body">{description}</p>
        <span className="mt-5 rounded-md bg-gray-600 py-2 px-4 text-center text-gray-200 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">
          Pomodoro
        </span>
    </Link>
  );
};
