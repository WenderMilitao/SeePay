import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RendimentoService } from './../../services/rendimento.service';
import { Rendimento } from './../../models/rendimento';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-rendimentos',
  templateUrl: './editar-rendimentos.component.html',
  styleUrls: ['./editar-rendimentos.component.css'],
})
export class EditarRendimentosComponent implements OnInit {
  rendimentoForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditarRendimentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rendimento,
    private rendimentoService: RendimentoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.rendimentoForm = this.fb.group({
      rendimento: [this.data.rendimento, Validators.required],
      valor: [
        this.data.valor,
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]{1,2})?$')],
      ],
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.rendimentoForm.valid) {
      const updatedRendimento: Rendimento = {
        ...this.data,
        ...this.rendimentoForm.value,
      };
      this.rendimentoService.updateRendimento(updatedRendimento).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Rendimento editado com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        error: (err) => {
          this.snackBar.open(
            'Erro ao editar rendimento ' + err.message,
            'Fechar',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
