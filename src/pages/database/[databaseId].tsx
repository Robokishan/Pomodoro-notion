import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { queryDatabase } from "../../utils/apis/notion/database";

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
    return {
      props: {
        error: err.response?.data,
      },
    };
  }
};

// const piedata = [
//   {
//     id: "rust",
//     label: "rust",
//     value: 209,
//     color: "hsl(199, 70%, 50%)",
//   },
//   {
//     id: "make",
//     label: "make",
//     value: 139,
//     color: "hsl(145, 70%, 50%)",
//   },
//   {
//     id: "sass",
//     label: "sass",
//     value: 122,
//     color: "hsl(158, 70%, 50%)",
//   },
//   {
//     id: "hack",
//     label: "hack",
//     value: 457,
//     color: "hsl(113, 70%, 50%)",
//   },
//   {
//     id: "css",
//     label: "css",
//     value: 30,
//     color: "hsl(218, 70%, 50%)",
//   },
// ];

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
                  description={r.icon?.emoji || ""}
                  title={
                    (r.properties?.Name?.title?.length &&
                      r.properties?.Name?.title[0]?.text?.content) ||
                    ""
                  }
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
  title: string;
  description: string;
};

const PageTile = ({ title, description }: PageProps) => {
  return (
    <section className="flex cursor-pointer flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </section>
  );
};
