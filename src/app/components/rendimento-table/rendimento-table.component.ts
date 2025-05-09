import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RendimentoService } from './../../services/rendimento.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rendimento } from './../../models/rendimento';
import { EditarRendimentosComponent } from './../editar-rendimentos/editar-rendimentos.component';

@Component({
  selector: 'app-rendimento-table',
  templateUrl: './rendimento-table.component.html',
  styleUrls: ['./rendimento-table.component.css'],
})
export class RendimentoTableComponent implements AfterViewInit {
  rendimentosList!: Rendimento[];
  dataSource: MatTableDataSource<Rendimento> = new MatTableDataSource();
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
      this.dataSource.data = this.rendimentosList;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRendimentos() {
    this.rendimentoService.getAllRendimentos().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  abrirModal(rendimento: Rendimento) {
    const dialogRef = this.dialog.open(EditarRendimentosComponent, {
      data: rendimento,
      width: '45%',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRendimentos();
      }
    });
  }

  deleteRendimento(rendimentoId: string) {
    if (confirm('Você tem certeza que deseja excluir este rendimento?')) {
      this.rendimentoService.deleteRendimento(rendimentoId).subscribe(
        () => {
          this.loadRendimentos();
          this.snackBar.open('Rendimento excluído com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Erro ao excluir rendimento.', 'Fechar', {
            duration: 2000,
          });
        }
      );
    }
  }
}
