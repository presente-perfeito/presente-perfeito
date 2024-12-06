// Mapeamento dos links da Kirvano
const KIRVANO_LINKS = {
    'pai': {
        'basic': 'https://pay.kirvano.com/88beabdd-ecfe-43e3-aaa5-7f52c988d359',
        'premium': 'https://pay.kirvano.com/ab33d7f1-1a05-491f-a4f6-2d88b0bfb7d3'
    },
    'mae': {
        'basic': 'https://pay.kirvano.com/81db8e35-627c-48f6-9781-70ed9396743d',
        'premium': 'https://pay.kirvano.com/fd27bc07-4525-4f80-ab81-8230663c5aad'
    },
    'filho': {
        'basic': 'https://pay.kirvano.com/6bd63918-cd32-4d42-919b-ae70632517b4',
        'premium': 'https://pay.kirvano.com/29ec5e37-242d-42ba-ab45-7779ad3751a8'
    },
    'filha': {
        'basic': 'https://pay.kirvano.com/4cba14da-8b0a-465f-a1e5-47de7179ddf8',
        'premium': 'https://pay.kirvano.com/057b8b8a-dd39-4b24-9c60-fcd931c46539'
    },
    'namorado': {
        'basic': 'https://pay.kirvano.com/a0f2f3b0-53c8-4dc8-985d-f2716e67719a',
        'premium': 'https://pay.kirvano.com/fa1656d9-213f-423d-8b2b-e8371f404d5d'
    },
    'namorada': {
        'basic': 'https://pay.kirvano.com/2968bb3d-009f-46da-8613-a74f5289117f',
        'premium': 'https://pay.kirvano.com/c2dc917f-afa9-4aba-8330-d62e8f8802b2'
    }
};

// Handler do form
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Pega os valores do form
    const paraQuem = document.querySelector('select[name="para-quem"]').value;
    const orcamento = document.querySelector('select[name="orcamento"]').value;
    
    // Determina se é basic ou premium baseado no orçamento
    const plano = parseInt(orcamento) <= 200 ? 'basic' : 'premium';
    
    // Pega o link correto
    const link = KIRVANO_LINKS[paraQuem][plano];
    
    
    document.body.appendChild(loadingOverlay);
    
    // Redireciona após 2 segundos (simulando processamento da IA)
    setTimeout(() => {
        window.location.href = link;
    }, 2000);
}

// Adiciona o handler ao form quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
});