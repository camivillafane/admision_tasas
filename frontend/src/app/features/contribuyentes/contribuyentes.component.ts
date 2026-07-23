import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContribuyentesService, Contribuyente } from '../../core/services/contribuyentes.service';
import { ContribuyenteFormComponent } from './contribuyente-form/contribuyente-form.component';

@Component({
  selector: 'app-contribuyentes',
  imports: [FormsModule, NgFor, NgIf, ContribuyenteFormComponent],
  templateUrl: './contribuyentes.component.html',
  styleUrl: './contribuyentes.component.scss',
})
export class ContribuyentesComponent implements OnInit {
  contribuyentes = signal<Contribuyente[]>([]);
  search = '';
  showModal = false;
  selected: Contribuyente | undefined = undefined;

  constructor(private readonly service: ContribuyentesService) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.findAll(this.search).subscribe((d) => this.contribuyentes.set(d));
  }

  openNew() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(c: Contribuyente) {
    this.selected = c;
    this.showModal = true;
  }

  onSave() {
    this.showModal = false;
    this.load();
  }

  remove(id: number) {
    if (!confirm('Eliminar contribuyente?')) return;
    this.service.remove(id).subscribe(() => this.load());
  }
}
