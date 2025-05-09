import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DespesaService } from './../../services/despesa.service';
import { Despesa } from './../../models/despesa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-despesas',
  templateUrl: './editar-despesas.component.html',
  styleUrls: ['./editar-despesas.component.css']
})

export class EditarDespesasComponent implements OnInit {
  despesaForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditarDespesasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Despesa,
    private despesaService: DespesaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.despesaForm = this.fb.group({
      despesa: [this.data.despesa, Validators.required],
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
    if (this.despesaForm.valid) {
      const updatedDespesa: Despesa = {
        ...this.data,
        ...this.despesaForm.value,
      };
      this.despesaService.updateDespesa(updatedDespesa).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Despesa editada com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        error: (err) => {
          this.snackBar.open(
            'Erro ao editar despesa: ' + err.message,
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
