import { Observable } from "rxjs";
import { IResult } from "../../models";

export interface IStorage<T> {
  get(filter?: (item: T) => boolean): Observable<IResult<T[]>>;
  add(item: T): Observable<IResult<T>>;
  update(item: T): Observable<IResult<T>>;
  remove(item: T): Observable<IResult<boolean>>;
}
