import { Result } from "../../types/database/databaseQuery";

export const getProjectTitle = (
  project: Result | undefined,
  defaultText = "Empty"
): string => {
  if (
    project?.properties?.Name?.title &&
    project?.properties?.Name?.title?.length > 0
  ) {
    return project.properties?.Name?.title
      .map(function (t) {
        return t.text?.content;
      })
      .join("");
  } else {
    return defaultText;
  }
};
export const getProjectId = (project: Result): string => {
  return project.id;
};
