import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApoliceService } from '../../../../core/services/ApoliceService ';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog-component/confirm-dialog-component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoedaUtil } from '../../../util/MoedaUtil';
import { MatButtonModule } from '@angular/material/button';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../util/MyDateFormats';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DateUtil } from '../../../util/DateUtil';

declare var $: any;

@Component({
  selector: 'app-lista-apolice-component',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './lista-apolice-component.html',
  styleUrl: './lista-apolice-component.css',
})
export class ListaApoliceComponent implements OnInit, OnDestroy {
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private service: ApoliceService,
    private router: Router,
    private dialog: MatDialog,
  ) {}
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    // this.configDataTable();
    this.carregarDados();
  }

  filtro = {
    numeroApolice: '',
    dataContratacao: '',
    status: '-1',
  };

  configDataTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5, // Quantidade padrão inicial
      lengthMenu: [3, 5, 10, 25], // As opções que você pediu
      searching: false, // Remove o campo de busca (Search)
      processing: true, // Habilita o indicador de "Loading" nativo

      // Tradução para Português
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json',
      },
    };

    this.dtTrigger.next(null);
  }
  carregarDados() {
  
    console.log('Carregar Dados');
    if (this.filtro.dataContratacao)
      this.filtro.dataContratacao =
        DateUtil.formatarParaApi(new Date(this.filtro.dataContratacao)) ?? '';

    console.log(this.filtro);
    this.service.listarComFiltro(this.filtro).subscribe({
      next: (data) => {
        this.montarTabela(data);
      },
      error: (err) => {
        console.error('Erro ao carregar dados', err);
      },
    });
  }

  montarTabela(data: any[]) {
    if ($.fn.DataTable.isDataTable('#tabelaApolice')) {
      $('#tabelaApolice').DataTable().destroy();
    }

    $('#tabelaApolice').DataTable({
      data: data,
      pagingType: 'full_numbers',
      pageLength: 5, // Quantidade padrão inicial
      lengthMenu: [3, 5, 10, 25], // As opções que você pediu
      searching: false, // Remove o campo de busca (Search)
      processing: true, // Habilita o indicador de "Loading" nativo

      // Tradução para Português
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json',
      },
      columns: [
        { data: 'numeroApolice' },
        {
          data: 'valorCobertura',
          render: (data: any, type: any) => {
            if (type === 'display') {
              return MoedaUtil.formatarMoeda(data);
            }
            return data;
          },
        },
        {
          data: 'premioFinal',
          render: (data: any, type: any) => {
            if (type === 'display') {
              return MoedaUtil.formatarMoeda(data);
            }
            return data;
          },
        },
        {
          data: 'dataContratacao',
          render: (data: any) => {
            return new Date(data).toLocaleDateString('pt-BR');
          },
        },
        { data: 'status' },
        {
          data: null,
          render: (data: any) => {
            return `
              <button class="btn btn-primary edit-btn" data-id="${data.id}">Editar</button>
              <button class="btn btn-danger delete-btn" data-id="${data.id}">Excluir</button>
            `;
          },
        },
      ],
    });

    this.configurarEventos();
  }
  configurarEventos() {
    $('#tabelaApolice').off('click', '.edit-btn');
    $('#tabelaApolice').off('click', '.delete-btn');

    $('#tabelaApolice').on('click', '.edit-btn', (e: any) => {
      const id = $(e.currentTarget).data('id');
      this.router.navigate(['/apolice/editar', id]);
    });

    $('#tabelaApolice').on('click', '.delete-btn', (e: any) => {
      const id = $(e.currentTarget).data('id');
      this.confirmarExclusao(id);
    });
  }

  confirmarExclusao(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.excluir(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  // ➕ novo registro
  novo() {
    this.router.navigate(['/apolice/novo']);
  }

  pesquisar() {
    this.carregarDados();
  }
}
