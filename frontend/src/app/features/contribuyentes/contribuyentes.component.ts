import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ContribuyentesService, Contribuyente } from '../../core/services/contribuyentes.service';
import { ContribuyenteFormDialogComponent } from './contribuyente-form-dialog/contribuyente-form-dialog.component';

@Component({
  selector: 'app-contribuyentes',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    NgFor,
  ],
  templateUrl: './contribuyentes.component.html',
  styleUrl: './contribuyentes.component.scss',
})
export class ContribuyentesComponent implements OnInit {
  contribuyentes = signal<Contribuyente[]>([]);
  search = '';
  displayedColumns = ['cuit', 'apellido', 'nombre', 'domicilio', 'activo', 'acciones'];

  constructor(
    private readonly contribuyentesService: ContribuyentesService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.contribuyentesService.findAll(this.search).subscribe((data) => {
      this.contribuyentes.set(data);
    });
  }

  openDialog(contribuyente?: Contribuyente) {
    const dialogRef = this.dialog.open(ContribuyenteFormDialogComponent, {
      width: '500px',
      data: contribuyente,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  remove(id: number) {
    if (!confirm('¿Está seguro de eliminar el contribuyente?')) return;
    this.contribuyentesService.remove(id).subscribe(() => this.load());
  }
}
