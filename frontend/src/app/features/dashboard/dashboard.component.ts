import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgFor, DecimalPipe } from '@angular/common';
import { LiquidacionesService, Liquidacion } from '../../core/services/liquidaciones.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, NgFor, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  liquidaciones = signal<Liquidacion[]>([]);
  pendientes = signal(0);
  vencidas = signal(0);
  pagadas = signal(0);
  anuladas = signal(0);
  totalPendiente = signal(0);

  constructor(private readonly liquidacionesService: LiquidacionesService) {}

  ngOnInit() {
    this.liquidacionesService.findAll().subscribe((data) => {
      this.liquidaciones.set(data);
      this.pendientes.set(data.filter((l) => l.estado === 'pendiente').length);
      this.vencidas.set(data.filter((l) => l.estado === 'vencida').length);
      this.pagadas.set(data.filter((l) => l.estado === 'pagada').length);
      this.anuladas.set(data.filter((l) => l.estado === 'anulada').length);
      this.totalPendiente.set(
        data
          .filter((l) => l.estado === 'pendiente' || l.estado === 'vencida')
          .reduce((sum, l) => sum + Number(l.total), 0),
      );
    });
  }
}
