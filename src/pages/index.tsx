import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import NotionConnectModal from "../Components/NotionConnectModal";
import { fetchNotionUser } from "../utils/apis/firebase/userNotion";
import { listDatabases } from "../utils/apis/notion/database";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) throw new Error("Session not found");
    const user = await fetchNotionUser(session?.user?.email);
    if (!user) throw new Error("User not found");
    const databases = await listDatabases(true, user.accessToken);

    return {
      props: {
        databases,
        workspace: user.workspace,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Something went wrong",
      },
    };
  }
};

function Home({
  databases,
  workspace,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showModal, setModal] = useState(false);
  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center  p-4">
        <Header imgSrc={workspace?.workspace_icon} />

        {databases?.results && databases.results.length > 0 ? (
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
            <button
              onClick={() => setModal(true)}
              className="mt-5 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            >
              Add Notion
            </button>
            <section className="mt-10">
              <Footer />
            </section>
            {showModal && <NotionConnectModal setModal={setModal} />}
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
          <button className="mt-5 rounded-md bg-gray-600 py-2 px-4 text-gray-200  hover:bg-gray-700">
            Pomodoro
          </button>
        </Link>
      </section>
    </Link>
  );
};
