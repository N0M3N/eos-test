import { delay, Observable, of } from "rxjs";
import { ID, IResult } from "../models";
import { IDataService } from "./i-data.service";
import { v4 } from 'uuid';
import { inject } from "@angular/core";
import { IStorageSettings } from "./storage.settings";

export class LocalListStorage<T extends ID> implements IDataService<T> {
  protected settings = inject(IStorageSettings);

  constructor(protected readonly key: string) { };

  get(filter?: (item: T) => boolean): Observable<IResult<T[]>> {
    return this.applySettings(() => {
      const result = [] as T[];
      for (const key in localStorage) {
        if (key.startsWith(`${this.key}_`))
          result.push(JSON.parse(localStorage.getItem(key)!));
      }
      return { success: true, data: result.filter(x => filter ? filter(x) : true) };
    });
  }

  create(item: T): Observable<IResult<T>> {
    return this.applySettings(() => {
      item.id = v4()
      const key = this.getKey(item);
      localStorage.setItem(key, JSON.stringify(item));
      return { success: true, data: item };
    })
  }

  update(item: T): Observable<IResult<T>> {
    return this.applySettings(() => {
      const key = this.getKey(item);
      if (!localStorage.getItem(key))
        return { success: false, message: `Item with ID ${item.id} does not exist` };
      localStorage.setItem(key, JSON.stringify(item));
      return { success: true, data: item };
    });
  }

  delete(item: T): Observable<IResult<boolean>> {
    return this.applySettings(() => {
      const key = this.getKey(item);
      if (!localStorage.getItem(key))
        return { success: false, message: `Item with ID ${item.id} does not exist` };
      localStorage.removeItem(key);
      return { success: true, data: true };
    });
  }

  private getKey(entity: ID) {
    return `${this.key}_${entity.id}`;
  }

  private applySettings<TResult>(action: () => IResult<TResult>): Observable<IResult<TResult>> {
    try {
      return of(action()).pipe(delay(this.settings.delay ?? 0));
    } catch (e) {
      return of({ success: false, message: e } as IResult<TResult>).pipe(delay(this.settings.delay ?? 0));
    }
  }
}