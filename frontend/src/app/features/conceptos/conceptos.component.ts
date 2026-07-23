import { Component, OnInit, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { ConceptosService, Concepto } from '../../core/services/conceptos.service';

@Component({
  selector: 'app-conceptos',
  imports: [NgFor],
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.scss',
})
export class ConceptosComponent implements OnInit {
  conceptos = signal<Concepto[]>([]);

  constructor(private readonly service: ConceptosService) {}

  ngOnInit() {
    this.service.findAll().subscribe({
      next: (d) => this.conceptos.set(d),
      error: (err) => console.error('Error al cargar conceptos:', err),
    });
  }
}
