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
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Pomodoro <span className="text-purple-300">T3</span> App
        </h1>
        {databases && databases.results ? (
          <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
            {databases.results.map((d) => (
              <TechnologyCard
                key={d.id}
                title={(d.title && d?.title[0]?.text?.content) || "Unkown"}
                description={
                  (d.description &&
                    d.description?.length > 0 &&
                    JSON.stringify(d.description)) ||
                  "No description"
                }
                href={`database/${d.id}`}
              />
            ))}
          </div>
        ) : (
          <h2 className="w-100 mt-10 text-center text-4xl leading-normal text-gray-500">
            No Database found
          </h2>
        )}
      </main>
    </>
  );
}

export default Home;

type TechnologyCardProps = {
  title: string;
  description: string;
  href: string;
};

const TechnologyCard = ({ title, description, href }: TechnologyCardProps) => {
  return (
    <Link href={href}>
      <section className="flex cursor-pointer flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
        <h2 className="text-lg text-gray-700">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </section>
    </Link>
  );
};
