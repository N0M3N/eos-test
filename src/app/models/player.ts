import { ID } from "./id";

export interface IPlayer extends ID {
  firstName: string;
  lastName: string;
  position: string;
  teamId: string;
}
