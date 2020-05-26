import { GroupInfo } from './groupInfo';
import { TeamWonOrSelected } from './teamWonOrSelected';

export interface UserResultInfo {
  name?: string;
  groups?: GroupInfo[];
  score?: number;
  lastWeek?: number;
  position?: number;
  teamsSelected?: TeamWonOrSelected[];
  weeksScore?: number;
}
