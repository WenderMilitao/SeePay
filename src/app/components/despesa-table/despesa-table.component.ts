import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DespesaService } from './../../services/despesa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Despesa } from './../../models/despesa';
import { EditarDespesasComponent } from '../editar-despesas/editar-despesas.component';

@Component({
  selector: 'app-despesa-table',
  templateUrl: './despesa-table.component.html',
  styleUrls: ['./despesa-table.component.css'],
})
export class DespesaTableComponent implements AfterViewInit {
  despesasList!: Despesa[];
  dataSource: MatTableDataSource<Despesa> = new MatTableDataSource();
  displayedColumns: string[] = ['despesa', 'valor', 'data', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private despesaService: DespesaService,
    private snackBar: MatSnackBar
  ) {
    this.despesaService.getAllDespesas().subscribe((res) => {
      this.despesasList = res;
      this.dataSource.data = this.despesasList;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDespesas() {
    this.despesaService.getAllDespesas().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  abrirModal(despesa: Despesa) {
    const dialogRef = this.dialog.open(EditarDespesasComponent, {
      data: despesa,
      width: '45%',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDespesas();
      }
    });
  }

  deleteDespesa(despesaId: string) {
    if (confirm('Você tem certeza que deseja excluir esta despesa?')) {
      this.despesaService.deleteDespesa(despesaId).subscribe(
        () => {
          this.loadDespesas();
          this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Erro ao excluir despesa.', 'Fechar', {
            duration: 2000,
          });
        }
      );
    }
  }
}
