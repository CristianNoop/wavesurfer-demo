import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileObject } from './file-object';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  private baseUrl: string;
  private fileListUrl: string;
  private fileUrl: string;
  private deleteUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8080'
    this.fileListUrl = this.baseUrl + '/fileList';
    this.fileUrl = this.baseUrl + '/getFile'
    this.deleteUrl = this.baseUrl + '/deleteFile'
    
  }

  public findAll(): Observable<FileObject[]> {
    return this.http.get<FileObject[]>(this.fileListUrl);
  }

  public findFile(fileName : string) {
    console.log(this.fileListUrl + `?fileName=${fileName}`)
    return this.http.get<Byte[]>(this.fileUrl + `?fileName=${fileName}`);
  }

  public deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.deleteUrl}/${fileName}`, { responseType: 'text' });
  }

  
  public upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadFile`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  public getBaseUrl() {
    return this.baseUrl;
  }
}
