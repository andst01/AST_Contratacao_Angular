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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    const formHasError = !!(form && form.hasError('dataInvalida'));
    const controlInvalid = !!(control && control.invalid);
    const userInteracted = !!(control?.dirty || control?.touched || isSubmitted);

    return (controlInvalid || formHasError) && userInteracted;
    // O campo fica vermelho se ele mesmo for inválido OU se o formulário pai tiver o erro de data
    // return !!(control && control.invalid || (form && form.hasError('dataInvalida'))) && (control?.dirty || control?.touched || isSubmitted);
  }
}

@Component({
  selector: 'app-apolice-form-component',
  standalone: true,
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
  templateUrl: './apolice-form-component.html',
  styleUrl: './apolice-form-component.css',
})
export class ApoliceFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id!: number;
  valorCoberturaFormatado = '';
  premioFinalFormatado = '';
  matcher = new MyErrorStateMatcher();
  listaMestraPropostas: any[] = [];
  filteredPropostas$: Observable<any[]> = of([]);
  

  constructor(
    private fb: FormBuilder,
    private service: ApoliceService,
    private route: ActivatedRoute,
    private router: Router,
    private propostaService: PropostaService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        id: [0],
        idProposta: [0, Validators.required],
        numeroApolice: ['', Validators.required],
        codigoStatus: [-1, [Validators.required, Validators.min(0)]],
        dataInicioVigencia: [null, Validators.required],
        dataFimVigencia: [null],
        formaPagamento: ['', Validators.required],
        valorCobertura: [0, [Validators.required, Validators.min(0.01)]],
        premioFinal: [0, [Validators.required, Validators.min(0.01)]],
        quantidadeParcelas: [0],
        dataContratacao: [''],
        numeroProposta: [''],
      },
      { validators: [datasApoliceValidator] },
    );

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.isEdit = true;
      let objProposta = {} as Proposta;

      this.form.get('numeroApolice')?.disable();
      this.form.get('idProposta')?.disable();
      this.service.obterPorId(this.id).subscribe((data) => {
        this.valorCoberturaFormatado = MoedaUtil.formatarMoeda(data.valorCobertura);
        this.premioFinalFormatado = MoedaUtil.formatarMoeda(data.premioFinal);

        this.propostaService.obterPorId(data.idProposta).subscribe((dados) => {
          objProposta = dados as Proposta;

          this.form.patchValue({
            ...data,
            idProposta: objProposta,
          });
        });

        // console.log(this.listaMestraPropostas);

        //const propostaCompleta = this.listaMestraPropostas.find((p) => p.id === data.idProposta);
        //console.log(this.listaMestraPropostas[0])
      });
    } else {
      this.propostaService.listar().subscribe((dados) => {
        this.listaMestraPropostas = dados;

        this.setupFiltro();
      });
    }
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

  carregarDadosProposta() {
    if (this.isEdit) {
      debugger;
      const idProposta = this.form.value.idProposta;
      this.propostaService.obterPorId(idProposta).subscribe((dados) => {
        this.listaMestraPropostas.push(dados);
      });
    } else {
      this.propostaService.listar().subscribe((dados) => {
        this.listaMestraPropostas = dados;

        this.setupFiltro();
      });
    }
  }

  private setupFiltro() {
    this.filteredPropostas$ = this.form.get('idProposta')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        // Se 'value' for string, o usuário está digitando.
        // Se for objeto, ele selecionou uma opção.
        const termo = typeof value === 'string' ? value : value?.numeroProposta;
        return termo ? this._filter(termo) : this.listaMestraPropostas.slice();
      }),
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listaMestraPropostas.filter(
      (opcao) =>
        opcao.numeroProposta.toLowerCase().includes(filterValue) ||
        opcao.nomeCliente.toLowerCase().includes(filterValue),
    );
  }

  displayFn(proposta: any): string {
    return proposta ? `${proposta.numeroProposta} - ${proposta.nomeCliente}` : '';
  }

  salvar() {
    if (this.form.invalid) return;
    const formValue = this.form.getRawValue();

    console.log(this.form.value);

    const payload = {
      ...formValue,
      idProposta: formValue.idProposta?.id ? formValue.idProposta.id : formValue.idProposta,
      valorCobertura: MoedaUtil.parseMoeda(this.valorCoberturaFormatado),
      premioFinal: MoedaUtil.parseMoeda(this.premioFinalFormatado),
      dataInicioVigencia: DateUtil.formatarParaApi(formValue.dataInicioVigencia),
      dataFimVigencia: DateUtil.formatarParaApi(formValue.dataFimVigencia),
      dataContratacao: DateUtil.formatarParaApi(formValue.dataContratacao),
    };

    console.log(payload);

    this.service.salvar(payload).subscribe({
      next: (data) => {
        this.notify.success(data.mensagem?.descricao ?? 'Salvo com sucesso!');
        //this.router.navigate(['/apolice']);
      },
      error: (err) => {
        //console.log(err)
        const msg = err.error?.mensagem?.descricao || 'Erro ao processar requisição';
        this.notify.error(msg);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/apolice']);
  }
}
