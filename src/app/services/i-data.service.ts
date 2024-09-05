import { Observable } from "rxjs";
import { ID, IResult } from "../models";

export interface IDataService<T extends ID> {
  get(filter?: (item: T) => boolean): Observable<IResult<T[]>>;
  create(item: T): Observable<IResult<T>>;
  update(item: T): Observable<IResult<T>>;
  delete(item: ID): Observable<IResult<boolean>>;
}
