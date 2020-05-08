import { GroupInfo } from './groupInfo';
import { TeamWonOrSelected } from './teamWonOrSelected';

export interface UserResultInfo {
  name?: string;
  groups?: GroupInfo[];
  totalScore?: number;
  previousWeeksScore?: number;
  position?: number;
  teamsSelected?: TeamWonOrSelected[];
  weeksScore?: number;
}
