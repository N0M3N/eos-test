import { InjectionToken } from "@angular/core";
import { IStorage } from "../storage";
import { ITeam } from "../../models";

export const TEAMS_STORAGE = new InjectionToken<IStorage<ITeam>>("TEAMS_STORAGE");