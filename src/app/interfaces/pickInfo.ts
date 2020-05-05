import { TeamWonOrSelected } from './teamWonOrSelected';

export interface PickInfo {
  userId?: number;
  weekNumber?: number;
  teamsSelected?: TeamWonOrSelected[];
  weeksScore?: number;
}
