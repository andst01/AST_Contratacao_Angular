import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
import { PropostaService } from '../../../../core/services/PropostaService';

declare var $: any;

@Component({
  selector: 'app-lista-proposta-component',
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
  templateUrl: './lista-proposta-component.html',
  styleUrl: './lista-proposta-component.css',
})
export class ListaPropostaComponent implements OnInit, OnDestroy {
  constructor(
    private service: PropostaService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  filtro = {
    numeroProposta: '',
    dataCriacao: '',
    status: '-1',
  };

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnInit(): void {

    this.carregarDados();
  }

  carregarDados() {
    //console.log('Carregar Dados');
    if (this.filtro.dataCriacao)
      this.filtro.dataCriacao = DateUtil.formatarParaApi(new Date(this.filtro.dataCriacao)) ?? '';

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
    if ($.fn.DataTable.isDataTable('#tabelaProposta')) {
      $('#tabelaProposta').DataTable().destroy();
    }

    $('#tabelaProposta').DataTable({
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
        { data: 'numeroProposta' },
        { data: 'nomeCliente' },
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
          data: 'premio',
          render: (data: any, type: any) => {
            if (type === 'display') {
              return MoedaUtil.formatarMoeda(data);
            }
            return data;
          },
        },
        {
          data: 'dataCriacao',
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
    $('#tabelaProposta').off('click', '.edit-btn');
    $('#tabelaProposta').off('click', '.delete-btn');

    $('#tabelaProposta').on('click', '.edit-btn', (e: any) => {
      const id = $(e.currentTarget).data('id');
      this.router.navigate(['/proposta/editar', id]);
    });

    $('#tabelaProposta').on('click', '.delete-btn', (e: any) => {
      const id = $(e.currentTarget).data('id');
      this.confirmarExclusao(id);
    });
  }

  confirmarExclusao(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '450px',
      autoFocus: false,
      data: {
        titulo: 'Excluir Proposta',
        mensagem: 'Deseja realmente remover este item do sistema?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.excluir(id).subscribe(() => {
          this.carregarDados();
        });
      }
    });
  }

  novo() {
    this.router.navigate(['/proposta/novo']);
  }

  pesquisar() {
    this.carregarDados();
  }
}
