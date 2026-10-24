// Catálogo em português do Brasil: categorias que ainda não têm nenhuma calculadora disponível e textos das calculadoras
// EM DESENVOLVIMENTO. As chaves coincidem com src/domain/catalog.js. As calculadoras exclusivas de outro país
// (retenção de IRPF e recargo de equivalência, da Espanha) não são oferecidas neste idioma.

export const catalog = {
  categories: {
    finanzas: {
      title: 'Finanças do negócio',
      short: 'Empréstimos, depreciação, estoque e reserva de caixa',
    },
  },
  planned: {
    marketplace: { title: 'Comissão de marketplace', desc: 'Calcule o preço mínimo para vender em uma plataforma sem perder margem.', search: 'comissao marketplace plataforma mercado livre amazon venda online' },
    hora: { title: 'Valor da hora de trabalho', desc: 'Estime quanto cobrar por hora a partir dos seus custos e das horas faturáveis.', search: 'valor hora preco hora freelancer honorarios' },
    variacion: { title: 'Variação percentual', desc: 'Compare dois períodos e meça quanto um valor subiu ou caiu.', search: 'variacao percentual aumento queda mudanca' },
    roas: { title: 'Retorno de campanhas (ROAS)', desc: 'Calcule a receita obtida para cada real investido em publicidade.', search: 'roas publicidade campanha anuncios retorno' },
    prestamo: { title: 'Parcela de um empréstimo', desc: 'Calcule a parcela periódica, os juros e o total a pagar.', search: 'emprestimo parcela juros credito financiamento' },
    amortizacion: { title: 'Depreciação linear', desc: 'Distribua o custo de um bem ao longo da sua vida útil.', search: 'depreciacao linear bem vida util amortizacao' },
    stock: { title: 'Giro de estoque', desc: 'Meça quantas vezes você renova o estoque em um período.', search: 'giro estoque inventario mercadorias' },
    tesoreria: { title: 'Reserva de caixa', desc: 'Calcule quantos meses de despesas o dinheiro disponível cobre.', search: 'caixa reserva liquidez meses despesas tesouraria' },
  },
};
