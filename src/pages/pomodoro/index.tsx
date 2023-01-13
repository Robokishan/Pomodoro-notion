// put here for redirection purpose
import React from "react";

export const getServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
};

export default function index() {
  return <div>index</div>;
}
