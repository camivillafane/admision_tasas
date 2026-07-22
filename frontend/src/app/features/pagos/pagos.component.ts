import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PagosService, Pago } from '../../core/services/liquidaciones.service';

@Component({
  selector: 'app-pagos',
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, DatePipe, DecimalPipe],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent implements OnInit {
  pagos = signal<Pago[]>([]);
  displayedColumns = ['id', 'liquidacion', 'contribuyente', 'fecha', 'monto', 'medio', 'acciones'];

  constructor(private readonly pagosService: PagosService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.pagosService.findAll().subscribe((data) => this.pagos.set(data));
  }

  remove(id: number) {
    if (!confirm('¿Está seguro de eliminar el pago?')) return;
    this.pagosService.remove(id).subscribe(() => this.load());
  }
}
