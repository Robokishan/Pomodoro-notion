import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Shield from "../Components/Shield";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface CustomPageProps {
  session: Session;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<CustomPageProps>) => {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <SpeedInsights />
      <SessionProvider session={session}>
        <Shield>
          <Component {...pageProps} />
        </Shield>
        <Analytics />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
