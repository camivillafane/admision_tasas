import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContribuyentesService, Contribuyente } from '../../../core/services/contribuyentes.service';

@Component({
  selector: 'app-contribuyente-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
  templateUrl: './contribuyente-form-dialog.component.html',
})
export class ContribuyenteFormDialogComponent {
  form: FormGroup;
  isEdit = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly contribuyentesService: ContribuyentesService,
    private readonly dialogRef: MatDialogRef<ContribuyenteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Contribuyente,
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      cuit: [data?.cuit || '', Validators.required],
      apellido: [data?.apellido || '', Validators.required],
      nombre: [data?.nombre || '', Validators.required],
      domicilio: [data?.domicilio || ''],
      activo: [data?.activo ?? true],
    });
  }

  save() {
    if (this.form.invalid) return;

    const request = this.isEdit
      ? this.contribuyentesService.update(this.data!.id, this.form.value)
      : this.contribuyentesService.create(this.form.value);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => alert(err.error?.message || 'Error al guardar'),
    });
  }
}
