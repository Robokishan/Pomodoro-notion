import { AxiosError } from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { queryDatabase } from "../../utils/apis/notion/database";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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

export default function Pages({
  database,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          <Link href="/">
            <ArrowLeftIcon className="h-5 w-5 cursor-pointer text-blue-500" />
          </Link>
          Pomodoro <span className="text-purple-300">T3</span> App
        </h1>
        {database ? (
          <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
            {database.results && database.results?.length > 0 ? (
              database.results.map((r) => (
                <PageTile
                  key={r.id}
                  description={r.icon?.emoji || ""}
                  title={r.properties?.Name?.title[0]?.text?.content || ""}
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
