import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {

  constructor(private storage: Storage) { }

  async intercept(req: HttpRequest<any>, next: HttpHandler): Promise<Observable<HttpEvent<any>>> {
    if (await this.storage.get('Token')) {
      const jwt = await this.storage.get('Token');
      const token = jwt.token

      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + token)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
