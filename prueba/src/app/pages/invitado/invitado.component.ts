import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AccesoService } from '../../services/acceso.service';
import { AuthorsData } from '../../interface/ResponseAuthor';
import { TitleData } from '../../interface/ResponseTittle';
import { Fragmento } from '../../interface/ResponseFragment';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitado',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatPaginator, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './invitado.component.html',
  styleUrls: ['./invitado.component.css']
})
export class InvitadoComponent implements AfterViewInit, OnInit {
  private accesoService = inject(AccesoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public listadeAutores: AuthorsData | undefined;
  public userRole: string | undefined;

  public dataSource = new MatTableDataSource<string>();
  public titlesDataSource = new MatTableDataSource<TitleData>();
  public fragmentoDataSource = new MatTableDataSource<Fragmento>();
  public favoritesDataSource = new MatTableDataSource<string>();

  public displayedColumns: string[] = ['Authors', 'Actions'];
  public displayedTitleColumns: string[] = ['Title'];
  public displayedFragmentsColumns: string[] = ['Title', 'Author', 'Lines', 'LineCount'];
  public displayedFavoritesColumns: string[] = ['Favorite'];

  public isLoadingAuthors = true;
  public isLoadingTitles = false;
  public isLoadingFragments = false;
  public isLoadingFavorites = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('titlePaginator') titlePaginator!: MatPaginator;
  @ViewChild('fragmentPaginator') fragmentPaginator!: MatPaginator;

  constructor() {
    this.accesoService.listar().subscribe({
      next: (data) => {
        if (data.authors.length > 0) {
          this.listadeAutores = data;
          this.dataSource.data = data.authors;
          this.isLoadingAuthors = false;
        }
      },
      error: () => {
        this.isLoadingAuthors = false;
      }
    });
  }

  ngOnInit() {
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.titlesDataSource.paginator = this.titlePaginator;
    this.fragmentoDataSource.paginator = this.fragmentPaginator;
  }

  addToFavorites(author: string): void {
    if (this.userRole !== 'admin') return; // Solo admins pueden agregar favoritos

    const currentFavorites = this.favoritesDataSource.data;
    if (!currentFavorites.includes(author)) {
      this.favoritesDataSource.data = [...currentFavorites, author];
      this.dataSource.data = this.dataSource.data.filter(a => a !== author);
    }
  }

  onAuthorClick(author: string): void {
    this.isLoadingTitles = true;
    this.accesoService.listarporAutor(author).subscribe({
      next: (data) => {
        this.titlesDataSource.data = data;
        this.isLoadingTitles = false;
      },
      error: () => {
        this.isLoadingTitles = false;
      }
    });
  }

  onTitleClick(title: string): void {
    this.isLoadingFragments = true;
    this.accesoService.listarFragmento(title).subscribe({
      next: (data) => {
        this.fragmentoDataSource.data = data;
        this.isLoadingFragments = false;
      },
      error: () => {
        this.isLoadingFragments = false;
      }
    });
  }
}
