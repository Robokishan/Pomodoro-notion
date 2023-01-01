import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";
import Shield from "../Components/Shield";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Shield>
        <Component {...pageProps} />
      </Shield>
    </SessionProvider>
  );
};

export default MyApp;
