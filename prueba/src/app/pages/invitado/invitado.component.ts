import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

import { AccesoService } from '../../services/acceso.service';
import { AuthorsData } from '../../interface/ResponseAuthor';


@Component({
  selector: 'app-invitado',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatPaginatorModule, MatInputModule],
  templateUrl: './invitado.component.html',
  styleUrl: './invitado.component.css'
})
export class InvitadoComponent implements AfterViewInit{
  private accesoService = inject(AccesoService);
  public listadeAutores: AuthorsData | undefined;

  public dataSource = new MatTableDataSource<string>();

  public displayedColumns:string[]=['Authors'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(){
    this.accesoService.listar().subscribe({
      next:(data)=> {
        if (data.authors.length>0) {
          this.listadeAutores=data;
          this.dataSource.data = data.authors;
        }
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /*
  applyFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    this.
  }*/

}
