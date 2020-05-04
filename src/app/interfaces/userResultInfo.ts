import { GroupInfo } from './groupInfo';

export interface UserResultInfo {
  name?: string;
  groups?: GroupInfo[];
  totalScore?: number;
  previousWeeksScore?: number;
  position?: number;
}
