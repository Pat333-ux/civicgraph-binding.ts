// Beast-System-3-CivicGraph/src/civicgraph-binding.ts

import {
  CivicGraphRuntime,
  TelemetrySignal,
} from "./civicgraph-runtime";

// Governance engine interfaces
export interface ConstitutionEngine {
  id: string;
  applyIdentityContext(payload: {
    nodeId: string;
    influence: number;
    wellbeing: number;
    traumaRisk: number;
  }): void;
}

export interface ResolutionEngine {
  id: string;
  applyStakeholderWeights(payload: {
    nodeId: string;
    influence: number;
    wellbeing: number;
    traumaRisk: number;
  }): void;
}

export interface MunicipalOrchestrator {
  id: string;
  routeActor(payload: {
    nodeId: string;
    ministryId: string;
    influence: number;
    wellbeing: number;
    traumaRisk: number;
  }): void;
}

export interface LUCRBindingEngine {
  id: string;
  bindIdentity(payload: {
    nodeId: string;
    lucrDelta: number;
    wellbeing: number;
    traumaRisk: number;
  }): void;
}

export class CivicGraphBindingLayer {
  constructor(
    private graph: CivicGraphRuntime,
    private constitution?: ConstitutionEngine,
    private resolution?: ResolutionEngine,
    private municipal?: MunicipalOrchestrator,
    private lucr?: LUCRBindingEngine
  ) {}

  // Ingest telemetry → update graph → push identity context to all engines
  public ingestTelemetry(signal: Omit<TelemetrySignal, "timestamp">): void {
    const full = this.graph.addTelemetry(signal);

    const influence = this.graph.calculateInfluence(full.nodeId);
    const wellbeing = this.graph.calculateWellbeing(full.nodeId);
    const traumaRisk = this.graph.calculateTraumaRisk(full.nodeId);

    this.pushToConstitution(full.nodeId, influence, wellbeing, traumaRisk);
    this.pushToResolution(full.nodeId, influence, wellbeing, traumaRisk);
    this.pushToMunicipal(full.nodeId, influence, wellbeing, traumaRisk);
    this.pushToLUCR(full.nodeId, influence, wellbeing, traumaRisk);
  }

  private pushToConstitution(
    nodeId: string,
    influence: number,
    wellbeing: number,
    traumaRisk: number
  ): void {
    if (!this.constitution) return;
    this.constitution.applyIdentityContext({
      nodeId,
      influence,
      wellbeing,
      traumaRisk,
    });
  }

  private pushToResolution(
    nodeId: string,
    influence: number,
    wellbeing: number,
    traumaRisk: number
  ): void {
    if (!this.resolution) return;
    this.resolution.applyStakeholderWeights({
      nodeId,
      influence,
      wellbeing,
      traumaRisk,
    });
  }

  private pushToMunicipal(
    nodeId: string,
    influence: number,
    wellbeing: number,
    traumaRisk: number
  ): void {
    if (!this.municipal) return;

    // Placeholder: ministry resolution logic will be added later
    const ministryId = "ministry_public_health";

    this.municipal.routeActor({
      nodeId,
      ministryId,
      influence,
      wellbeing,
      traumaRisk,
    });
  }

  private pushToLUCR(
    nodeId: string,
    influence: number,
    wellbeing: number,
    traumaRisk: number
  ): void {
    if (!this.lucr) return;

    const lucrDelta = wellbeing * (1 - traumaRisk) * (0.5 + influence / 2);

    this.lucr.bindIdentity({
      nodeId,
      lucrDelta,
      wellbeing,
      traumaRisk,
    });
  }
}

// Wiring function for activation
export function createBoundCivicGraph(
  constitution?: ConstitutionEngine,
  resolution?: ResolutionEngine,
  municipal?: MunicipalOrchestrator,
  lucr?: LUCRBindingEngine
): CivicGraphBindingLayer {
  const graph = new CivicGraphRuntime();
  return new CivicGraphBindingLayer(graph, constitution, resolution, municipal, lucr);
}
