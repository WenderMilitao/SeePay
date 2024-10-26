import { Component, ViewChild } from '@angular/core';
import { Despesa } from './../../models/despesa';
import { DespesaService } from './../../services/despesa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-despesa-table',
  templateUrl: './despesa-table.component.html',
  styleUrls: ['./despesa-table.component.css'],
})
export class DespesaTableComponent {
  despesasList!: Despesa[];
  dataSource: any;
  displayedColumns: string[] = ['despesa', 'valor', 'data', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modal: MatDialog,
    private despesaService: DespesaService,
    private snackBar: MatSnackBar
  ) {
    this.despesaService.getAllDespesas().subscribe((res) => {
      this.despesasList = res;
      this.dataSource = new MatTableDataSource<Despesa>(this.despesasList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.loadDespesas ()
  }
  abrirModal() {
    this.modal.open(ModalComponent, {
      width: '60%',
      height: '400px'
    })
  }
  loadDespesas() {
    this.despesaService.getAllDespesas().subscribe((data) => {
      this.dataSource = data;
    });
  }
  deleteDespesa(despesaId: string) {
    if (confirm('Você tem certeza que deseja excluir esta despesa?')) {
      this.despesaService.deleteDespesa(despesaId).subscribe(
        () => {
          this.loadDespesas(); // Recarrega a lista de despesas
          this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
            duration: 2000,
          });
        },
        (error) => {
          console.error('Erro ao excluir despesa: ', error);
          this.snackBar.open('Erro ao excluir despesa.', 'Fechar', {
            duration: 2000,
          });
        }
      );
    }
  }
}
