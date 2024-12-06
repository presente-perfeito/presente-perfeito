// Debug logs
console.log('PRODUTOS_CONFIG disponível:', typeof PRODUTOS_CONFIG !== 'undefined');
console.log('URL params:', new URLSearchParams(window.location.search).get('id'));

// Helpers
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

function createElementWithHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

// Função principal de renderização
function renderizarPagina() {
    const produtoId = getUrlParam('id');
    console.log('Tentando renderizar:', produtoId);

    if (!produtoId || !PRODUTOS_CONFIG[produtoId]) {
        console.log('Redirecionando para index...');
        window.location.href = 'index.html';
        return;
    }

    const config = PRODUTOS_CONFIG[produtoId];
    const produto = config.produtoPrincipal;

    // Atualiza elementos principais
    document.querySelector('h1').textContent = config.titulo;
    document.querySelector('.text-xl.mb-4').textContent = config.subtitulo;

    // Atualiza categoria, faixa e foco
    const infoBoxes = document.querySelectorAll('.bg-white\\/20 .font-bold');
    if (infoBoxes.length >= 3) {
        infoBoxes[0].textContent = `👨 Categoria: ${config.categoria}`;
        infoBoxes[1].textContent = `💰 Faixa: ${config.faixa}`;
        infoBoxes[2].textContent = `⭐ Foco: ${config.foco}`;
    }

    // Produto Principal
    const mainProduct = document.querySelector('.flex.items-center.gap-6.mb-6');
    if (mainProduct) {
        const img = mainProduct.querySelector('img');
        if (img) {
            img.src = produto.imagem;
            img.alt = produto.nome;
        }

        const title = mainProduct.querySelector('h2');
        if (title) {
            title.textContent = produto.nome;
        }

        // Reviews
        const reviewsSection = mainProduct.querySelector('.space-y-2');
        if (reviewsSection) {
            reviewsSection.innerHTML = `
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
        }
    }

    // Review em destaque
    const reviewDestaque = document.querySelector('.bg-gray-50.p-4.rounded-lg.mb-4');
    if (reviewDestaque) {
        const reviewText = reviewDestaque.querySelector('.text-gray-600');
        if (reviewText) {
            reviewText.textContent = produto.reviews.destaque.texto;
        }
    }

    // Benefícios
    const beneficiosList = document.querySelector('.bg-gray-50.p-4.rounded-lg.mt-4 ul');
    if (beneficiosList) {
        beneficiosList.innerHTML = produto.beneficios.map(b => `<li>${b}</li>`).join('');
    }

    // Preços das lojas
    const lojasContainer = document.querySelector('.space-y-3.mb-6');
    if (lojasContainer) {
        lojasContainer.innerHTML = '';
        
        Object.entries(produto.precos).forEach(([loja, precos]) => {
            const lojaElement = createElementWithHTML(`
                <div class="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer">
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
                </div>
            `);
            lojasContainer.appendChild(lojaElement);
        });
    }

    // Sugestões
    const sugestoesContainer = document.querySelector('.grid.grid-cols-2.gap-4.mb-20');
    if (sugestoesContainer) {
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
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', renderizarPagina);