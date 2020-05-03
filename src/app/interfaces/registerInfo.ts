import { GroupInfo } from './groupInfo';

export interface RegisterInfo {
  name: string;
  email: string;
  password: string;
  groups?: GroupInfo[];
  newGroup?: string;
}
