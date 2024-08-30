import { InjectionToken } from "@angular/core";
import { IPlayer } from "../../models";
import { IDataService } from "../i-data.service";

export const PLAYERS_SERVICE = new InjectionToken<IDataService<IPlayer>>("PLAYERS_SERVICE");