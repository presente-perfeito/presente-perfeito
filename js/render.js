// Debug logs
console.log('PRODUTOS_CONFIG disponível:', typeof PRODUTOS_CONFIG !== 'undefined');
console.log('URL params:', new URLSearchParams(window.location.search).get('id'));

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function formatPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getEstrelas(nota) {
    return '★'.repeat(Math.floor(nota)) + '☆'.repeat(5 - Math.floor(nota));
}

function renderizarPagina() {
    const produtoId = getUrlParam('id');
    
    console.log('Tentando renderizar:', produtoId, PRODUTOS_CONFIG[produtoId]);

    if (!produtoId || !PRODUTOS_CONFIG[produtoId]) {
        console.log('Redirecionando para index...');
        window.location.href = 'index.html';
        return;
    }

    const config = PRODUTOS_CONFIG[produtoId];
    const produto = config.produtoPrincipal;

    // Título e subtítulo
    document.querySelector('h1.text-4xl').textContent = config.titulo;
    document.querySelector('p.text-xl.mb-4').textContent = config.subtitulo;

    // Informações da categoria
    const infoItems = document.querySelectorAll('.bg-white\\/20 p.font-bold');
    infoItems[0].textContent = `👨 Categoria: ${config.categoria}`;
    infoItems[1].textContent = `💰 Faixa: ${config.faixa}`;
    infoItems[2].textContent = `⭐ Foco: ${config.foco}`;

    // Produto principal
    document.querySelector('.w-1\\/3.max-w-sm img').src = produto.imagem;
    document.querySelector('h2.text-3xl').textContent = produto.nome;

    // Reviews
    const reviewsContainer = document.querySelector('.space-y-2');
    reviewsContainer.innerHTML = `
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

    // Benefícios
    const beneficiosLista = document.querySelector('.bg-gray-50.p-4.rounded-lg.mt-4 ul');
    beneficiosLista.innerHTML = produto.beneficios.map(b => `<li>${b}</li>`).join('');

    // Preços
    const precosContainer = document.querySelector('.space-y-3.mb-6');
    Object.entries(produto.precos).forEach(([loja, precos]) => {
        const div = document.createElement('div');
        div.className = 'border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer';
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <div>
                        <p class="font-bold">${loja.charAt(0).toUpperCase() + loja.slice(1)}</p>
                        <div class="flex items-center">
                            <span class="text-yellow-400">★★★★★</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-gray-400 text-sm line-through">${formatPreco(precos.normal)}</p>
                    <p class="text-2xl font-bold">${formatPreco(precos.promo)}</p>
                    <p class="text-green-500 text-sm">${precos.extra}</p>
                </div>
            </div>
            <a href="#" class="block bg-blue-600 text-center text-white py-2 rounded-lg mt-3 font-bold hover:bg-blue-700">
                Ver na ${loja.charAt(0).toUpperCase() + loja.slice(1)}
            </a>
        `;
        precosContainer.appendChild(div);
    });

    // Sugestões
    const sugestoesContainer = document.querySelector('.grid.grid-cols-2.gap-4.mb-20');
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

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', renderizarPagina);