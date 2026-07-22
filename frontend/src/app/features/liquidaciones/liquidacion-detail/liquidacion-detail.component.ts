import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf, DatePipe, DecimalPipe } from '@angular/common';
import {
  LiquidacionesService,
  PagosService,
  Liquidacion,
  Pago,
} from '../../../core/services/liquidaciones.service';

@Component({
  selector: 'app-liquidacion-detail',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    NgIf,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './liquidacion-detail.component.html',
  styleUrl: './liquidacion-detail.component.scss',
})
export class LiquidacionDetailComponent implements OnInit {
  liquidacion: Liquidacion | null = null;
  pagoForm: FormGroup;
  displayedDetalles = ['codigo', 'descripcion', 'cantidad', 'base', 'monto'];
  displayedPagos = ['fecha', 'monto', 'medio', 'acciones'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly liquidacionesService: LiquidacionesService,
    private readonly pagosService: PagosService,
  ) {
    this.pagoForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      medio_pago: ['efectivo', Validators.required],
      observaciones: [''],
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.liquidacionesService.findOne(id).subscribe((data) => {
      this.liquidacion = data;
      this.pagoForm.patchValue({
        monto: this.saldoPendiente(),
      });
    });
  }

  saldoPendiente(): number {
    if (!this.liquidacion) return 0;
    const totalPagado = (this.liquidacion.pagos || []).reduce((sum, p) => sum + Number(p.monto), 0);
    return Number((Number(this.liquidacion.total) - totalPagado).toFixed(2));
  }

  downloadPdf() {
    if (this.liquidacion) {
      this.liquidacionesService.downloadPdf(this.liquidacion.id);
    }
  }

  anular() {
    if (!this.liquidacion) return;
    if (!confirm('¿Está seguro de anular la liquidación?')) return;
    this.liquidacionesService.update(this.liquidacion.id, { estado: 'anulada' }).subscribe(() => this.load());
  }

  registrarPago() {
    if (!this.liquidacion || this.pagoForm.invalid) return;
    const data = {
      liquidacion_id: this.liquidacion.id,
      ...this.pagoForm.value,
      monto: Number(this.pagoForm.value.monto),
    };
    this.pagosService.create(data).subscribe({
      next: () => {
        this.pagoForm.reset({ medio_pago: 'efectivo' });
        this.load();
      },
      error: (err) => alert(err.error?.message || 'Error al registrar el pago'),
    });
  }

  eliminarPago(id: number) {
    if (!confirm('¿Está seguro de eliminar el pago?')) return;
    this.pagosService.remove(id).subscribe(() => this.load());
  }

  volver() {
    this.router.navigate(['/liquidaciones']);
  }
}
