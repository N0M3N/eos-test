import { Observable } from "rxjs";
import { IResult } from "../models";

export interface IDataService<T> {
  get(filter?: (item: T) => boolean): Observable<IResult<T[]>>;
  create(item: T): Observable<IResult<T>>;
  update(item: T): Observable<IResult<T>>;
  delete(item: T): Observable<IResult<boolean>>;
}
