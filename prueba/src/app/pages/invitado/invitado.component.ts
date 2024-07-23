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
  public favoritesTitleDataSource = new MatTableDataSource<TitleData>();

  public displayedColumns: string[] = ['Authors', 'Actions'];
  public displayedTitleColumns: string[] = ['Title', 'Actions'];
  public displayedFragmentsColumns: string[] = ['Title', 'Author', 'Lines', 'LineCount'];
  public displayedFavoritesColumns: string[] = ['Favorite', 'Actions'];
  public displayedFavoritesTitlesColumns: string[] = ['Title', 'Actions'];

  public isLoadingAuthors = true;
  public isLoadingTitles = false;
  public isLoadingFragments = false;
  public isLoadingFavorites = false;

  private authorOriginalPositions = new Map<string, number>();
  private titleOriginalPositions = new Map<string, number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('titlePaginator') titlePaginator!: MatPaginator;
  @ViewChild('fragmentPaginator') fragmentPaginator!: MatPaginator;

  // Indicator properties
  public totalFavorites = 0;
  public totalAuthorsFavorites = 0;
  public totalTitlesFavorites = 0;

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
    this.updateIndicators();
  }


  addToFavorites(author: string): void {
    if (this.userRole !== 'admin') return; // Solo admins pueden agregar favoritos

    const currentFavorites = this.favoritesDataSource.data;
    if (!currentFavorites.includes(author)) {
      this.authorOriginalPositions.set(author, this.dataSource.data.indexOf(author)); // Guardar posición original
      this.favoritesDataSource.data = [...currentFavorites, author];
      this.dataSource.data = this.dataSource.data.filter(a => a !== author);
      this.updateIndicators();
    }
  }

  addToFavoritesTitle(title: string): void {
    if (this.userRole !== 'admin') return;

    const currentFavoritesTitle = this.favoritesTitleDataSource.data as TitleData[];

    // Verifique si el título ya existe (opcional)
    const existingIndex = currentFavoritesTitle.findIndex(t => t.title === title);
    if (existingIndex !== -1) {
      // Elimine el título si ya existe
      this.favoritesTitleDataSource.data.splice(existingIndex, 1);
    } else {
      this.titleOriginalPositions.set(title, this.titlesDataSource.data.findIndex(t => t.title === title)); // Guardar posición original
      // Agregue el título a favoritos si no existe
      this.favoritesTitleDataSource.data = [...currentFavoritesTitle, { title }];
    }
    this.titlesDataSource.data = this.titlesDataSource.data.filter(t => t.title !== title);
    this.updateIndicators();
  }
  // Eliminar un autor favorito y devolverlo a la lista de autores
  removeFromFavorites(author: string): void {
    if (this.userRole !== 'admin') return;

    // Eliminar el autor de la lista de favoritos
    this.favoritesDataSource.data = this.favoritesDataSource.data.filter(fav => fav !== author);

    // Devolver el autor a la lista de autores en su posición original
    const originalPosition = this.authorOriginalPositions.get(author);
    if (originalPosition !== undefined) {
      const updatedData = [...this.dataSource.data];
      updatedData.splice(originalPosition, 0, author);
      this.dataSource.data = updatedData;
      this.authorOriginalPositions.delete(author);
    } else {
      this.dataSource.data = [...this.dataSource.data, author];
    }
    this.updateIndicators();
  }

  // Eliminar un título favorito y devolverlo a la lista de títulos
  removeFromFavoritesTitle(title: string): void {
    if (this.userRole !== 'admin') return;

    const currentFavoritesTitle = this.favoritesTitleDataSource.data as TitleData[];

    // Eliminar el título de la lista de favoritos
    this.favoritesTitleDataSource.data = currentFavoritesTitle.filter(fav => fav.title !== title);

    // Devolver el título a la lista de títulos en su posición original
    const originalPosition = this.titleOriginalPositions.get(title);
    if (originalPosition !== undefined) {
      const updatedData = [...this.titlesDataSource.data];
      updatedData.splice(originalPosition, 0, { title });
      this.titlesDataSource.data = updatedData;
      this.titleOriginalPositions.delete(title);
    } else {
      this.titlesDataSource.data = [...this.titlesDataSource.data, { title }];
    }
    this.updateIndicators();
  }
  updateIndicators(): void {
    this.totalFavorites = this.favoritesDataSource.data.length + this.favoritesTitleDataSource.data.length;
    this.totalAuthorsFavorites = this.favoritesDataSource.data.length;
    this.totalTitlesFavorites = this.favoritesTitleDataSource.data.length;
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
