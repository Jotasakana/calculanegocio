// Catálogo em português do Brasil: categorias que ainda não têm nenhuma calculadora disponível e textos das calculadoras
// EM DESENVOLVIMENTO. As chaves coincidem com src/domain/catalog.js. As calculadoras exclusivas de outro país
// (retenção de IRPF e recargo de equivalência, da Espanha) não são oferecidas neste idioma.

export const catalog = {
  categories: {
    crecimiento: {
      title: 'Rentabilidade e crescimento',
      short: 'Variação, ponto de equilíbrio, ROI e publicidade',
    },
    finanzas: {
      title: 'Finanças do negócio',
      short: 'Empréstimos, depreciação, estoque e reserva de caixa',
    },
  },
  planned: {
    recargo: { title: 'Markup sobre o custo', desc: 'Converte entre markup e margem sem confundir os dois.', search: 'markup acrescimo custo margem recargo' },
    descuento: { title: 'Descontos e preço final', desc: 'Aplique um ou mais descontos e veja a margem que sobra.', search: 'desconto promocao preco final oferta' },
    marketplace: { title: 'Comissão de marketplace', desc: 'Calcule o preço mínimo para vender em uma plataforma sem perder margem.', search: 'comissao marketplace plataforma mercado livre amazon venda online' },
    hora: { title: 'Valor da hora de trabalho', desc: 'Estime quanto cobrar por hora a partir dos seus custos e das horas faturáveis.', search: 'valor hora preco hora freelancer honorarios' },
    variacion: { title: 'Variação percentual', desc: 'Compare dois períodos e meça quanto um valor subiu ou caiu.', search: 'variacao percentual aumento queda mudanca' },
    equilibrio: { title: 'Ponto de equilíbrio', desc: 'Descubra quantas unidades você precisa vender para cobrir os custos fixos.', search: 'ponto equilibrio break even custos fixos' },
    roi: { title: 'ROI de um investimento', desc: 'Meça o retorno de um investimento em relação ao valor aplicado.', search: 'roi retorno investimento rentabilidade' },
    roas: { title: 'Retorno de campanhas (ROAS)', desc: 'Calcule a receita obtida para cada real investido em publicidade.', search: 'roas publicidade campanha anuncios retorno' },
    prestamo: { title: 'Parcela de um empréstimo', desc: 'Calcule a parcela periódica, os juros e o total a pagar.', search: 'emprestimo parcela juros credito financiamento' },
    amortizacion: { title: 'Depreciação linear', desc: 'Distribua o custo de um bem ao longo da sua vida útil.', search: 'depreciacao linear bem vida util amortizacao' },
    stock: { title: 'Giro de estoque', desc: 'Meça quantas vezes você renova o estoque em um período.', search: 'giro estoque inventario mercadorias' },
    tesoreria: { title: 'Reserva de caixa', desc: 'Calcule quantos meses de despesas o dinheiro disponível cobre.', search: 'caixa reserva liquidez meses despesas tesouraria' },
  },
};
