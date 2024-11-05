import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { RendimentoService } from './../../services/rendimento.service';

@Component({
  selector: 'app-rendimento-form',
  templateUrl: './rendimento-form.component.html',
  styleUrls: ['./rendimento-form.component.css'],
})
export class RendimentoFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private rendimentoService: RendimentoService
  ) {}
  rendimentoForm!: FormGroup;

  ngOnInit() {
    this.rendimentoForm = this.fb.group({
      rendimento: ['', Validators.required],
      valor: [
        null,
        [Validators.required, Validators.pattern(/^\d+(.\d{1,2})?$/)],
      ],
      data: ['', Validators.required],
    });
  }

  submit() {
    if (this.rendimentoForm.valid) {
      const rendimento = {
        rendimento: this.rendimentoForm.value.rendimento,
        valor: this.rendimentoForm.value.valor,
        data: this.rendimentoForm.value.data,
      };

      this.rendimentoService
        .addRendimento(rendimento)
        .pipe(
          catchError((error) => {
            console.error('Erro ao cadastrar rendimento:', error);
            return of(undefined); // Retorna um Observable vazio em caso de erro
          })
        )
        .subscribe({
          next: () => {
            alert('Rendimento cadastrado com sucesso!');
            this.rendimentoForm.reset();
            this.clearAndUpdateValidation();
          },
          error: (error) => {
            console.error('Erro ao cadastrar rendimento:', error);
          },
        });
    } else {
      console.error('Formulário inválido. Verifique os campos.');
    }
  }

  private clearAndUpdateValidation() {
    this.rendimentoForm.get('rendimento')?.setValidators([Validators.required]);
    this.rendimentoForm
      .get('valor')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(.\d{1,2})?$/),
      ]);
    this.rendimentoForm.get('data')?.setValidators([Validators.required]);
    this.rendimentoForm.get('rendimento')?.updateValueAndValidity();
    this.rendimentoForm.get('valor')?.updateValueAndValidity();
    this.rendimentoForm.get('data')?.updateValueAndValidity();
  }
}
