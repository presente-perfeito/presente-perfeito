// Função para pegar parâmetro da URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Função para formatar preço
function formatPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para pegar estrelas baseado na nota
function getEstrelas(nota) {
    return '★'.repeat(Math.floor(nota)) + '☆'.repeat(5 - Math.floor(nota));
}

// Função principal de renderização
function renderizarPagina() {
    const produtoId = getUrlParam('id');
    if (!produtoId || !PRODUTOS_CONFIG[produtoId]) {
        window.location.href = 'index.html';
        return;
    }

    const config = PRODUTOS_CONFIG[produtoId];
    const produto = config.produtoPrincipal;

    // Atualiza título e subtítulo
    document.querySelector('h1').textContent = config.titulo;
    document.querySelector('p.text-xl.mb-4').textContent = config.subtitulo;

    // Atualiza informações da categoria
    document.querySelector('.bg-white\\/20 p:nth-child(2)').textContent = `👨 Categoria: ${config.categoria}`;
    document.querySelector('.bg-white\\/20 p:nth-child(3)').textContent = `💰 Faixa: ${config.faixa}`;
    document.querySelector('.bg-white\\/20 p:nth-child(4)').textContent = `⭐ Foco: ${config.foco}`;

    // Atualiza produto principal
    document.querySelector('.w-1/3 img').src = produto.imagem;
    document.querySelector('h2').textContent = produto.nome;

    // Reviews
    const reviewsElement = document.querySelector('.space-y-2');
    reviewsElement.innerHTML = `
        <div class="flex items-center">
            <span class="text-yellow-400 text-xl">${getEstrelas(produto.reviews.media)}</span>
            <span class="text-gray-600 text-lg ml-2">(${produto.reviews.media} / 5)</span>
        </div>
        <div class="flex items-center text-sm space-x-4">
            <span class="text-green-600">${produto.reviews.total} avaliações</span>
            <span class="text-gray-300">|</span>
            <span class="text-blue-600">${produto.reviews.vendidos} vendidos este mês</span>
        </div>
    `;

    // Atualiza preços
    const lojas = ['shopee', 'amazon', 'magalu'];
    lojas.forEach(loja => {
        const precoConfig = produto.precos[loja];
        const lojaElement = document.querySelector(`a[href*="SEU_LINK_${loja.toUpperCase()}"]`).parentElement;
        
        lojaElement.querySelector('.text-gray-400.text-sm.line-through').textContent = formatPreco(precoConfig.normal);
        lojaElement.querySelector('.text-2xl.font-bold').textContent = formatPreco(precoConfig.promo);
        lojaElement.querySelector('.text-green-500.text-sm, .text-orange-500.text-sm').textContent = precoConfig.extra;
    });

    // Atualiza benefícios
    const beneficiosElement = document.querySelector('.bg-gray-50.p-4.rounded-lg.mt-4 ul');
    beneficiosElement.innerHTML = produto.beneficios.map(b => `<li>${b}</li>`).join('');

    // Atualiza sugestões
    const sugestoesContainer = document.querySelector('.grid.grid-cols-2.gap-4');
    sugestoesContainer.innerHTML = config.sugestoes.map(sugestao => `
        <div class="bg-white rounded-lg p-4 text-black">
            <img src="${sugestao.imagem}" alt="${sugestao.nome}" class="w-full rounded-lg mb-3">
            <h3 class="font-bold">${sugestao.nome}</h3>
            <div class="flex items-center my-2">
                <span class="text-yellow-400">${getEstrelas(sugestao.reviews.media)}</span>
                <span class="text-gray-500 text-sm ml-1">(${sugestao.reviews.total} reviews)</span>
            </div>
            <p class="text-gray-500 text-sm">Menor preço:</p>
            <p class="text-gray-400 text-sm line-through">${formatPreco(sugestao.precos.normal)}</p>
            <p class="text-xl font-bold">${formatPreco(sugestao.precos.promo)}</p>
            <button class="w-full bg-gray-200 hover:bg-gray-300 text-black rounded p-2 mt-2 transition-colors">Ver Detalhes</button>
        </div>
    `).join('');
}

// Inicia renderização quando a página carregar
document.addEventListener('DOMContentLoaded', renderizarPagina);