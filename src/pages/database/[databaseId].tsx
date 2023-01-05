import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { queryDatabase } from "../../utils/apis/notion/database";
import { fetchNotionUser } from "../../utils/apis/firebase/userNotion";
import { getProjectTitle } from "@/utils/notionutils";

export const getServerSideProps = async ({
  query,
  req,
}: GetServerSidePropsContext) => {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) throw new Error("Something went wrong");
    const user = await fetchNotionUser(session?.user?.email);
    if (!user) throw new Error("User not found");
    const database = await queryDatabase(
      query.databaseId as string,
      true,
      user.accessToken
    );
    return {
      props: {
        database,
      },
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      props: {
        error: err.response?.data,
      },
    };
  }
};

export default function Pages({
  database,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main className=" container mx-auto flex min-h-screen flex-col items-center p-4">
        <h2 className="flex items-center gap-5 text-4xl font-extrabold leading-normal text-gray-700">
          <Link href="/">
            <ArrowLeftIcon className="inline h-5 w-5 cursor-pointer text-gray-700 md:top-[45px] md:left-[-45px] md:h-[1.75rem] md:w-[1.75rem]" />
          </Link>
          <span>
            Project <span className="text-purple-300">Lists</span>
          </span>
        </h2>

        {database ? (
          <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
            {database.results && database.results?.length > 0 ? (
              database.results.map((r) => (
                <PageTile
                  key={r.id}
                  icon={r.icon?.emoji || ""}
                  title={getProjectTitle(r) || ""}
                />
              ))
            ) : (
              <h2>no results</h2>
            )}
          </div>
        ) : (
          <h2 className="w-100 mt-10 text-center leading-normal text-gray-500">
            {JSON.stringify(error)}
          </h2>
        )}
      </main>
    </>
  );
}

type PageProps = {
  icon: any;
  title: string;
  description: string;
};

const PageTile = ({ icon, title, description }: PageProps) => {
  return (
    <section className="flex cursor-pointer flex-col justify-center rounded border-2 border-gray-200 p-2 shadow-md duration-500 motion-safe:hover:scale-105">
      <div className="flex items-baseline gap-[4px] text-sm">
        <span>{icon}</span>
        <span className=" text-gray-700">{title}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </section>
  );
};
