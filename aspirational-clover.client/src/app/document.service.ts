import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppDocument } from "../types";

@Injectable({
  providedIn: "root"
})
export class DocumentService {
  private _apiDocumentUrl = "/document";

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<AppDocument[]> {
    return this.http.get<AppDocument[]>(this._apiDocumentUrl);
  }
}
