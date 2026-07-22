import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Concepto {
  id: number;
  codigo: string;
  descripcion: string;
  tipo: 'tasa' | 'recargo' | 'exencion';
  es_porcentaje: boolean;
  valor: number;
  activo: boolean;
}

export interface CreateConceptoRequest {
  codigo: string;
  descripcion: string;
  tipo: 'tasa' | 'recargo' | 'exencion';
  es_porcentaje?: boolean;
  valor: number;
  activo?: boolean;
}

export type UpdateConceptoRequest = Partial<CreateConceptoRequest>;

@Injectable({ providedIn: 'root' })
export class ConceptosService {
  private readonly apiUrl = 'http://localhost:3000/api/conceptos';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Concepto> {
    return this.http.get<Concepto>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateConceptoRequest): Observable<Concepto> {
    return this.http.post<Concepto>(this.apiUrl, data);
  }

  update(id: number, data: UpdateConceptoRequest): Observable<Concepto> {
    return this.http.patch<Concepto>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<Concepto> {
    return this.http.delete<Concepto>(`${this.apiUrl}/${id}`);
  }
}
