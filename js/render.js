console.log('=== DEBUG RENDER.JS ===');
console.log('PRODUTOS_CONFIG:', window.PRODUTOS_CONFIG);
console.log('URL params:', new URLSearchParams(window.location.search).get('id'));


document.addEventListener('DOMContentLoaded', () => {
    try {
        // Captura ID do produto da URL
        const produtoId = new URLSearchParams(window.location.search).get('id');
        if (!produtoId) {
            throw new Error('ID do produto não encontrado na URL');
        }

        // Busca configuração do produto
        const produto = window.PRODUTOS_CONFIG[produtoId];
        if (!produto) {
            throw new Error(`Produto ${produtoId} não encontrado`);
        }

        // Renderiza informações básicas
        document.title = `${produto.titulo} | Gênio dos Presentes IA`;
        
        // Atualiza título com destaque para categoria
        const atualizaTitulo = () => {
            const titulo = document.querySelector('h1');
            if (titulo && produto.categoria) {
                titulo.innerHTML = `LOCALIZEI UM DESCONTO DE <span id="headline-economia" class="text-yellow-400 overflow-hidden"></span> NO PRESENTE PERFEITO PARA <span class="text-yellow-400 overflow-hidden">${produto.categoria.toUpperCase()}</span>!`;
            }
        };

        atualizaTitulo();


        // Produto Principal
        const prodPrincipal = produto.produtoPrincipal;
        
        // Reviews
        document.getElementById('review-score').textContent = `${prodPrincipal.reviews.media}/5`;
        document.getElementById('review-total').textContent = 
            `(${prodPrincipal.reviews.total.toLocaleString()} avaliações)`;
        


        // Renderiza review em destaque
        const renderReviewDestaque = () => {
            if (prodPrincipal.reviews.destaque) {
                const { texto, autor } = prodPrincipal.reviews.destaque;
                
                // Atualiza texto e autor
                document.getElementById('review-texto').textContent = texto;
                document.getElementById('review-autor').textContent = autor;
                
                // Pega a primeira letra do nome para o avatar
                document.getElementById('review-avatar').textContent = autor.charAt(0);
            }
        };

        renderReviewDestaque();

        // Nome do produto
        const produtoNome = document.getElementById('produto-nome');
        if (produtoNome) {
            produtoNome.textContent = prodPrincipal.nome;
        }

        // Benefícios do produto
        const beneficiosContainer = document.getElementById('produto-beneficios');
        if (beneficiosContainer && prodPrincipal.beneficios) {
            beneficiosContainer.innerHTML = prodPrincipal.beneficios
                .filter(beneficio => !beneficio.includes('Entrega Expressa'))
                .map(beneficio => `
                    <span class="flex items-center gap-2">
                        ${beneficio}
                    </span>
                `).join('');
        }

        // Carrega imagem do produto corretamente
        const produtoImagem = document.getElementById('produto-imagem');
        if (produtoImagem && prodPrincipal.imagem) {
            produtoImagem.src = prodPrincipal.imagem;
            produtoImagem.alt = prodPrincipal.nome;
            produtoImagem.onerror = function() {
                console.error('Falha ao carregar imagem:', this.src);
                // Opcional: Define uma imagem de fallback
                this.src = '/caminho/para/imagem/padrao.jpg';
            };
        }


        // ------------------------------------------------------------------------------------------------------------

        // Preços Shopee
        const precoShopee = prodPrincipal.precos.shopee;
        document.getElementById('preco-promo').textContent = formatarPreco(precoShopee.promo);
        document.getElementById('preco-normal').textContent = formatarPreco(precoShopee.normal);
        document.getElementById('desconto').textContent = 
            `-${calcularDesconto(precoShopee.normal, precoShopee.promo)}%`;
        
        // Comparativo de Preços
        renderComparativoPrecos(prodPrincipal.precos);
        
        // Sugestões
        renderSugestoes(produto.sugestoes);
        
        // Inicia contador
        iniciarContador();
        
    } catch (error) {
        console.error('Erro na renderização:', error);
        document.body.innerHTML = `
            <div class="p-8 text-center">
                <h1 class="text-2xl font-bold mb-4">Ops! Algo deu errado 😅</h1>
                <p class="text-gray-300">${error.message}</p>
            </div>
        `;
    }
});

function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function calcularDesconto(normal, promo) {
    return Math.round(((normal - promo) / normal) * 100);
}

function renderComparativoPrecos(precos) {
    const container = document.getElementById('comparativo-precos');
    if (!container) return;

    const lojas = Object.entries(precos)
        .filter(([loja]) => loja !== 'shopee')
        .sort((a, b) => a[1].promo - b[1].promo);

    lojas.forEach(([loja, preco]) => {
        container.innerHTML += `
            <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="capitalize font-medium">${loja}</span>
                <div class="space-x-3">
                    <span class="text-gray-400 line-through">
                        ${formatarPreco(preco.normal)}
                    </span>
                    <span class="font-bold">
                        ${formatarPreco(preco.promo)}
                    </span>
                    <span class="text-sm text-gray-500">${preco.extra}</span>
                </div>
            </div>
        `;
    });
}

function renderSugestoes(sugestoes) {
    const container = document.getElementById('sugestoes');
    if (!container) return;

    container.innerHTML = '';

    // Função pra gerar número aleatório de unidades (entre 3 e 12)
    const getRandomUnits = () => Math.floor(Math.random() * 10) + 3;

    sugestoes.forEach(item => {
        container.innerHTML += `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg relative">
                <!-- Badge de desconto ajustado -->
                <div class="absolute -top-2 -right-2 bg-red-600 text-white px-4 py-2 rounded-full transform rotate-12 z-10">
                    <div class="text-sm font-bold whitespace-nowrap">-${calcularDesconto(item.precos.normal, item.precos.promo)}%</div>
                    <div class="text-xs text-center">OFF</div>
                </div>
                
                <!-- Unidades restantes aleatórias -->
                <div class="absolute top-3 left-3 bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold">
                    Últimas ${getRandomUnits()} unidades!
                </div>
                
                <!-- Container da imagem ajustado -->
                <div class="w-full h-72 bg-white flex items-center justify-center p-6  overflow-hidden">
                    <img src="${item.imagem}" 
                         alt="${item.nome}" 
                         class="w-full h-full object-contain"
                         onerror="this.src='/api/placeholder/400/320'"/>
                </div>
                
                <!-- Resto do card -->
                <div class="p-4 bg-white">
                    <h4 class="font-bold text-lg mb-2 text-gray-800">${item.nome}</h4>
                    <div class="flex items-center mb-3">
                        <span class="text-yellow-400">${'★'.repeat(Math.round(item.reviews.media))}</span>
                        <span class="text-sm text-gray-600 ml-2">(${item.reviews.total.toLocaleString()})</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <div>
                            <span class="text-gray-400 line-through block">
                                R$ ${item.precos.normal.toFixed(2).replace('.', ',')}
                            </span>
                            <span class="text-2xl font-bold text-red-600">
                                R$ ${item.precos.promo.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <a href="${item.link}" 
                           target="_blank" 
                           class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
                            Comprar
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

function iniciarContador() {
    const countdown = document.getElementById('countdown');
    const promoTimer = document.getElementById('timer'); // Timer da promoção
    let tempo = 9800; // 3 horas em segundos

    const atualizarContador = () => {
        const horas = Math.floor(tempo / 3600);
        const minutos = Math.floor((tempo % 3600) / 60);
        const segundos = tempo % 60;

        const tempoFormatado = `${String(horas).padStart(2, '0')}:${
            String(minutos).padStart(2, '0')}:${
            String(segundos).padStart(2, '0')}`;

        // Atualiza os dois timers
        if (countdown) countdown.textContent = tempoFormatado;
        if (promoTimer) promoTimer.textContent = tempoFormatado;

        if (tempo > 0) {
            tempo--;
            setTimeout(atualizarContador, 1000);
        }
    };

    atualizarContador();
}