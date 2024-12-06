// produtos.js
const PRODUTOS_CONFIG = {
    "pai-basico": {
        meta: {
            titulo: "🏆 Presentes que Fazem Seu Pai se Sentir o Cara!",
            subtitulo: "Seu pai merece algo especial. Selecionamos presentes que vão fazer ele se sentir o REI DA PARADA TODA!",
            categoria: "Pai",
            faixa: "Até R$200",
            foco: "Qualidade e Praticidade",
            stats: {
                aprovacao: "97% dos pais AMARAM",
                vendas: "Mais vendidos 2024"
            }
        },
        produtoPrincipal: {
            nome: "Kit Churrasco Profissional Premium",
            imagem: "https://http2.mlstatic.com/D_NQ_NP_827771-MLB53541344075_012023-O.webp",
            avaliacoes: {
                nota: 4.9,
                total: 2847,
                vendidos: 742
            },
            reviews: [{
                autor: "João Carlos",
                iniciais: "JC",
                nota: 5,
                texto: "Meu pai AMOU! Qualidade absurda, muito melhor que o kit antigo dele. Recomendo demais!"
            }],
            beneficios: [
                "Kit PROFISSIONAL - Seu pai vai se sentir o mestre do churrasco!",
                "Inclui maleta personalizada pra guardar tudo organizado",
                "Perfeito pra ele mostrar pros amigos no próximo churrasco",
                "Garantia vitalícia - Qualidade que seu pai merece"
            ],
            lojas: {
                shopee: {
                    logo: "https://i.pinimg.com/736x/6a/48/38/6a48383706628e554f2205d07eeb445b.jpg",
                    nome: "Shopee",
                    precoOriginal: 298.90,
                    precoAtual: 179.90,
                    reviews: 1200,
                    nota: 5,
                    frete: "Cupom: -R$20",
                    link: "SEU_LINK_SHOPEE"
                },
                amazon: {
                    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFAId7phKs2LKGR8e1PKzyPQ6Zea6Dt_Fg9w&s",
                    nome: "Amazon",
                    precoOriginal: 349.90,
                    precoAtual: 189.90,
                    reviews: 832,
                    nota: 5,
                    frete: "Frete Grátis Prime",
                    link: "SEU_LINK_AMAZON"
                },
                magalu: {
                    logo: "https://s.zst.com.br/prod/cupons/2518-Logo-200x200.png",
                    nome: "Magalu",
                    precoOriginal: 327.90,
                    precoAtual: 199.90,
                    reviews: 654,
                    nota: 4,
                    frete: "+ R$15,90 frete",
                    link: "SEU_LINK_MAGALU"
                },
                woodbull: {
                    logo: "https://storage.trustvox.com.br/trustvox-core-production-uploads/uploads/store/photo/109823/ced94289c1.png",
                    nome: "Woodbull Steak",
                    precoOriginal: 359.90,
                    precoAtual: 359.90,
                    frete: "+ R$19,90 frete",
                    link: "#"
                },
                google: {
                    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQhvp11zrBXdxtnZd5k-4tiROx4ZYwWtutJQ&s",
                    nome: "Google Shopping",
                    precoAtual: 369.90,
                    subtitulo: "Média de preços"
                }
            }
        },
        sugestoes: [{
            nome: "Porta-Ferramentas Organizador Portátil",
            imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_621303-CBT75276485994_032024-F.webp",
            precoOriginal: 159.90,
            precoAtual: 89.90,
            reviews: 432,
            nota: 4
        },
        {
            nome: "Kit Cuidados Masculinos",
            imagem: "https://hyperapharma.vteximg.com.br/arquivos/ids/160303-1000-1000/1000043600174-20220329-010411.jpg?v=637841795842500000",
            precoOriginal: 189.90,
            precoAtual: 129.90,
            reviews: 298,
            nota: 5
        }]
    },
    "pai-premium": {
        meta: {
            titulo: "🎁 Presentes PREMIUM que vão Impressionar seu Pai!",
            subtitulo: "Selecionamos os presentes mais EXCLUSIVOS pra fazer seu pai se sentir um verdadeiro REI!",
            categoria: "Pai",
            faixa: "Premium",
            foco: "Exclusividade e Sofisticação",
            stats: {
                aprovacao: "99% dos pais AMARAM",
                vendas: "Top 10 Presentes 2024"
            }
        },
        produtoPrincipal: {
            nome: "Adega Climatizada Philco Premium 12 Garrafas",
            imagem: "https://m.media-amazon.com/images/I/61zK+PSbVLL._AC_SX522_.jpg",
            avaliacoes: {
                nota: 4.8,
                total: 1245,
                vendidos: 328
            },
            reviews: [{
                autor: "Roberto Silva",
                iniciais: "RS",
                nota: 5,
                texto: "Presente ESPETACULAR! Meu pai ficou sem palavras. Qualidade absurda, instalação super fácil!"
            }],
            beneficios: [
                "Controle digital de temperatura",
                "Design sofisticado em inox escovado",
                "Iluminação interna em LED azul",
                "Prateleiras removíveis"
            ],
            lojas: {
                amazon: {
                    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFAId7phKs2LKGR8e1PKzyPQ6Zea6Dt_Fg9w&s",
                    nome: "Amazon",
                    precoOriginal: 1299.90,
                    precoAtual: 899.90,
                    reviews: 632,
                    nota: 5,
                    frete: "Frete Grátis Prime",
                    link: "SEU_LINK_AMAZON"
                }
                // ... outras lojas seguem mesmo padrão
            }
        },
        sugestoes: [{
            nome: "Kit Ferramentas Profissional 160 Peças",
            imagem: "https://m.media-amazon.com/images/I/81e5BrXmeML._AC_SL1500_.jpg",
            precoOriginal: 599.90,
            precoAtual: 459.90,
            reviews: 875,
            nota: 5
        },
        {
            nome: "Relógio Smartwatch Premium",
            imagem: "https://m.media-amazon.com/images/I/61SSVxTSs5L._AC_SL1500_.jpg",
            precoOriginal: 799.90,
            precoAtual: 549.90,
            reviews: 1432,
            nota: 4
        }]
    }
    // ... outros produtos seguem o mesmo padrão
    // mae-basico, mae-premium, filho-basico, etc.
};
