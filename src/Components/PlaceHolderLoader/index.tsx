import React from "react";
import ContentLoader from "react-content-loader";

export default function PlaceHolderLoader() {
  return (
    <ContentLoader
      className="mt-2"
      height={48}
      width={310}
      viewBox="0 0 310 48"
    >
      <rect x="0" y="0" rx="5" ry="5" width="310" height="48" />
    </ContentLoader>
  );
}
