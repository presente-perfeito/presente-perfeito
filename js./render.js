// render.js

// TRUQUE NINJA 1: Cache dos produtos
function salvarCache(id, dados) {
    localStorage.setItem(`produto_${id}`, JSON.stringify(dados));
}

function getCache(id) {
    return JSON.parse(localStorage.getItem(`produto_${id}`));
}

// TRUQUE NINJA 2: Preload de imagens
function preloadImagens(produto) {
    const imagens = [
        produto.produtoPrincipal.imagem,
        ...produto.sugestoes.map(s => s.imagem),
        ...Object.values(produto.produtoPrincipal.lojas).map(l => l.logo)
    ];
    
    imagens.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// TRUQUE NINJA 3: Sistema de fallback
function getProdutoSeguro(id) {
    // Tenta pegar do cache primeiro
    const cache = getCache(id);
    if (cache) return cache;

    // Se não tem no cache, pega do config
    const produto = PRODUTOS_CONFIG[id];
    if (produto) {
        salvarCache(id, produto);
        return produto;
    }

    // Se deu tudo errado, redireciona pra home
    window.location.href = '/presente-perfeito/';
}

// Função principal que renderiza tudo
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id') || 'pai-basico'; // fallback pro pai-basico

    // 2. Pega dados do produto
    const produto = getProdutoSeguro(produtoId);
    
    // 3. Preload das imagens
    preloadImagens(produto);

    // 4. Renderiza Metadados
    document.querySelector('h1').innerText = produto.meta.titulo;
    document.querySelector('.subtitulo').innerText = produto.meta.subtitulo;
    document.querySelector('.categoria').innerText = produto.meta.categoria;
    document.querySelector('.faixa').innerText = produto.meta.faixa;
    document.querySelector('.foco').innerText = produto.meta.foco;
    document.querySelector('.aprovacao').innerText = produto.meta.stats.aprovacao;
    document.querySelector('.vendas').innerText = produto.meta.stats.vendas;

    // 5. Renderiza Produto Principal
    const prod = produto.produtoPrincipal;
    document.querySelector('.produto-img').src = prod.imagem;
    document.querySelector('.produto-nome').innerText = prod.nome;
    document.querySelector('.produto-nota').innerText = prod.avaliacoes.nota;
    document.querySelector('.produto-total-reviews').innerText = prod.avaliacoes.total;
    document.querySelector('.produto-vendidos').innerText = prod.vendidos;

    // 6. Renderiza Review
    const review = prod.reviews[0];
    document.querySelector('.review-autor').innerText = review.autor;
    document.querySelector('.review-iniciais').innerText = review.iniciais;
    document.querySelector('.review-texto').innerText = review.texto;

    // 7. Renderiza Lojas
    const lojasContainer = document.querySelector('.lojas-container');
    Object.entries(prod.lojas).forEach(([key, loja]) => {
        const template = `
            <div class="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <img src="${loja.logo}" class="w-8 h-8 mr-3">
                        <div>
                            <p class="font-bold">${loja.nome}</p>
                            ${loja.reviews ? `
                                <div class="flex items-center">
                                    <span class="text-yellow-400">${'★'.repeat(loja.nota)}</span>
                                    <span class="text-gray-500 text-sm ml-1">(${loja.reviews} reviews)</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        ${loja.precoOriginal ? `<p class="text-gray-400 text-sm line-through">R$ ${loja.precoOriginal.toFixed(2)}</p>` : ''}
                        <p class="text-2xl font-bold">R$ ${loja.precoAtual.toFixed(2)}</p>
                        ${loja.frete ? `<p class="text-green-500 text-sm">${loja.frete}</p>` : ''}
                    </div>
                </div>
                ${loja.link ? `
                    <a href="${loja.link}" class="block bg-blue-600 text-center text-white py-2 rounded-lg mt-3 font-bold hover:bg-blue-700">
                        Ver na ${loja.nome}
                    </a>
                ` : ''}
            </div>
        `;
        lojasContainer.innerHTML += template;
    });

    // 8. Renderiza Benefícios
    const beneficiosLista = document.querySelector('.beneficios-lista');
    prod.beneficios.forEach(beneficio => {
        beneficiosLista.innerHTML += `<li>${beneficio}</li>`;
    });

    // 9. Renderiza Sugestões
    const sugestoesContainer = document.querySelector('.sugestoes-container');
    produto.sugestoes.forEach(sugestao => {
        const template = `
            <div class="bg-white rounded-lg p-4 text-black">
                <img src="${sugestao.imagem}" alt="${sugestao.nome}" class="w-full rounded-lg mb-3">
                <h3 class="font-bold">${sugestao.nome}</h3>
                <div class="flex items-center my-2">
                    <span class="text-yellow-400">${'★'.repeat(sugestao.nota)}</span>
                    <span class="text-gray-500 text-sm ml-1">(${sugestao.reviews} reviews)</span>
                </div>
                <p class="text-gray-500 text-sm">Menor preço:</p>
                <p class="text-gray-400 text-sm line-through">R$ ${sugestao.precoOriginal.toFixed(2)}</p>
                <p class="text-xl font-bold">R$ ${sugestao.precoAtual.toFixed(2)}</p>
                <button class="w-full bg-gray-200 hover:bg-gray-300 text-black rounded p-2 mt-2 transition-colors">Ver Detalhes</button>
            </div>
        `;
        sugestoesContainer.innerHTML += template;
    });
});