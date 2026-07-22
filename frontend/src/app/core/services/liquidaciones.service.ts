import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contribuyente } from './contribuyentes.service';
import { Concepto } from './conceptos.service';

export interface LiquidacionDetalle {
  id?: number;
  concepto_id: number;
  cantidad: number;
  base_imponible?: number | null;
  monto: number;
  concepto?: Concepto;
}

export interface Liquidacion {
  id: number;
  numero?: string;
  contribuyente_id: number;
  contribuyente?: Contribuyente;
  tipo_evento: string;
  fecha_evento: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
  detalles: LiquidacionDetalle[];
  pagos?: Pago[];
}

export interface Pago {
  id: number;
  liquidacion_id: number;
  fecha_pago: string;
  monto: number;
  medio_pago?: string;
  observaciones?: string;
}

export interface CreateLiquidacionRequest {
  contribuyente_id: number;
  tipo_evento: string;
  fecha_evento: string;
  fecha_vencimiento: string;
  detalles: LiquidacionDetalle[];
}

export interface UpdateLiquidacionRequest {
  tipo_evento?: string;
  fecha_evento?: string;
  fecha_vencimiento?: string;
  estado?: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
  detalles?: LiquidacionDetalle[];
}

@Injectable({ providedIn: 'root' })
export class LiquidacionesService {
  private readonly apiUrl = 'http://localhost:3000/api/liquidaciones';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateLiquidacionRequest): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(this.apiUrl, data);
  }

  update(id: number, data: UpdateLiquidacionRequest): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<Liquidacion> {
    return this.http.delete<Liquidacion>(`${this.apiUrl}/${id}`);
  }

  downloadPdf(id: number): void {
    const url = `${this.apiUrl}/${id}/pdf`;
    window.open(url, '_blank');
  }

  marcarVencidas(): Observable<{ afectadas: number }> {
    return this.http.post<{ afectadas: number }>(`${this.apiUrl}/vencidas`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class PagosService {
  private readonly apiUrl = 'http://localhost:3000/api/pagos';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  create(data: {
    liquidacion_id: number;
    monto: number;
    fecha_pago?: string;
    medio_pago?: string;
    observaciones?: string;
  }): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, data);
  }

  remove(id: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.apiUrl}/${id}`);
  }
}
