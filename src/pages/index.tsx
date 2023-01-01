import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { listDatabases } from "../utils/apis/notion/database";

export const getServerSideProps = async () => {
  try {
    const databases = await listDatabases(true);
    return {
      props: {
        databases,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: "Something went wrong",
      },
    };
  }
};

function Home({
  databases,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center  p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[4rem]">
          Pomodoro <span className="text-purple-300">Databases</span> Notion
        </h1>

        {databases?.results ? (
          <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
            {databases.results.map((d) => (
              <DatabaseCard
                key={d.id}
                title={(d.title && d?.title[0]?.text?.content) || "Unkown"}
                description={
                  (d.description &&
                    d.description?.length > 0 &&
                    JSON.stringify(d.description)) ||
                  "No description"
                }
                databasehref={`database/${d.id}`}
                pomodorohref={`pomodoro/${d.id}`}
              />
            ))}
          </div>
        ) : (
          <>
            <h2 className="w-100 mt-10 text-center text-4xl leading-normal text-gray-500">
              No Database found
            </h2>
            <Link
              href={`https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NOTION_AUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${process.env.NEXT_PUBLIC_NOTION_AUTH_REDIRECT_URI}`}
            >
              <a>
                <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
                  Add to Notion
                </button>
              </a>
            </Link>
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

const DatabaseCard = ({
  title,
  description,
  databasehref,
  pomodorohref,
}: DatabaseProps) => {
  return (
    <Link href={databasehref}>
      <section className="flex cursor-pointer flex-col justify-center rounded-md border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
        <h2 className="text-lg text-gray-700">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <Link href={pomodorohref}>
          <button className="mt-5 rounded-md bg-gray-600 py-2 px-4 text-gray-200  hover:bg-gray-400">
            Pomodoro
          </button>
        </Link>
      </section>
    </Link>
  );
};
