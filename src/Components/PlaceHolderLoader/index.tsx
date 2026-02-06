import React from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";
import { useTheme } from "../../utils/Context/ThemeContext";

export default function PlaceHolderLoader(props: IContentLoaderProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ContentLoader
      className="mt-2"
      height={48}
      width={310}
      viewBox="0 0 310 48"
      backgroundColor={isDark ? "#374151" : "#e0e0e0"}
      foregroundColor={isDark ? "#4b5563" : "#f5f5f5"}
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width="310" height="48" />
    </ContentLoader>
  );
}
