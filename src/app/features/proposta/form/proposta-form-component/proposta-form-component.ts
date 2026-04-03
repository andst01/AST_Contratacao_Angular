import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApoliceService } from '../../../../core/services/ApoliceService ';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../util/MyDateFormats';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateUtil } from '../../../util/DateUtil';
import { MoedaUtil } from '../../../util/MoedaUtil';
import { datasApoliceValidator } from '../../../util/datasApoliceValidator';
import { ErrorStateMatcher } from '@angular/material/core';
import { map, Observable, of, startWith } from 'rxjs';
import { PropostaService } from '../../../../core/services/PropostaService';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Proposta } from '../../../proposta/models/Proposta';
import { NotificationService } from '../../../../core/services/NotificationService';
import { ClienteService } from '../../../../core/services/ClienteService';
import { Cliente } from '../../../cliente/models/Cliente';

@Component({
  selector: 'app-proposta-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './proposta-form-component.html',
  styleUrl: './proposta-form-component.css',
})
export class PropostaFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: PropostaService,
    // private clienteService: ClienteSer
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.carregarForm();
    this.carregarDados();
  }

  form!: FormGroup;
  isEdit = false;
  id!: number;
  valorCoberturaFormatado = '';
  premioFinalFormatado = '';
  //matcher = new MyErrorStateMatcher();
  listaMestraPropostas: any[] = [];
  filteredPropostas$: Observable<any[]> = of([]);

  carregarForm() {
    this.form = this.fb.group({
      id: [0],
      numeroProposta: ['', Validators.required],
      tipoSeguro: ['', Validators.required],
      dataCriacao: ['', Validators.required],
      dataValidade: [''],
      premio: [0, [Validators.required, Validators.min(0.1)]],
      valorCobertura: [0, [Validators.required, Validators.min(0.1)]],
      formaPagamento: ['', Validators.required],
      quantidadeParcelas: [0],
      canalVenda: ['', Validators.required],
      observacoes: [''],
      idCliente: [0, Validators.required],
      codigoStatus: [-1, Validators.required],
    });
  }

  carregarDados() {
    if (this.id) {
      this.isEdit = true;
      let obj = {} as Cliente;

      this.form.get('numeroProposta')?.disable();
      this.form.get('idCliente')?.disable();

      this.service.obterPorId(this.id).subscribe((data) => {
        console.log("Proposta:")
        console.log(data);
        
        this.valorCoberturaFormatado = MoedaUtil.formatarMoeda(data.valorCobertura);
        this.premioFinalFormatado = MoedaUtil.formatarMoeda(data.premio);

        this.clienteService.obterPorId(data.idCliente).subscribe((dados) => {
          obj = dados as Cliente;

          this.form.patchValue({
            ...data,
            idCliente: obj,
          });
        });
      });
    } else {
      this.clienteService.listar().subscribe((dados) => {
        this.listaMestraPropostas = dados;

        this.setupFiltro();
      });
    }
  }

  private setupFiltro() {
    this.filteredPropostas$ = this.form.get('idCliente')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const termo = typeof value === 'string' ? value : value?.nomeCpf;
        return termo ? this._filter(termo) : this.listaMestraPropostas.slice();
      }),
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listaMestraPropostas.filter((opcao) =>
      //opcao.cpf.toLowerCase().includes(filterValue) ||
      opcao.nomeCpf.toLowerCase().includes(filterValue),
    );
  }

  displayFn(cliente: any): string {
    return cliente ? `${cliente.nomeCpf}` : '';
  }

  onValorCoberturaChange(event: any) {
    const valor = MoedaUtil.parseMoeda(event.target.value);

    this.form.patchValue({
      valorCobertura: valor,
    });

    this.valorCoberturaFormatado = MoedaUtil.formatarMoeda(valor);
  }

  onPremioFinalChange(event: any) {
    const valor = MoedaUtil.parseMoeda(event.target.value);

    this.form.patchValue({
      premioFinal: valor,
    });

    this.premioFinalFormatado = MoedaUtil.formatarMoeda(valor);
  }

  salvar() {
    if (this.form.invalid) return;
    const formValue = this.form.getRawValue();

    console.log(this.form.value);

    const payload = {
      ...formValue,
      idCliente: formValue.idCliente?.id ? formValue.idCliente.id : formValue.idCliente,
      valorCobertura: MoedaUtil.parseMoeda(this.valorCoberturaFormatado),
      premioFinal: MoedaUtil.parseMoeda(this.premioFinalFormatado),
      dataValidade: DateUtil.formatarParaApi(formValue.dataValidade),
      dataCriacao: DateUtil.formatarParaApi(formValue.dataCriacao),
    };

    console.log(payload);

    this.service.salvar(payload).subscribe({
      next: (data) => {
        this.notify.success(data.mensagem?.descricao ?? 'Salvo com sucesso!');
        //this.router.navigate(['/apolice']);
      },
      error: (err) => {
        const msg = err.error?.mensagem?.descricao || 'Erro ao processar requisição';
        this.notify.error(msg);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/proposta']);
  }
}
