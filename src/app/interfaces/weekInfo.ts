import { NewMatchToBePlayed } from './newMatchToBePlayed';
import { TeamWonOrSelected } from './teamWonOrSelected';

export interface WeekInfo {
  weekNumber: number;
  scoresUpdated?: boolean;
  teamsThatWon?: TeamWonOrSelected[];
  sortedMatchesToBePlayed?: NewMatchToBePlayed[];
  beforeDeadLine?: boolean;
  deadLineInstant?: string;
  filteredMatches?: NewMatchToBePlayed[];
}
