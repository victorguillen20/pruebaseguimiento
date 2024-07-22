import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

import { AccesoService } from '../../services/acceso.service';
import { AuthorsData } from '../../interface/ResponseAuthor';
import { TitleData } from '../../interface/ResponseTittle';
import { Fragmento } from '../../interface/ResponseFragment';


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
  public titlesDataSource = new MatTableDataSource<TitleData>();
  public fragmentoDataSource = new MatTableDataSource<Fragmento>();

  public displayedColumns:string[]=['Authors'];
  public displayedTitleColumns:string[]=['Title'];
  public displayedFragmentsColumns:string[]=['Title', 'Author', 'Lines', 'LineCount'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('titlePaginator') titlePaginator!: MatPaginator;
  @ViewChild('fragmentPaginator') fragmentPaginator!: MatPaginator;

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
    this.titlesDataSource.paginator = this.titlePaginator;
    this.fragmentoDataSource.paginator = this.fragmentPaginator;
  }

  onAuthorClick(author: string): void {
    this.accesoService.listarporAutor(author).subscribe({
      next: (data) => {
        this.titlesDataSource.data = data;
      }
    });
  }
  onTitleClick(title: string): void {
    this.accesoService.listarFragmento(title).subscribe({
      next: (data) => {
        this.fragmentoDataSource.data = data;
      }
    });
  }
}
