const fs = require('fs').promises;
const path = require('path');

// Configuração expandida das lojas
const LOJAS_CONFIG = {
    // Lojas principais (afiliadas)
    amazon: {
        domain: 'amazon.com.br',
        searchQuery: 'site:amazon.com.br inurl:dp',
        isMainStore: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    },
    magalu: {
        domain: 'magazineluiza.com.br',
        searchQuery: 'site:magazineluiza.com.br inurl:p/',
        isMainStore: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Referer': 'https://www.magazineluiza.com.br'
        }
    },
    mercadolivre: {
        domain: 'mercadolivre.com.br',
        searchQuery: 'site:mercadolivre.com.br inurl:MLB',
        isMainStore: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
    },
    // Shopee placeholder
    shopee: {
        domain: 'shopee.com.br',
        searchQuery: '',
        isMainStore: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)',
            'Accept': 'text/html,application/xhtml+xml'
        }
    },
    // Lojas para ancoragem (mais caras)
    casasbahia: {
        domain: 'casasbahia.com.br',
        searchQuery: 'site:casasbahia.com.br inurl:produto',
        isMainStore: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
    },
    americanas: {
        domain: 'americanas.com.br',
        searchQuery: 'site:americanas.com.br/produto',
        isMainStore: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
    },
    pontofrio: {
        domain: 'pontofrio.com.br',
        searchQuery: 'site:pontofrio.com.br inurl:produto',
        isMainStore: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
    }
};

// Store-specific scrapers aprimorados
const storeParsers = {
    amazon: async (url) => {
        try {
            const response = await fetch(url, {
                headers: LOJAS_CONFIG.amazon.headers
            });
            const html = await response.text();
            
            // Extrai informações detalhadas
            const priceMatch = html.match(/R\$\s*(\d+[.,]\d{2})/);
            const deliveryMatch = html.match(/Receba até ([^<]+)/);
            const promoMatch = html.match(/Economia de R\$\s*(\d+[.,]\d{2})/);
            
            if (!priceMatch) return null;
            
            return {
                preco: parseFloat(priceMatch[1].replace(',', '.')),
                entrega: deliveryMatch ? deliveryMatch[1].trim() : null,
                promocao: promoMatch ? parseFloat(promoMatch[1].replace(',', '.')) : null
            };
        } catch (error) {
            console.error('Error parsing Amazon:', error.message);
            return null;
        }
    },

    magalu: async (url) => {
        try {
            // Handle search URL vs product URL
            const isSearchUrl = url.includes('/busca/');
            if (isSearchUrl) {
                const response = await fetch(url, {
                    headers: LOJAS_CONFIG.magalu.headers
                });
                const html = await response.text();
                
                // Extract first product URL from search results
                const productUrlMatch = html.match(/href="(https:\/\/www\.magazineluiza\.com\.br\/[^"]+)"/);
                if (productUrlMatch) {
                    url = productUrlMatch[1];
                } else {
                    return null;
                }
            }

            const response = await fetch(url, {
                headers: LOJAS_CONFIG.magalu.headers
            });
            const html = await response.text();
            
            // Multiple price patterns
            const pricePatterns = [
                /"price":(\d+[.,]\d{2})/,
                /data-price="(\d+[.,]\d{2})"/,
                /R\$\s*(\d+[.,]\d{2})/
            ];
            
            let price = null;
            for (const pattern of pricePatterns) {
                const match = html.match(pattern);
                if (match) {
                    const potentialPrice = parseFloat(match[1].replace(',', '.'));
                    // Validate price range for Stanley cup
                    if (potentialPrice >= 80 && potentialPrice <= 300) {
                        price = potentialPrice;
                        break;
                    }
                }
            }
            
            if (!price) return null;
            
            return {
                preco: price,
                entrega: html.includes('Frete Grátis') ? 'Frete Grátis' : null,
                promocao: html.includes('OFF') || html.includes('desconto')
            };
        } catch (error) {
            console.error('Error parsing Magalu:', error.message);
            return null;
        }
    },

    mercadolivre: async (url) => {
        try {
            const response = await fetch(url, {
                headers: LOJAS_CONFIG.mercadolivre.headers
            });
            const html = await response.text();
            
            // Try multiple price patterns
            const pricePatterns = [
                /"price":\s*"(\d+[.,]\d{2})"/,
                /class="andes-money-amount__fraction"[^>]*>(\d+)/,
                /"price":(\d+[.,]\d{2})/,
                /R\$\s*(\d+[.,]\d{2})/
            ];
            
            let price = null;
            for (const pattern of pricePatterns) {
                const match = html.match(pattern);
                if (match) {
                    const potentialPrice = parseFloat(match[1].replace(',', '.'));
                    // Validate price range for Stanley cup (between 80 and 300)
                    if (potentialPrice >= 80 && potentialPrice <= 300) {
                        price = potentialPrice;
                        break;
                    }
                }
            }
            
            if (!price) return null;
            
            return {
                preco: price,
                entrega: null,
                promocao: html.includes('OFF') || html.includes('desconto')
            };
        } catch (error) {
            console.error('Error parsing Mercado Livre:', error.message);
            return null;
        }
    }
};

async function buscarProdutoGoogleShopping(nomeProduto) {
    const API_KEY = 'AIzaSyB8cWLg4upDwom6p0SWahxVVnKJ9TO-Dzw';
    const CX = 'b052ec2502282449b';
    
    console.log(`\n🔍 Buscando "${nomeProduto}" nas lojas...`);
    
    try {
        const resultado = {
            lojas_afiliadas: [],
            lojas_caras: [],
            melhor_preco: null,
            pior_preco: null
        };

        // Busca em paralelo com delay entre requisições
        const buscas = Object.entries(LOJAS_CONFIG).map(async ([loja, config], index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1500));
            
            if (loja === 'shopee') {
                return {
                    loja,
                    titulo: 'Shopee - Manual Input Required',
                    preco: null,
                    entrega: null,
                    promocao: null,
                    link: null
                };
            }
            
            const query = `${nomeProduto} ${config.searchQuery}`;
            const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (!data.items?.[0]) return null;

                const productUrl = data.items[0].link;
                const parser = storeParsers[loja];
                if (!parser) {
                    // Para lojas sem parser específico, retorna dados básicos
                    return {
                        loja,
                        titulo: data.items[0].title,
                        preco: null,
                        entrega: null,
                        promocao: null,
                        link: productUrl
                    };
                }

                const details = await parser(productUrl);
                if (!details) return null;

                return {
                    loja,
                    titulo: data.items[0].title,
                    ...details,
                    link: addAffiliateId(productUrl, loja)
                };
            } catch (error) {
                console.error(`❌ Erro ao buscar ${loja}:`, error.message);
                return null;
            }
        });

        const resultados = await Promise.all(buscas);
        
        // Garante que todas as lojas estejam representadas
        Object.entries(LOJAS_CONFIG).forEach(([loja, config]) => {
            const found = resultados.find(r => r?.loja === loja);
            
            if (config.isMainStore) {
                resultado.lojas_afiliadas.push(found || {
                    loja,
                    titulo: `${loja} - Produto não encontrado`,
                    preco: null,
                    entrega: null,
                    promocao: null,
                    link: null
                });
            } else {
                resultado.lojas_caras.push(found || {
                    loja,
                    titulo: `${loja} - Produto não encontrado`,
                    preco: null,
                    entrega: null,
                    promocao: null,
                    link: null
                });
            }
        });

        // Ordena por preço (quando disponível)
        resultado.lojas_afiliadas.sort((a, b) => {
            if (a.preco === null) return 1;
            if (b.preco === null) return -1;
            return a.preco - b.preco;
        });
        
        resultado.lojas_caras.sort((a, b) => {
            if (a.preco === null) return 1;
            if (b.preco === null) return -1;
            return b.preco - a.preco;
        });

        resultado.melhor_preco = resultado.lojas_afiliadas.find(r => r.preco !== null) || null;
        resultado.pior_preco = resultado.lojas_caras.find(r => r.preco !== null) || null;

        // Salva resultados
        await salvarResultados(nomeProduto, resultado);

        return resultado;

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
        return null;
    }
}

// Helper Functions
const AFILIADOS = {
    amazon: 'tag=presentepe016-20',
    magalu: 'utm_source=opresenteperfeit',
    mercadolivre: 'utm_source=presenteperfeito'
};

function addAffiliateId(url, store) {
    if (!AFILIADOS[store]) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${AFILIADOS[store]}`;
}

async function salvarResultados(nomeProduto, resultado) {
    const produtosPath = path.join(__dirname, 'produtos.js');
    let produtosAtuais = {};
    
    try {
        const fileContent = await fs.readFile(produtosPath, 'utf8');
        const jsonContent = fileContent
            .replace('const PRODUTOS_CONFIG = ', '')
            .replace(/;$/, '');
        produtosAtuais = JSON.parse(jsonContent);
    } catch (error) {
        console.log('⚠️ Criando novo arquivo produtos.js...');
    }

    produtosAtuais[nomeProduto.toLowerCase().replace(/\s+/g, '-')] = resultado;
    
    await fs.writeFile(
        produtosPath,
        `const PRODUTOS_CONFIG = ${JSON.stringify(produtosAtuais, null, 2)};`
    );

    console.log('✅ Resultados salvos com sucesso!');
}

// Main function pra testar
async function main() {
    console.log('🚀 Iniciando busca...');
    const resultado = await buscarProdutoGoogleShopping('Copo Stanley para cerveja 473ml');
    console.log('\n✨ Resultado final:', JSON.stringify(resultado, null, 2));
}

// Roda a função main
main().catch(console.error);

// Exporta para uso
module.exports = { buscarProdutoGoogleShopping };