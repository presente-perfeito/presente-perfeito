console.log('PRODUTOS_CONFIG disponível:', typeof PRODUTOS_CONFIG !== 'undefined');
console.log('URL params:', new URLSearchParams(window.location.search).get('id'));


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

// Função para renderizar preços das lojas
function renderizarPrecos(produto) {
    const lojas = ['shopee', 'amazon', 'magalu'];
    const lojasHTML = lojas.map(loja => {
        const precoConfig = produto.precos[loja];
        return `
            <div class="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <img src="images/${loja}.jpg" class="w-8 h-8 mr-3">
                        <div>
                            <p class="font-bold">${loja.charAt(0).toUpperCase() + loja.slice(1)}</p>
                            <div class="flex items-center">
                                <span class="text-yellow-400">★★★★★</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-400 text-sm line-through">${formatPreco(precoConfig.normal)}</p>
                        <p class="text-2xl font-bold">${formatPreco(precoConfig.promo)}</p>
                        <p class="text-green-500 text-sm">${precoConfig.extra}</p>
                    </div>
                </div>
                <a href="#" class="block bg-blue-600 text-center text-white py-2 rounded-lg mt-3 font-bold hover:bg-blue-700">
                    Ver na ${loja.charAt(0).toUpperCase() + loja.slice(1)}
                </a>
            </div>
        `;
    }).join('');

    return lojasHTML;
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
    const infoElements = document.querySelectorAll('.bg-white\\/20 p.font-bold');
    infoElements[0].textContent = `👨 Categoria: ${config.categoria}`;
    infoElements[1].textContent = `💰 Faixa: ${config.faixa}`;
    infoElements[2].textContent = `⭐ Foco: ${config.foco}`;

    // Atualiza produto principal
    const produtoImg = document.querySelector('.w-1/3 img');
    produtoImg.src = produto.imagem;
    produtoImg.alt = produto.nome;
    
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

    // Review destaque
    const reviewDestaque = document.querySelector('.bg-gray-50.p-4.rounded-lg.mb-4 .text-gray-600');
    reviewDestaque.textContent = produto.reviews.destaque.texto;
    document.querySelector('.review-iniciais').textContent = produto.reviews.destaque.autor.split(' ').map(n => n[0]).join('');
    document.querySelector('.review-autor').textContent = produto.reviews.destaque.autor;

    // Preços das lojas
    const lojasContainer = document.querySelector('.space-y-3.mb-6');
    lojasContainer.innerHTML = renderizarPrecos(produto);

    // Benefícios
    const beneficiosElement = document.querySelector('.bg-gray-50.p-4.rounded-lg.mt-4 ul');
    beneficiosElement.innerHTML = produto.beneficios.map(b => `<li>${b}</li>`).join('');

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

document.addEventListener('DOMContentLoaded', renderizarPagina);