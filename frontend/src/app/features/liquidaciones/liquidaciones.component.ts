import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { LiquidacionesService, Liquidacion } from '../../core/services/liquidaciones.service';

@Component({
  selector: 'app-liquidaciones',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, NgIf, DatePipe, DecimalPipe],
  templateUrl: './liquidaciones.component.html',
  styleUrl: './liquidaciones.component.scss',
})
export class LiquidacionesComponent implements OnInit {
  liquidaciones = signal<Liquidacion[]>([]);
  displayedColumns = ['numero', 'contribuyente', 'evento', 'vencimiento', 'total', 'estado', 'acciones'];

  constructor(private readonly liquidacionesService: LiquidacionesService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.liquidacionesService.findAll().subscribe((data) => this.liquidaciones.set(data));
  }

  downloadPdf(id: number) {
    this.liquidacionesService.downloadPdf(id);
  }

  anular(id: number) {
    if (!confirm('¿Está seguro de anular la liquidación?')) return;
    this.liquidacionesService.update(id, { estado: 'anulada' }).subscribe(() => this.load());
  }

  marcarVencidas() {
    this.liquidacionesService.marcarVencidas().subscribe((result) => {
      alert(`${result.afectadas} liquidaciones marcadas como vencidas`);
      this.load();
    });
  }

  remove(id: number) {
    if (!confirm('¿Está seguro de eliminar la liquidación?')) return;
    this.liquidacionesService.remove(id).subscribe({
      next: () => this.load(),
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
    });
  }

  getEstadoClass(estado: string): string {
    return 'estado-' + estado;
  }
}
