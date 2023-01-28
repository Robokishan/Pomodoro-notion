import { generateUUID } from "../utils";
import IntervalWork from "./worker";

export interface Work {
  id: string;
  callback: () => void;
}

export default class WorkerInterval {
  private works: Work[] = [];
  private readonly worker: Worker;

  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url));
    this.worker.onmessage = (data) => this.onMessage(data);
  }

  public setInterval(callback: () => void, delay: number): string | null {
    const work: Work = {
      id: generateUUID(),
      callback,
    };

    this.works.push(work);

    const intervalWork: IntervalWork = {
      name: "setInterval",
      id: work.id,
      delay,
    };

    this.worker.postMessage(intervalWork);

    return work.id;
  }

  public clearInterval(id: string): void {
    const workIndex = this.works?.findIndex((x) => x.id === id);
    if (workIndex === null || workIndex < 0) {
      return;
    }

    const intervalWork: IntervalWork = {
      name: "clearInterval",
      //   TODO: not able to resolve ts issue here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id: this.works[workIndex].id,
    };

    this.worker.postMessage(intervalWork);
    this.works.splice(workIndex, 1);
  }

  private onMessage(event: MessageEvent): void {
    const intervalWork = event.data && (event.data as IntervalWork);
    if (!intervalWork) {
      return;
    }

    switch (intervalWork.name) {
      case "runCallback": {
        const work = this.works?.find((x) => x.id === intervalWork.id);
        if (!work) {
          return;
        }

        work.callback();
        break;
      }
    }
  }
}
