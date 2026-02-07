# Revisão OAB 2ª Fase – Direito Civil

Uma aplicação voltada para revisão completa da 2ª fase da OAB (Direito Civil), com foco em peças processuais, procedimentos especiais, recursos e fundamentos. A ideia é oferecer um conteúdo organizado e prático, com modelos comentados e uma experiência de estudo clara e eficiente.

## 🎯 Objetivo

Centralizar todo o material essencial para a prova prático-profissional em **Direito Civil**, permitindo que o estudante revise rapidamente:

- **Peças processuais** cobradas na 2ª fase;
- **Procedimentos especiais** e seus requisitos;
- **Recursos cabíveis** e fundamentos;
- **Modelos comentados** de peças com explicação passo a passo.

## ✅ Conteúdo que a aplicação deve ter

### 1) Peças Processuais
- Lista completa de peças possíveis na 2ª fase; 
- Estrutura padrão (endereçamento, fatos, fundamentos, pedidos, etc.);
- Dicas sobre erros comuns.

### 2) Procedimentos Especiais
- Rol de procedimentos previstos no CPC;
- Hipóteses de cabimento;
- Requisitos essenciais;
- Principais artigos-base.

### 3) Recursos
- Recursos cabíveis na esfera cível;
- Prazo, preparo e requisitos;
- Fundamentos legais;
- Exemplos de uso na prática.

### 4) Modelos Comentados
- Modelos completos de peças;
- Explicações em cada etapa;
- Destaque para fundamentos jurídicos aplicáveis.

## 🧭 Estrutura sugerida da navegação

- **Home** → visão geral e filtros rápidos
- **Peças** → lista de peças com busca
- **Procedimentos Especiais** → agrupado por tema
- **Recursos** → com filtros por hipótese e prazo
- **Modelos** → peças comentadas passo a passo
- **Simulados** → espaço para treinar com questões e correção guiada

## ✨ O MVP já entrega

- Navegação por categorias (peças, procedimentos, recursos e modelos).
- Cards interativos com busca rápida.
- Painel de detalhes com checklist e fundamento legal.
- Favoritos salvos no navegador.
- Simulado rápido com validação básica.

## 🚀 Executar localmente

Este projeto está, por enquanto, como uma página estática para validar o layout e a experiência de estudo.

```bash
python3 -m http.server 8000
```

Depois, acesse: http://localhost:8000

## 🗂️ Onde editar conteúdo

Os dados estão no arquivo:

```
data/content.json
```

Atualize títulos, requisitos e fundamentos diretamente nesse JSON para expandir o conteúdo do MVP.

## 📌 Próximos passos

- Definir stack (ex.: Next.js + Tailwind + MDX);
- Criar arquitetura de conteúdo (peças, recursos, procedimentos);
- Estruturar banco de dados/coleções;
- Elaborar o primeiro conjunto de modelos comentados.

---

Se quiser, posso ajudar a evoluir isso para um MVP com estrutura de páginas, design system, e conteúdo inicial.
