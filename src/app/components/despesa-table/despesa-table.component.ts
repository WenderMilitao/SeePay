import { Component, ViewChild } from '@angular/core';
import { Despesa } from './../../models/despesa';
import { DespesaService } from './../../services/despesa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';


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
  ) {
    this.despesaService.getAllDespesas().subscribe((res) => {
      this.despesasList = res;
      this.dataSource = new MatTableDataSource<Despesa>(this.despesasList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  abrirModal() {
    this.modal.open(ModalComponent, {
      width: '60%',
      height: '400px'
    })
  }
}
