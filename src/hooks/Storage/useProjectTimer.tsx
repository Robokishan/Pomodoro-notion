import { useEffect, useRef, useState } from "react";
import { convertToMMSS } from "../Pomodoro/Time/useTime";
import { useLocalStorage } from "./useLocalStorage";

type ID = string;
type TIMER_VALUE = number;
type ProjectTimer = Record<ID, TIMER_VALUE>;

interface Projects {
  projects: ProjectTimer;
}

const projectKey = "PROJECT_KEY";

type ProjectState = { projectId: string; value: number };
type SetterProject = (prevState: number) => ProjectState;
type SetStateAction = ProjectState | SetterProject;

export const useProjectTimer = (
  projectId?: string
): [number, (data: SetStateAction) => void] => {
  const [preservedData, setPreservedData] = useLocalStorage<Projects>(
    projectKey,
    { projects: {} }
  );
  const [projectTimer, setProjectTimer] = useState<number>(0);
  const memoryState = useRef<Projects>({
    projects: {},
  });

  function setMemoryState(argument: SetStateAction) {
    if (typeof argument === "function") {
      const _t = argument(projectTimer);
      memoryState.current.projects[_t.projectId] = _t.value;
    } else {
      memoryState.current = {
        projects: {
          ...memoryState.current.projects,
          [argument.projectId]: argument.value,
        },
      };
    }
    setPreservedData({ ...memoryState.current });
  }

  useEffect(() => {
    memoryState.current = preservedData;
  }, [preservedData]);

  useEffect(() => {
    if (projectId) setProjectTimer(preservedData.projects[projectId] || 0);
    else setProjectTimer(0);
  }, [preservedData.projects, projectId, setProjectTimer]);

  return [projectTimer, setMemoryState];
};
