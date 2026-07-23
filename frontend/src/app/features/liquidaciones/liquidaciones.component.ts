import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { LiquidacionesService, Liquidacion } from '../../core/services/liquidaciones.service';

@Component({
  selector: 'app-liquidaciones',
  imports: [RouterLink, NgFor, NgIf, DatePipe, DecimalPipe],
  templateUrl: './liquidaciones.component.html',
  styleUrl: './liquidaciones.component.scss',
})
export class LiquidacionesComponent implements OnInit {
  liquidaciones = signal<Liquidacion[]>([]);

  constructor(private readonly service: LiquidacionesService) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.findAll().subscribe((d) => this.liquidaciones.set(d));
  }

  downloadPdf(id: number) {
    this.service.downloadPdf(id);
  }

  anular(id: number) {
    if (!confirm('Anular liquidacion?')) return;
    this.service.update(id, { estado: 'anulada' }).subscribe(() => this.load());
  }

  remove(id: number) {
    if (!confirm('Eliminar liquidacion?')) return;
    this.service.remove(id).subscribe({
      next: () => this.load(),
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
    });
  }
}
