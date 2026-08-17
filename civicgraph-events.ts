// Beast-System-3-CivicGraph/src/civicgraph-events.ts

export type CivicGraphEventType =
  | "NODE_ADDED"
  | "EDGE_ADDED"
  | "TELEMETRY_ADDED"
  | "INFLUENCE_UPDATED"
  | "WELLBEING_UPDATED"
  | "TRAUMA_UPDATED";

export interface CivicGraphEvent {
  type: CivicGraphEventType;
  payload: Record<string, unknown>;
  timestamp: string;
}

export type EventListener = (event: CivicGraphEvent) => void;

export class CivicGraphEventEmitter {
  private listeners: Map<CivicGraphEventType, EventListener[]> = new Map();

  // Register listener for a specific event type
  public on(type: CivicGraphEventType, listener: EventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);
  }

  // Emit event to all listeners
  public emit(type: CivicGraphEventType, payload: Record<string, unknown>): void {
    const event: CivicGraphEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const handlers = this.listeners.get(type);
    if (!handlers) return;

    for (const handler of handlers) {
      handler(event);
    }
  }

  // Convenience wrappers
  public nodeAdded(nodeId: string): void {
    this.emit("NODE_ADDED", { nodeId });
  }

  public edgeAdded(edgeId: string): void {
    this.emit("EDGE_ADDED", { edgeId });
  }

  public telemetryAdded(nodeId: string): void {
    this.emit("TELEMETRY_ADDED", { nodeId });
  }

  public influenceUpdated(nodeId: string, value: number): void {
    this.emit("INFLUENCE_UPDATED", { nodeId, value });
  }

  public wellbeingUpdated(nodeId: string, value: number): void {
    this.emit("WELLBEING_UPDATED", { nodeId, value });
  }

  public traumaUpdated(nodeId: string, value: number): void {
    this.emit("TRAUMA_UPDATED", { nodeId, value });
  }
}
