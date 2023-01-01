import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Shield from "../Components/Shield";
import "../styles/globals.css";

interface CustomPageProps {
  session: Session;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<CustomPageProps>) => {
  return (
    <SessionProvider session={session}>
      <Shield>
        <Component {...pageProps} />
      </Shield>
    </SessionProvider>
  );
};

export default MyApp;
