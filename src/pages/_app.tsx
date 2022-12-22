import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import Shield from "../Components/Shield";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Shield>
      <Component {...pageProps} />
    </Shield>
  );
};

export default MyApp;
