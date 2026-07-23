import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contribuyente {
  id: number;
  cuit: string;
  apellido: string;
  nombre: string;
  domicilio?: string;
  activo: boolean;
}

export interface CreateContribuyenteRequest {
  cuit: string;
  apellido: string;
  nombre: string;
  domicilio?: string;
  activo?: boolean;
}

export type UpdateContribuyenteRequest = Partial<CreateContribuyenteRequest>;

@Injectable({ providedIn: 'root' })
export class ContribuyentesService {
  private readonly apiUrl = 'http://localhost:3000/api/contribuyentes';

  constructor(private readonly http: HttpClient) {}

  findAll(q?: string): Observable<Contribuyente[]> {
    return this.http.get<Contribuyente[]>(this.apiUrl, { params: q ? { q } : {} });
  }

  findOne(id: number): Observable<Contribuyente> {
    return this.http.get<Contribuyente>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateContribuyenteRequest): Observable<Contribuyente> {
    return this.http.post<Contribuyente>(this.apiUrl, data);
  }

  update(id: number, data: UpdateContribuyenteRequest): Observable<Contribuyente> {
    return this.http.patch<Contribuyente>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<Contribuyente> {
    return this.http.delete<Contribuyente>(`${this.apiUrl}/${id}`);
  }
}
