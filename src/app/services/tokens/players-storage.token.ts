import { InjectionToken } from "@angular/core";
import { IStorage } from "../storage";
import { IPlayer } from "../../models";

export const PLAYERS_STORAGE = new InjectionToken<IStorage<IPlayer>>("PLAYERS_STORAGE");