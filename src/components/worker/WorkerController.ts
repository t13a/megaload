export class WorkerController {
  constructor() {
    global.addEventListener("error", (e) => this.onError(e));
    global.addEventListener("message", (e) => this.onMessage(e));
    global.addEventListener("messageerror", (e) => this.onMessageError(e));
  }

  private async onError(e: ErrorEvent) {
    throw new Error("Not implemented yet");
  }

  private async onMessage(e: MessageEvent) {
    throw new Error("Not implemented yet");
  }

  private async onMessageError(e: MessageEvent) {
    throw new Error("Not implemented yet");
  }
}
