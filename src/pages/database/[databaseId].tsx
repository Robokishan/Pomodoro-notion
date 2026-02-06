import { getProjectTitle } from "@/utils/notionutils";
import { trpc } from "@/utils/trpc";
import { useTheme } from "@/utils/Context/ThemeContext";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import ContentLoader from "react-content-loader";

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  try {
    return { props: { databaseId: query.databaseId as string } };
  } catch (error) {
    const err = error as AxiosError;
    return { props: { error: err.response?.data } };
  }
};

export default function Pages({
  databaseId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isFetching } = trpc.private.queryDatabase.useQuery(
    { databaseId: databaseId as string },
    { refetchOnWindowFocus: false }
  );
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center p-4">
        <h2 className="flex items-center gap-5 text-4xl font-extrabold leading-normal text-heading">
          <Link href="/">
            <ArrowLeftIcon className="inline h-5 w-5 cursor-pointer text-heading md:top-[45px] md:left-[-45px] md:h-[1.75rem] md:w-[1.75rem]" />
          </Link>
          <span>Project <span className="text-purple-300">Lists</span></span>
        </h2>

        {!isFetching && data?.database ? (
          <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
            {data?.database.results && data?.database.results?.length > 0 ? (
              data?.database.results.map((r) => (
                <PageTile key={r.id} icon={r.icon?.emoji || ""} title={getProjectTitle(r) || ""} />
              ))
            ) : (
              <h2 className="text-body">no results</h2>
            )}
          </div>
        ) : (
          <div className="m-5 flex flex-col gap-3">
            {new Array(2).fill(0).map((_, index) => (
              <ContentLoader key={`database-query-loader-${index}`} className="mt-2"
                height={48} width={310} viewBox="0 0 310 48"
                backgroundColor={isDark ? "#374151" : "#e0e0e0"} foregroundColor={isDark ? "#4b5563" : "#f5f5f5"}>
                <rect x="0" y="0" rx="5" ry="5" width="310" height="48" />
              </ContentLoader>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

type PageProps = { icon: any; title: string; description?: string };

const PageTile = ({ icon, title, description }: PageProps) => {
  return (
    <section className="flex cursor-pointer flex-col justify-center rounded border-2 border-theme bg-surface-card p-2 shadow-md duration-500 motion-safe:hover:scale-105">
      <div className="flex items-baseline gap-[4px] text-sm">
        <span>{icon}</span>
        <span className="text-heading">{title}</span>
      </div>
      {description && <p className="text-sm text-body">{description}</p>}
    </section>
  );
};
