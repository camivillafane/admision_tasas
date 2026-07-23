import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContribuyentesService, Contribuyente } from '../../../core/services/contribuyentes.service';

@Component({
  selector: 'app-contribuyente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contribuyente-form.component.html',
})
export class ContribuyenteFormComponent {
  @Input() contribuyente?: Contribuyente;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly service: ContribuyentesService) {
    this.form = this.fb.group({
      cuit: ['', Validators.required],
      apellido: ['', Validators.required],
      nombre: ['', Validators.required],
      domicilio: [''],
      activo: [true],
    });
  }

  ngOnInit() {
    if (this.contribuyente) {
      this.form.patchValue(this.contribuyente);
    }
  }

  save() {
    if (this.form.invalid) return;
    const req = this.contribuyente
      ? this.service.update(this.contribuyente.id, this.form.value)
      : this.service.create(this.form.value);

    req.subscribe({
      next: () => this.saved.emit(),
      error: (err) => alert(err.error?.message || 'Error al guardar'),
    });
  }
}
