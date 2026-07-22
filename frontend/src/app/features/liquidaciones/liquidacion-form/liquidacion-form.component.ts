import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ContribuyentesService, Contribuyente } from '../../../core/services/contribuyentes.service';
import { ConceptosService, Concepto } from '../../../core/services/conceptos.service';
import { LiquidacionesService } from '../../../core/services/liquidaciones.service';

@Component({
  selector: 'app-liquidacion-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    NgFor,
    NgIf,
    DecimalPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './liquidacion-form.component.html',
  styleUrl: './liquidacion-form.component.scss',
})
export class LiquidacionFormComponent implements OnInit {
  form: FormGroup;
  contribuyentes = signal<Contribuyente[]>([]);
  conceptos = signal<Concepto[]>([]);
  loading = false;

  total = computed(() => {
    let sum = 0;
    for (const detalle of this.detalles.controls) {
      const conceptoId = detalle.get('concepto_id')?.value;
      const concepto = this.conceptos().find((c) => c.id === Number(conceptoId));
      const cantidad = Number(detalle.get('cantidad')?.value || 1);
      const base = detalle.get('base_imponible')?.value;
      const montoManual = detalle.get('monto')?.value;

      if (montoManual !== '' && montoManual !== null && montoManual !== undefined) {
        sum += Number(montoManual);
      } else if (concepto) {
        if (concepto.es_porcentaje && base !== '' && base !== null && base !== undefined) {
          let monto = Number(base) * (Number(concepto.valor) / 100);
          if (concepto.tipo === 'exencion') monto = -monto;
          sum += monto;
        } else {
          let monto = Number(concepto.valor) * cantidad;
          if (concepto.tipo === 'exencion') monto = -monto;
          sum += monto;
        }
      }
    }
    return Number(sum.toFixed(2));
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly contribuyentesService: ContribuyentesService,
    private readonly conceptosService: ConceptosService,
    private readonly liquidacionesService: LiquidacionesService,
    private readonly router: Router,
  ) {
    const hoy = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(hoy.getDate() + 15);

    this.form = this.fb.group({
      contribuyente_id: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      fecha_evento: [hoy, Validators.required],
      fecha_vencimiento: [vencimiento, Validators.required],
      detalles: this.fb.array([], Validators.required),
    });
  }

  get detalles() {
    return this.form.get('detalles') as FormArray;
  }

  ngOnInit() {
    this.contribuyentesService.findAll().subscribe((data) => this.contribuyentes.set(data));
    this.conceptosService.findAll().subscribe((data) => this.conceptos.set(data));
    this.addDetalle();
  }

  addDetalle() {
    const detalle = this.fb.group({
      concepto_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.01)]],
      base_imponible: [null],
      monto: [null],
    });
    this.detalles.push(detalle);
  }

  removeDetalle(index: number) {
    this.detalles.removeAt(index);
    if (this.detalles.length === 0) this.addDetalle();
  }

  getConcepto(id: number): Concepto | undefined {
    return this.conceptos().find((c) => c.id === Number(id));
  }

  save() {
    if (this.form.invalid) return;
    if (this.detalles.length === 0) {
      alert('Debe agregar al menos un detalle');
      return;
    }

    const raw = this.form.value;
    const detalles = raw.detalles.map((d: any) => ({
      concepto_id: Number(d.concepto_id),
      cantidad: Number(d.cantidad),
      base_imponible: d.base_imponible ? Number(d.base_imponible) : undefined,
      monto: d.monto !== null && d.monto !== '' ? Number(d.monto) : undefined,
    }));

    const request = {
      contribuyente_id: Number(raw.contribuyente_id),
      tipo_evento: raw.tipo_evento,
      fecha_evento: this.formatDate(raw.fecha_evento),
      fecha_vencimiento: this.formatDate(raw.fecha_vencimiento),
      detalles,
    };

    this.loading = true;
    this.liquidacionesService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/liquidaciones']);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al crear la liquidación');
      },
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
