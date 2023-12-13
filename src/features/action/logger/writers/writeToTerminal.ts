import { Terminal } from "xterm";
import { BufferedWriter, Log } from "..";

export const writeToTerminal = (terminal: Terminal): BufferedWriter => {
  return (logs: readonly Log[]) => {
    const data = logs.map((log) => log.data).join("\r\n");
    terminal.writeln(data);
  };
};
