import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { ConceptosService, Concepto } from '../../../core/services/conceptos.service';

@Component({
  selector: 'app-concepto-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    NgIf,
  ],
  templateUrl: './concepto-form-dialog.component.html',
})
export class ConceptoFormDialogComponent {
  form: FormGroup;
  isEdit = false;
  tipos = ['tasa', 'recargo', 'exencion'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly conceptosService: ConceptosService,
    private readonly dialogRef: MatDialogRef<ConceptoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Concepto,
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      codigo: [data?.codigo || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      tipo: [data?.tipo || 'tasa', Validators.required],
      es_porcentaje: [data?.es_porcentaje ?? false],
      valor: [data?.valor ?? 0, [Validators.required, Validators.min(0)]],
      activo: [data?.activo ?? true],
    });
  }

  save() {
    if (this.form.invalid) return;

    const request = this.isEdit
      ? this.conceptosService.update(this.data!.id, this.form.value)
      : this.conceptosService.create(this.form.value);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => alert(err.error?.message || 'Error al guardar'),
    });
  }
}
