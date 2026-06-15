import type { Scenario } from './types';
import { SCENARIO_A } from './scenarioA';
import { SCENARIO_B } from './scenarioB';
import { SCENARIO_C } from './scenarioC';
import { SCENARIO_D } from './scenarioD';

export const SCENARIOS: Scenario[] = [SCENARIO_A, SCENARIO_B, SCENARIO_C, SCENARIO_D];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export type { Scenario, DecisionStep, DecisionOption } from './types';
