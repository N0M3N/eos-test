import { InjectionToken } from "@angular/core";
import { ITeam } from "../../models";
import { IDataService } from "../i-data.service";

export const TEAMS_SERVICE = new InjectionToken<IDataService<ITeam>>("TEAMS_SERVICE");