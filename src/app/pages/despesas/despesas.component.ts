import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { DespesaService } from 'src/app/services/despesa.service';
import { RendimentoService } from './../../services/rendimento.service';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css'],
})
export class DespesasComponent {
  private breakpointObserver = inject(BreakpointObserver);
  valorTotalRendimentos: number = 0;
  valorTotalDespesas: number = 0;
  saldo: number = 0;

  constructor(
    private rendimentoService: RendimentoService,
    private despesaService: DespesaService
  ) {
    // Calculando o valor total das despesas
    this.despesaService.calcularValorTotal().subscribe({
      next: (total) => {
        console.log('Total de despesas calculado:', total);
        this.valorTotalDespesas = total;
        this.calcularSaldo(); // Recalcula o saldo após calcular as despesas
      },
      error: (err) => {
        console.error('Erro ao calcular despesas:', err);
      },
    });

    // Calculando o valor total dos rendimentos
    this.rendimentoService.calcularValorTotal().subscribe({
      next: (total) => {
        console.log('Total de rendimentos calculado:', total);
        this.valorTotalRendimentos = total;
        this.calcularSaldo(); // Recalcula o saldo após calcular os rendimentos
      },
      error: (err) => {
        console.error('Erro ao calcular rendimentos:', err);
      },
    });
  }

  // Função para calcular o saldo (rendimentos - despesas)
  calcularSaldo(): void {
    this.saldo = this.valorTotalRendimentos - this.valorTotalDespesas;
  }

  // Layout dinâmico para responsividade
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 2,
          chart: { cols: 1, rows: 2 },
          table: { cols: 1, rows: 2 },
        };
      } else {
        return {
          columns: 2,
          chart: { cols: 1, rows: 2 },
          table: { cols: 2, rows: 2 },
        };
      }
    })
  );
}
