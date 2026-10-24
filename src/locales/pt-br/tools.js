// Textos em português do Brasil das calculadoras e categorias (sem lógica). As chaves coincidem com src/domain/registry.js.
// Os rótulos dos campos NÃO levam a unidade: a camada de apresentação a acrescenta conforme o tipo de campo e a moeda.
// As calculadoras com imposto (`precio` e `iva`) são genéricas: aplicam o percentual que a pessoa digita e não
// implementam regras tributárias de nenhum país. `defaults` substitui os valores iniciais do registro (exemplo editável).

export const slugs = {
  tools: 'calculadoras',
  methodology: 'metodologia',
  categories: { 'margenes-y-precios': 'margens-e-precos', facturacion: 'faturamento-e-impostos' },
  toolPages: {
    margen: 'calculadora-de-margem-comercial',
    precio: 'calculadora-de-preco-de-venda',
    rentabilidad: 'margem-bruta-e-margem-liquida',
    iva: 'calculadora-de-base-e-imposto',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Margens e preços',
    kicker: 'CATEGORIA',
    short: 'Cálculo de margem, markup, preço de venda e rentabilidade',
    description:
      'Calculadoras para definir preços, entender a diferença entre margem e markup e analisar a rentabilidade do seu negócio.',
  },
  facturacion: {
    title: 'Faturamento e impostos',
    kicker: 'CATEGORIA',
    short: 'Valor base e detalhamento de um imposto em percentual',
    description:
      'Ferramentas para trabalhar com a base e um imposto em percentual: somar ou tirar o imposto e detalhar vários itens. É aritmética genérica, sem regras de um tributo específico.',
  },
};

export const tools = {
  margen: {
    title: 'Calculadora de margem comercial',
    menuTitle: 'Margem comercial',
    metaTitle: 'Calculadora de margem comercial e markup',
    metaDescription:
      'Calcule a margem sobre as vendas, o markup sobre o custo e o lucro por unidade. Com fórmulas, exemplos resolvidos e erros comuns. Grátis e sem cadastro.',
    kicker: 'MARGENS E PREÇOS',
    desc: 'Calcule quanto você ganha por venda, a margem sobre o preço e o markup sobre o seu custo, sem misturar imposto.',
    tileText: 'Descubra quanto você lucra por produto e a diferença entre margem e markup.',
    tileCta: 'Calcular margem',
    search: 'margem comercial markup lucro porcentagem acrescimo recargo',
    formulas: [
      ['Lucro', 'Preço de venda − custo'],
      ['Margem sobre as vendas', 'Lucro ÷ preço de venda × 100'],
      ['Markup sobre o custo', 'Lucro ÷ custo × 100'],
    ],
    faq: [
      ['Qual é a diferença entre margem e markup?', 'A margem é calculada sobre o preço de venda e o markup, sobre o custo. Com custo de R$ 60 e preço de R$ 100, o lucro é de R$ 40: uma margem de 40% e um markup de 66,67%.'],
      ['A margem inclui imposto?', 'Não. Os valores são digitados sem imposto, porque o imposto não é custo nem lucro do seu negócio.'],
      ['O que significa uma margem negativa?', 'Que você vende abaixo do custo: o lucro por unidade é negativo e a calculadora avisa.'],
      ['Posso calcular o preço a partir de uma margem?', 'Sim. Use a aba «Quero uma margem» com o custo e a margem desejada. Se você já tem o preço e quer saber o custo máximo, use «Custo máximo».'],
    ],
    modes: ['Tenho custo e preço', 'Quero uma margem', 'Custo máximo'],
    fields: [
      { cost: 'Custo de compra', price: 'Preço sem imposto', quantity: 'Quantidade' },
      { cost: 'Custo unitário', margin: 'Margem desejada', quantity: 'Quantidade' },
      { price: 'Preço sem imposto', margin: 'Margem desejada', quantity: 'Quantidade' },
    ],
  },
  precio: {
    title: 'Calculadora de preço de venda com imposto',
    menuTitle: 'Preço de venda',
    metaTitle: 'Calculadora de preço de venda com imposto e comissão',
    metaDescription:
      'Calcule o preço de venda a partir do custo, da margem ou do markup, da comissão, do desconto e de um imposto em percentual. Com exemplos resolvidos. Grátis.',
    kicker: 'PREÇOS E MARGENS',
    desc: 'Defina o preço de venda por margem ou markup e veja o efeito de comissões, descontos e de um imposto cujo percentual você escolhe.',
    tileText: 'Calcule um preço a partir dos custos, da margem, dos descontos e de um imposto em percentual.',
    tileCta: 'Calcular preço',
    search: 'preco de venda desconto custo comissao imposto percentual margem',
    formulas: [
      ['Custo total', 'Custo unitário + custos adicionais'],
      ['Preço sem imposto (margem desejada)', 'Custo total ÷ (1 − comissão − margem)'],
      ['Preço sem imposto (markup)', 'Custo total × (1 + markup)'],
      ['Preço com imposto', 'Preço sem imposto × (1 + percentual do imposto)'],
    ],
    faq: [
      ['A margem é calculada sobre o custo ou sobre o preço?', 'Em «Margem desejada», sobre o preço de venda sem imposto. Se você prefere um percentual sobre o custo, use «Markup sobre o custo».'],
      ['O que entra em «Custos adicionais»?', 'Qualquer custo que você paga por unidade vendida e que não está no custo unitário: frete, embalagem, personalização…'],
      ['Por que o preço sobe tanto quando acrescento uma comissão?', 'Porque a comissão é paga sobre o preço de venda, não sobre o custo. Margem e comissão saem juntas dos 100% do preço, então a soma delas precisa ficar abaixo de 100%.'],
      ['Esta calculadora aplica as regras de algum imposto?', 'Não. Ela soma por fora o percentual que você digita. Tributos reais têm regras próprias, como estar incluídos no preço, e isso não é considerado: confirme com o seu contador.'],
      ['Posso analisar um preço que eu já pratico?', 'Sim, em «Analisar um preço»: você informa o preço, se ele já inclui imposto, o custo e a comissão, e a calculadora mostra a margem real que sobra.'],
    ],
    modes: ['Margem desejada', 'Markup sobre o custo', 'Analisar um preço'],
    fields: [
      { cost: 'Custo unitário', extra: 'Custos adicionais', margin: 'Margem desejada', commission: 'Comissão', discount: 'Desconto previsto', vat: 'Imposto' },
      { cost: 'Custo unitário', extra: 'Custos adicionais', markup: 'Markup', commission: 'Comissão', discount: 'Desconto previsto', vat: 'Imposto' },
      { cost: 'Custo unitário', extra: 'Custos adicionais', given: 'Preço de venda informado', commission: 'Comissão', vat: 'Imposto', included: 'Preço informado já com imposto' },
    ],
    defaults: { vat: 10 },
  },
  rentabilidad: {
    title: 'Calculadora de margem bruta e líquida',
    menuTitle: 'Margem bruta e líquida',
    metaTitle: 'Margem bruta e margem líquida: calculadora',
    metaDescription:
      'Calcule a margem bruta, operacional e líquida do seu negócio a partir de vendas, custos e despesas do mesmo período. Com exemplos resolvidos. Grátis e sem cadastro.',
    kicker: 'RENTABILIDADE DO NEGÓCIO',
    desc: 'Detalhe vendas, custos e despesas de um mesmo período para conhecer a margem bruta, a operacional e a líquida.',
    tileText: 'Analise receitas, custos, despesas e a rentabilidade da sua atividade.',
    tileCta: 'Ver rentabilidade',
    search: 'margem bruta liquida despesas lucro rentabilidade resultado',
    formulas: [
      ['Receita líquida', 'Vendas − devoluções e descontos'],
      ['Margem bruta', '(Receita líquida − custo das vendas) ÷ receita líquida × 100'],
      ['Resultado operacional', 'Receita líquida − custo das vendas − despesas operacionais'],
      ['Lucro líquido', 'Resultado operacional − despesas financeiras − imposto sobre o resultado'],
    ],
    faq: [
      ['O que é a receita líquida?', 'As vendas do período menos as devoluções e os descontos. É a base sobre a qual todos os percentuais são calculados.'],
      ['Margem bruta e margem comercial são a mesma coisa?', 'Não. A margem comercial é calculada por produto, com seu preço e seu custo; a margem bruta é a do negócio inteiro em um período, sobre a receita líquida.'],
      ['O que entra nas despesas operacionais?', 'As despesas de funcionamento do período que não são custo das vendas: aluguel, contas, pessoal, publicidade… Use sempre valores do mesmo período.'],
      ['O resultado pode ser negativo?', 'Pode. Se custos e despesas superam as vendas, o resultado é um prejuízo e a calculadora o mostra com sinal negativo.'],
    ],
    modes: ['Resultado do período'],
    fields: [
      { sales: 'Vendas do período', returns: 'Devoluções e descontos', cogs: 'Custo das vendas', operating: 'Despesas operacionais', finance: 'Despesas financeiras', tax: 'Imposto sobre o resultado' },
    ],
  },
  iva: {
    title: 'Calculadora de base e imposto em percentual',
    menuTitle: 'Base e imposto',
    metaTitle: 'Calculadora de base e imposto: somar e tirar imposto',
    metaDescription:
      'Some um percentual de imposto a um valor, descubra a base a partir de um total ou detalhe vários itens. Aritmética genérica, com exemplos resolvidos. Grátis.',
    kicker: 'FATURAMENTO E IMPOSTOS',
    desc: 'Obtenha o imposto e o total a partir da base, ou descubra a base quando o valor já inclui o imposto, com o percentual que você escolher.',
    tileText: 'Some ou tire um imposto em percentual e confira o detalhamento dos valores.',
    tileCta: 'Calcular imposto',
    search: 'imposto percentual base total tirar somar valor itens aliquota',
    formulas: [
      ['Imposto', 'Valor base × percentual'],
      ['Total', 'Valor base + imposto'],
      ['Base a partir do total', 'Total ÷ (1 + percentual)'],
    ],
    faq: [
      ['O que é o valor base?', 'É o valor da operação antes de somar o imposto, já com os descontos que reduzem o preço.'],
      ['Como tiro o imposto de um valor?', 'Divida o total por 1 mais o percentual em forma de fração: com 10%, por 1,10. A aba «Tirar imposto» faz isso por você.'],
      ['Como é feito o arredondamento?', 'As contas são feitas em centavos e o imposto é arredondado ao centavo mais próximo, de modo que base mais imposto sempre dão o total.'],
      ['Esta calculadora diz qual imposto ou alíquota se aplica?', 'Não. Ela só aplica o percentual que você digita, somado por fora da base ou extraído do total. Cada tributo tem regras próprias, e algumas ficam incluídas no preço: confirme com o seu contador.'],
    ],
    modes: ['Somar imposto', 'Tirar imposto', 'Vários itens'],
    fields: [
      { base: 'Valor base', vat: 'Imposto' },
      { total: 'Total com imposto', vat: 'Imposto' },
      { qty1: 'Quantidade do item 1', unit1: 'Preço unitário do item 1', disc1: 'Desconto do item 1', vat1: 'Imposto do item 1', qty2: 'Quantidade do item 2', unit2: 'Preço unitário do item 2', vat2: 'Imposto do item 2', qty3: 'Quantidade do item 3', unit3: 'Preço unitário do item 3', vat3: 'Imposto do item 3' },
    ],
    defaults: { vat: 10, vat1: 10, vat2: 10, vat3: 5 },
  },
};

/** Rótulos dos valores dos campos de lista fechada. */
export const selectOptions = { included: { no: 'Não', yes: 'Sim' } };

/** Frases do texto editorial que são ligadas automaticamente à sua calculadora. */
export const autolinkPhrases = [
  ['calculadora de margem comercial', 'margen'],
  ['calculadora de preço de venda', 'precio'],
  ['calculadora de margem bruta e líquida', 'rentabilidad'],
  ['calculadora de base e imposto', 'iva'],
];
