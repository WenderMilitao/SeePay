import { DespesaService } from './../../services/despesa.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-despesa-form',
  templateUrl: './despesa-form.component.html',
  styleUrls: ['./despesa-form.component.css']
})

export class DespesaFormComponent implements OnInit {
  constructor (private fb: FormBuilder, private despesaService: DespesaService){}
  despesaForm!: FormGroup;
  ngOnInit() {
    this.despesaForm = this.fb.group({
      despesa: ['', Validators.required],
      valor: [
        null,
        [Validators.required, Validators.pattern(/^\d+(.\d{1,2})?$/)],
      ],
      data: ['', Validators.required],
    });
  }



  submit() {
    if (this.despesaForm.valid) {
      const despesa = {
        despesa: this.despesaForm.value.despesa,
        valor: this.despesaForm.value.valor,
        data: this.despesaForm.value.data,
      };

      this.despesaService
        .addDespesa(despesa)
        .pipe(
          catchError((error) => {
            console.error('Erro ao cadastrar despesa:', error);
            return of(undefined); // Retorna um Observable vazio em caso de erro
          })
        )
        .subscribe({
          next: () => {
            alert('Despesa cadastrada com sucesso!');
            this.despesaForm.reset();
            this.clearAndUpdateValidation();
          },
          error: (error) => {
            console.error('Erro ao cadastrar despesa:', error);
          },
        });
    } else {
      console.error('Formulário inválido. Verifique os campos.');
    }
  }

  private clearAndUpdateValidation() {
    this.despesaForm.get('despesa')?.setValidators([Validators.required]);
    this.despesaForm
      .get('valor')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(.\d{1,2})?$/),
      ]);
    this.despesaForm.get('data')?.setValidators([Validators.required]);
    this.despesaForm.get('despesa')?.updateValueAndValidity();
    this.despesaForm.get('valor')?.updateValueAndValidity();
    this.despesaForm.get('data')?.updateValueAndValidity();
  }
}
