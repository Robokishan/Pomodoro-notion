import { Result } from "../types/database/databaseQuery";

export const getProjectTitle = (
  project: Result | undefined,
  defaultText = "Empty"
): string => {
  return (
    (project?.properties?.Name?.title &&
      project.properties?.Name?.title.length > 0 &&
      project.properties?.Name?.title[0]?.text?.content) ||
    defaultText
  );
};
export const getProjectId = (project: Result): string => {
  return project.id;
};
