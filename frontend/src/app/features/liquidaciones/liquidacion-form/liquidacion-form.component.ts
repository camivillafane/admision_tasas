import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ContribuyentesService, Contribuyente } from '../../../core/services/contribuyentes.service';
import { ConceptosService, Concepto } from '../../../core/services/conceptos.service';
import { LiquidacionesService } from '../../../core/services/liquidaciones.service';

@Component({
  selector: 'app-liquidacion-form',
  imports: [ReactiveFormsModule, NgFor, NgIf, DecimalPipe],
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

      if (montoManual !== '' && montoManual != null) {
        sum += Number(montoManual);
      } else if (concepto) {
        if (concepto.es_porcentaje && base != null && base !== '') {
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
    const venc = new Date();
    venc.setDate(hoy.getDate() + 15);

    this.form = this.fb.group({
      contribuyente_id: ['', Validators.required],
      tipo_evento: ['', Validators.required],
      fecha_evento: [this.formatDate(hoy), Validators.required],
      fecha_vencimiento: [this.formatDate(venc), Validators.required],
      detalles: this.fb.array([], Validators.required),
    });
  }

  get detalles() { return this.form.get('detalles') as FormArray; }

  ngOnInit() {
    this.contribuyentesService.findAll().subscribe((d) => this.contribuyentes.set(d));
    this.conceptosService.findAll().subscribe((d) => this.conceptos.set(d));
    this.addDetalle();
  }

  addDetalle() {
    this.detalles.push(this.fb.group({
      concepto_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.01)]],
      base_imponible: [null],
      monto: [null],
    }));
  }

  removeDetalle(i: number) {
    this.detalles.removeAt(i);
    if (this.detalles.length === 0) this.addDetalle();
  }

  getConcepto(id: number): Concepto | undefined {
    return this.conceptos().find((c) => c.id === Number(id));
  }

  save() {
    if (this.form.invalid || this.detalles.length === 0) return;
    const raw = this.form.value;
    const detalles = raw.detalles.map((d: any) => ({
      concepto_id: Number(d.concepto_id),
      cantidad: Number(d.cantidad),
      base_imponible: d.base_imponible ? Number(d.base_imponible) : undefined,
      monto: d.monto != null && d.monto !== '' ? Number(d.monto) : undefined,
    }));

    this.loading = true;
    this.liquidacionesService.create({
      contribuyente_id: Number(raw.contribuyente_id),
      tipo_evento: raw.tipo_evento,
      fecha_evento: raw.fecha_evento,
      fecha_vencimiento: raw.fecha_vencimiento,
      detalles,
    }).subscribe({
      next: () => this.router.navigate(['/liquidaciones']),
      error: (err) => { this.loading = false; alert(err.error?.message || 'Error'); },
    });
  }

  private formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
