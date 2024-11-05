import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { RendimentoService } from './../../services/rendimento.service';

@Component({
  selector: 'app-rendimentos',
  templateUrl: './rendimentos.component.html',
  styleUrls: ['./rendimentos.component.css'],
})
export class RendimentosComponent {
  private breakpointObserver = inject(BreakpointObserver);
  valorTotal: number = 0;
  constructor(private rendimentoService: RendimentoService) {
    this.rendimentoService.calcularValorTotal().subscribe({
      next: (total) => {
        console.log('Total calculado:', total);
        this.valorTotal = total;
      },
      error: (err) => {
        console.error('Erro ao calcular total:', err);
      },
    });
  }
  // Observável que fornece o layout dinâmico com base no tamanho da tela
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        // Layout para telas de mão (Handset)
        return {
          columns: 2,
          chart: { cols: 1, rows: 2 },
          table: { cols: 1, rows: 2 },
        };
      } else {
        // Layout para telas maiores (desktop)
        return {
          columns: 2,
          chart: { cols: 1, rows: 2 },
          table: { cols: 2, rows: 2 },
        };
      }
    })
  );
}
