export type AgentStatus = "idle" | "generating" | "done" | "error" | "stopped";

export interface AgentFile {
  filename: string;
  content: string;
  isStreaming: boolean;
  isDone: boolean;
}

export interface AgentState {
  status: AgentStatus;
  files: Record<string, AgentFile>;
  fileOrder: string[];
  logs: string[];
  error: string | null;
  activeFile: string | null;
}

export type AgentEvent =
  | { type: "file_start"; filename: string }
  | { type: "file_chunk"; filename: string; chunk: string }
  | { type: "file_end"; filename: string; content: string }
  | { type: "agent_log"; message: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };
