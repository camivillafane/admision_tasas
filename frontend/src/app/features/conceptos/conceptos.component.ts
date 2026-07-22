import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { ConceptosService, Concepto } from '../../core/services/conceptos.service';
import { ConceptoFormDialogComponent } from './concepto-form-dialog/concepto-form-dialog.component';

@Component({
  selector: 'app-conceptos',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatDialogModule, NgFor],
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.scss',
})
export class ConceptosComponent implements OnInit {
  conceptos = signal<Concepto[]>([]);
  displayedColumns = ['codigo', 'descripcion', 'tipo', 'es_porcentaje', 'valor', 'activo', 'acciones'];

  constructor(
    private readonly conceptosService: ConceptosService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.conceptosService.findAll().subscribe((data) => this.conceptos.set(data));
  }

  openDialog(concepto?: Concepto) {
    const dialogRef = this.dialog.open(ConceptoFormDialogComponent, {
      width: '500px',
      data: concepto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  remove(id: number) {
    if (!confirm('¿Está seguro de eliminar el concepto?')) return;
    this.conceptosService.remove(id).subscribe({
      next: () => this.load(),
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
    });
  }
}
