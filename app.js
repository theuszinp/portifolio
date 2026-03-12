document.addEventListener('DOMContentLoaded', () => {
  
  // ================= 1. PRELOADER (TELA DE CÓDIGO TIPO TERMINAL) =================
  const preloader = document.getElementById('code-preloader');
  
  if (preloader) {
    // Verifica se o usuário já viu a animação nesta sessão do navegador
    if (sessionStorage.getItem('preloaderVisivel')) {
      // Se já viu, esconde o terminal imediatamente e inicia o site normal
      preloader.style.display = 'none';
      iniciarAnimacoesScroll(); 
    } else {
      // Se for a primeira vez, trava o scroll da página enquanto o código digita
      document.body.style.overflow = 'hidden';
      const textElement = document.getElementById('typing-text');
      
      // O código que será "digitado" na tela como se fosse você programando
      const codeLines = [
        "<span class='code-comment'>// Inicializando ambiente Matheus_OS v2.0...</span>",
        "<span class='code-keyword'>const</span> developer = {",
        "  name: <span class='code-string'>'Matheus Souza Dantas'</span>,",
        "  role: <span class='code-string'>'Engenheiro de Software & Analista de TI'</span>,",
        "  skills: [<span class='code-string'>'JS'</span>, <span class='code-string'>'Python'</span>, <span class='code-string'>'Infra'</span>, <span class='code-string'>'SaaS'</span>],",
        "  status: <span class='code-string'>'Compilando soluções...'</span>",
        "};",
        "<span class='code-comment'>// Módulos carregados com sucesso. [OK]</span>",
        "<span class='code-function'>renderPortfolio</span>(developer); <span class='cursor'></span>"
      ];

      let currentLine = 0;

      function showNextLine() {
        if (currentLine < codeLines.length) {
          // Digita a linha atual
          textElement.innerHTML += codeLines[currentLine] + (currentLine < codeLines.length - 1 ? "<br>" : "");
          currentLine++;
          
          // Tempo de digitação entre cada linha (300 milissegundos)
          setTimeout(showNextLine, 300); 
        } else {
          // Terminou de digitar tudo, espera 1 segundo e some com a tela preta
          setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Libera o scroll para o usuário rolar a página
            sessionStorage.setItem('preloaderVisivel', 'true'); // Salva que ele já viu a animação
            iniciarAnimacoesScroll(); // Faz os cards do site aparecerem
          }, 1000);
        }
      }
      
      // Começa a digitar depois de meio segundo que a página carrega
      setTimeout(showNextLine, 500); 
    }
  } else {
    // Se não tiver o preloader na página (ex: página de contato), inicia direto
    iniciarAnimacoesScroll();
  }

  // ================= 2. ANIMAÇÃO DE ROLAGEM (SCROLL REVEAL) =================
  function iniciarAnimacoesScroll() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Anima apenas uma vez
        }
      });
    }, { 
      threshold: 0.1, // Dispara quando 10% do elemento estiver visível
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ================= 3. FORMULÁRIO DE CONTATO (INTEGRAÇÃO NODE.JS) =================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Impede o recarregamento da página
      
      const formNotice = document.getElementById('formNotice');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      
      // Coleta os dados do formulário
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // Estado de carregamento
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando mensagem...';
      formNotice.textContent = '';

      try {
        // Envia para o seu servidor Node.js (porta 3000 por padrão)
        const response = await fetch('http://localhost:3000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          formNotice.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
          formNotice.style.color = 'var(--success)';
          contactForm.reset(); // Limpa o formulário
        } else {
          throw new Error('Falha na resposta do servidor');
        }

      } catch (error) {
        console.error('Erro:', error);
        formNotice.textContent = 'Ocorreu um erro ao enviar. Tente novamente ou me chame nas redes.';
        formNotice.style.color = 'var(--accent)';
      } finally {
        // Restaura o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensagem';
      }
    });
  }
});