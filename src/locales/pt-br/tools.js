// Textos em português do Brasil das calculadoras e categorias (sem lógica). As chaves coincidem com src/domain/registry.js.
// Os rótulos dos campos NÃO levam a unidade: a camada de apresentação a acrescenta conforme o tipo de campo e a moeda.
// As calculadoras com imposto (`precio` e `iva`) são genéricas: aplicam o percentual que a pessoa digita e não
// implementam regras tributárias de nenhum país. `defaults` substitui os valores iniciais do registro (exemplo editável).

export const slugs = {
  tools: 'calculadoras',
  methodology: 'metodologia',
  pages: { contact: 'contato', legal: 'aviso-legal', privacy: 'politica-de-privacidade', cookies: 'politica-de-cookies', terms: 'termos-de-uso' },
  categories: { 'margenes-y-precios': 'margens-e-precos', facturacion: 'faturamento-e-impostos', crecimiento: 'rentabilidade-e-crescimento' },
  toolPages: {
    margen: 'calculadora-de-margem-comercial',
    precio: 'calculadora-de-preco-de-venda',
    rentabilidad: 'margem-bruta-e-margem-liquida',
    iva: 'calculadora-de-base-e-imposto',
    recargo: 'calculadora-de-markup',
    descuento: 'calculadora-de-descontos-e-preco-final',
    equilibrio: 'calculadora-de-ponto-de-equilibrio',
    roi: 'calculadora-de-roi',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Margens e preços',
    kicker: 'CATEGORIA',
    short: 'Margem, markup, descontos, preço de venda e rentabilidade',
    description:
      'Calculadoras para definir preços, entender a diferença entre margem e markup, aplicar descontos e analisar a rentabilidade do seu negócio.',
  },
  facturacion: {
    title: 'Faturamento e impostos',
    kicker: 'CATEGORIA',
    short: 'Valor base e detalhamento de um imposto em percentual',
    description:
      'Ferramentas para trabalhar com a base e um imposto em percentual: somar ou tirar o imposto e detalhar vários itens. É aritmética genérica, sem regras de um tributo específico.',
  },

  crecimiento: {
    title: 'Rentabilidade e crescimento',
    kicker: 'CATEGORIA',
    short: 'Variação, ponto de equilíbrio, ROI e publicidade',
    description:
      'Calculadoras para saber quantas unidades você precisa vender para cobrir seus custos fixos e que retorno um investimento deixa.',
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
  recargo: {
    title: 'Calculadora de markup',
    menuTitle: 'Markup sobre o custo',
    metaTitle: 'Calculadora de markup: preço de venda e margem',
    metaDescription:
      'Calcule o preço de venda sem imposto ao aplicar um markup sobre o custo e compare o markup com a margem sobre as vendas. Com exemplos resolvidos. Grátis.',
    kicker: 'MARGENS E PREÇOS',
    desc: 'Aplique um markup ao seu custo e veja que margem sobre as vendas ele representa, para não confundir um percentual com o outro.',
    tileText: 'Vá do custo ao preço com um markup e compare com a margem.',
    tileCta: 'Calcular markup',
    search: 'markup sobre custo preço de venda margem lucro porcentagem acréscimo recargo',
    formulas: [
      ['Lucro bruto por unidade', 'Custo × markup'],
      ['Preço de venda sem imposto', 'Custo × (1 + markup)'],
      ['Margem sobre as vendas equivalente', 'Lucro ÷ preço de venda × 100 = markup ÷ (1 + markup)'],
      ['Markup necessário para uma margem', 'Margem ÷ (1 − margem)'],
    ],
    faq: [
      ['Qual é a diferença entre markup e margem?', 'O markup é calculado sobre o custo e a margem, sobre o preço de venda. Com custo de R$ 100 e markup de 25%, o preço é R$ 125, o lucro é R$ 25 e a margem é de 20%.'],
      ['Como passo de markup para margem, e vice-versa?', 'Margem = markup ÷ (1 + markup) e markup = margem ÷ (1 − margem). Um markup de 25% equivale a uma margem de 20%; para chegar a uma margem de 25% é preciso um markup de 33,33%.'],
      ['Por que um markup de 100% não dá uma margem de 100%?', 'Porque dobrar o custo deixa um lucro igual ao custo, que é metade do preço: uma margem de 50%. O markup pode passar de 100%; a margem sobre as vendas nunca chega a esse valor.'],
      ['O preço calculado inclui imposto?', 'Não. É o preço de venda antes do imposto. Se depois você precisar somar o imposto, use a calculadora de preço de venda ou a de base e imposto.'],
      ['O lucro calculado é o que sobra para mim?', 'Não. É o lucro bruto por unidade, antes das despesas gerais, das comissões e dos impostos.'],
    ],
    modes: ['Aplicar um markup'],
    fields: [{ cost: 'Custo do produto', markup: 'Markup sobre o custo' }],
  },
  descuento: {
    title: 'Calculadora de descontos e preço final',
    menuTitle: 'Descontos e preço final',
    metaTitle: 'Calculadora de descontos sucessivos e preço final',
    metaDescription:
      'Calcule o preço final após um ou dois descontos sucessivos, a economia total e o desconto efetivo. Com fórmulas e exemplos resolvidos. Grátis.',
    kicker: 'MARGENS E PREÇOS',
    desc: 'Aplique um ou dois descontos sucessivos e veja o preço final, a economia e o desconto efetivo, sem somar percentuais por engano.',
    tileText: 'Calcule o preço final, a economia e o desconto real de uma ou duas reduções.',
    tileCta: 'Calcular desconto',
    search: 'desconto redução preço final promoção economia porcentagem sucessivo',
    formulas: [
      ['Preço final', 'Preço inicial × (1 − desconto 1) × (1 − desconto 2)'],
      ['Economia total', 'Preço inicial − preço final'],
      ['Desconto efetivo', '100 − (100 − desconto 1) × (100 − desconto 2) ÷ 100'],
    ],
    faq: [
      ['Por que dois descontos de 20% e 10% não somam 30%?', 'Porque o segundo incide sobre o preço já reduzido. Com R$ 100: os 20% deixam R$ 80, 10% de R$ 80 são R$ 8 e o preço final é R$ 72. A economia total é de R$ 28, um desconto efetivo de 28%.'],
      ['A ordem dos descontos importa?', 'Não. A multiplicação é comutativa: aplicar primeiro 10% e depois 20% dá o mesmo preço final. O que muda é quanto cada etapa reduz em reais, não o total.'],
      ['Como calculo o desconto efetivo?', 'Com 100 − (100 − d1) × (100 − d2) ÷ 100. Com 20% e 10%: 100 − 80 × 90 ÷ 100 = 28%. Depende apenas dos percentuais, não do preço.'],
      ['Posso usar um único desconto?', 'Sim. Deixe o segundo desconto vazio ou digite 0, e a calculadora aplica só o primeiro.'],
      ['Digito o preço com ou sem imposto?', 'O que você quiser reduzir: o percentual incide sobre o número que você digitar. O resultado mantém a mesma base, com ou sem imposto.'],
    ],
    modes: ['Descontos sucessivos'],
    fields: [{ price: 'Preço inicial', first: 'Desconto', second: 'Segundo desconto (opcional)' }],
  },
  equilibrio: {
    title: 'Calculadora de ponto de equilíbrio',
    menuTitle: 'Ponto de equilíbrio',
    metaTitle: 'Calculadora de ponto de equilíbrio: unidades e vendas',
    metaDescription:
      'Calcule quantas unidades você precisa vender para cobrir os custos fixos, o faturamento necessário e a margem de contribuição. Com exemplos resolvidos. Grátis.',
    kicker: 'RENTABILIDADE E CRESCIMENTO',
    desc: 'Descubra quantas unidades você precisa vender para cobrir seus custos fixos e que faturamento isso representa, a partir da margem de contribuição de cada unidade.',
    tileText: 'Calcule quantas unidades precisa vender para começar a ganhar dinheiro.',
    tileCta: 'Calcular equilíbrio',
    search: 'ponto de equilíbrio break even custos fixos custos variáveis margem de contribuição unidades',
    formulas: [
      ['Margem de contribuição por unidade', 'Preço de venda − custo variável'],
      ['Unidades no ponto de equilíbrio', 'Custos fixos ÷ margem de contribuição (arredondado para cima)'],
      ['Faturamento no ponto de equilíbrio', 'Unidades arredondadas × preço de venda'],
      ['Resultado com um volume dado', 'Unidades × margem de contribuição − custos fixos'],
    ],
    faq: [
      ['O que é o ponto de equilíbrio?', 'É o nível de vendas em que a receita iguala os custos totais: não há lucro nem prejuízo. A partir da unidade seguinte, cada venda traz lucro.'],
      ['O que é a margem de contribuição?', 'É o que sobra de cada venda depois de pagar os custos variáveis daquela unidade. Com preço de R$ 50 e custo variável de R$ 30, cada unidade contribui com R$ 20 para cobrir os custos fixos.'],
      ['Por que o resultado é arredondado para cima?', 'Porque não se vendem frações de unidade. Se o cálculo dá 437,5 unidades, com 437 ainda há prejuízo e é preciso vender 438.'],
      ['E se o preço for igual ou menor que o custo variável?', 'Cada unidade vendida deixa zero ou dá prejuízo, então nenhum volume cobre os custos fixos. A calculadora avisa em vez de mostrar um número impossível.'],
      ['O que é custo fixo e o que é custo variável?', 'Os fixos não mudam com as unidades vendidas no período (aluguel, seguros, mensalidades, salários fixos). Os variáveis dependem delas (matéria-prima, frete, comissão por venda). Se um custo for misto, separe a parte fixa e a parte variável.'],
    ],
    modes: ['Ponto de equilíbrio'],
    fields: [{ fixed: 'Custos fixos do período', price: 'Preço de venda por unidade', variable: 'Custo variável por unidade', units: 'Unidades que você espera vender (opcional)' }],
  },
  roi: {
    title: 'Calculadora de ROI',
    menuTitle: 'ROI de um investimento',
    metaTitle: 'Calculadora de ROI: retorno de um investimento',
    metaDescription:
      'Calcule o lucro líquido e o ROI percentual de um investimento a partir do valor investido e do retorno total. Com exemplos resolvidos e limites. Grátis.',
    kicker: 'RENTABILIDADE E CRESCIMENTO',
    desc: 'Calcule o lucro ou prejuízo líquido e o ROI percentual de um investimento a partir do que você investiu e do que recuperou no total.',
    tileText: 'Meça quanto você ganhou ou perdeu em relação ao que investiu.',
    tileCta: 'Calcular ROI',
    search: 'roi retorno sobre investimento rentabilidade lucro líquido investimento porcentagem',
    formulas: [
      ['Lucro ou prejuízo líquido', 'Retorno total − investimento inicial'],
      ['ROI', '(Retorno total − investimento inicial) ÷ investimento inicial × 100'],
      ['Retorno por unidade investida', 'Retorno total ÷ investimento inicial'],
    ],
    faq: [
      ['O que devo digitar em «Retorno total obtido»?', 'Tudo o que você recuperou, incluindo o investimento. Se investiu R$ 1.000 e hoje tem R$ 1.300, o retorno total é R$ 1.300, não R$ 300. A calculadora subtrai o investimento por você.'],
      ['ROI e ROAS são a mesma coisa?', 'Não. O ROAS divide a receita de uma campanha pelo gasto com publicidade; o ROI usa o lucro líquido sobre o que foi investido. Com R$ 500 em anúncios que geram R$ 2.000 em vendas, o ROAS é 4, mas se os produtos vendidos custaram R$ 1.200, o lucro é de R$ 300 e o ROI desses R$ 500 é de 60%.'],
      ['O ROI é uma rentabilidade anual?', 'Não: ele não leva o tempo em conta. Um retorno de 30% em três anos equivale a 9,14% ao ano, compostos, e 30% em um ano é muito diferente. Esta calculadora não anualiza o resultado.'],
      ['O que significa um ROI negativo?', 'Que você recuperou menos do que investiu. Se investe R$ 5.000 e recupera R$ 4.000, perde R$ 1.000 e o ROI é de −20%. Um ROI de −100% significa que você não recuperou nada.'],
      ['E se o investimento inicial for zero?', 'O ROI não pode ser calculado, porque seria preciso dividir por zero. A calculadora pede um investimento maior que zero.'],
    ],
    modes: ['Retorno de um investimento'],
    fields: [{ investment: 'Investimento inicial', total: 'Retorno total obtido (com o investimento)' }],
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
  ['calculadora de markup', 'recargo'],
  ['calculadora de descontos e preço final', 'descuento'],
  ['calculadora de ponto de equilíbrio', 'equilibrio'],
  ['calculadora de ROI', 'roi'],
];
