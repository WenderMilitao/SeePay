import { Component, ViewChild } from '@angular/core';
import { Rendimento } from './../../models/rendimento';
import { RendimentoService } from './../../services/rendimento.service';
import { EditarRendimentosComponent } from './../editar-rendimentos/editar-rendimentos.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rendimento-table',
  templateUrl: './rendimento-table.component.html',
  styleUrls: ['./rendimento-table.component.css'],
})
export class RendimentoTableComponent {
  rendimentosList!: Rendimento[];
  dataSource: any;
  displayedColumns: string[] = ['rendimento', 'valor', 'data', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private rendimentoService: RendimentoService,
    private snackBar: MatSnackBar
  ) {
    this.rendimentoService.getAllRendimentos().subscribe((res) => {
      this.rendimentosList = res;
      this.dataSource = new MatTableDataSource<Rendimento>(
        this.rendimentosList
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.loadRendimentos();
  }
  loadRendimentos() {
    this.rendimentoService.getAllRendimentos().subscribe((data) => {
      this.dataSource = data;
    });
  }
  abrirModal(rendimento: Rendimento) {
    const dialogRef = this.dialog.open(EditarRendimentosComponent, {
      data: rendimento, // Passando o rendimento para o modal
      width: '45%',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRendimentos(); // Recarrega a lista após edição
      }
    });
  }
  deleteRendimento(rendimentoId: string) {
    if (confirm('Você tem certeza que deseja excluir este rendimento?')) {
      this.rendimentoService.deleteRendimento(rendimentoId).subscribe(
        () => {
          this.loadRendimentos(); // Recarrega a lista de rendimentos
          this.snackBar.open('Rendimento excluído com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        (error) => {
          console.error('Erro ao excluir rendimento: ', error);
          this.snackBar.open('Erro ao excluir rendimento.', 'Fechar', {
            duration: 2000,
          });
        }
      );
    }
  }
}
