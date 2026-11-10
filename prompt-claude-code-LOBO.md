# Prompt de abertura · Claude Code · Lobo Jiu-Jitsu (LP)

## 1. Projeto
- **Pasta:** `D:\DOCUMENTOS\NovoDash\lobo-jiu-jitsu-aurora-il` `[CONFIRMAR]`
- **Rodar:** `claude --dangerously-skip-permissions`
- **Coloque na pasta antes de começar:**
  - `prd-LOBO-001.md` (raiz)
  - `reference/prototipo-aprovado-LOBO.html` (o protótipo aprovado, autocontido; abra no navegador)
  - `reference/anexo-footer-LOBO.md` (footer pôster rasgado, anexo obrigatório)
  - `public/memory/lobo-jiu-jitsu-lp-copy.md` (copy do gestor, do Slack)
- **Leia o PRD inteiro antes de qualquer código.** Depois abra o protótipo e leia o código dele inteiro: ele é a fonte da verdade visual. A tarefa é **reconstruir o protótipo em React/Vite seguindo o padrão BLACK-BELT-UX**, fiel ao que foi aprovado.

## 2. O que o Adryan pediu (nas palavras dele) → onde o PRD cobre
> Regra: se algum item abaixo não estiver coberto pelo PRD, **o item vale** e a lacuna vai para `public/memory/design-decisions.md`.

**Nível**
- "eu queria uma página no nível de um desenvolvedor sênior, cara. Um nível que tenha GSAP" → 0.4.1, 14
- "não quero que me entregue nada rápido… Não prioriza velocidade" → 0.12, 21
- "o efeito ele precisa de um propósito… Ele precisa de um porquê" → 6 (um mecanismo por seção), 8.7
- "Eu não posso te pedir… e você me entregar um modelo WordPress" → 0.4.1, 8.9

**Identidade**
- "era pra ser… branca, preta e amarela, cor de acento, pelo menos o Instagram deles é assim" → 8.2
- "Eu queria que você usasse exatamente a fonte que eles usam nos posts" → 9 (Saira 50/900)
- "o que eu mais sinto falta na Hero é uma imagem de jiu-jitsu… quem não é da academia vai entender que porra de lobo é esse" → 10/01 (foto real; lobo só no nav)
- "deixa com cor as imagens" → 8.5
- "gostei do pattern dessa seção, deixa contínuo e infinito em todo background branco com fade nas laterais" + "deixa o pattern um pouco mais discreto" → 8.5

**Seção a seção**
- Nav: "Não deixa botão no Navbar, deixa só o telefone" → 10/00
- Hero: "o texto era para ficar dentro do card com a imagem… uma coluna justificada para a esquerda… O botão nesse caso ficaria amarelo" → 10/01
- Programs: "Não sei por que só tem duas classes" · "Eu deixaria a idade… perto do nome da classe" · "Coloca só… um quadrado ali com uma flecha inclinada" · "a questão da régua… ia fazendo uma escadinha até os adultos" · "deixar branco a seção e as imagens com cor" → 10/02
- Parents: "esquerda título direita na mesma linha descrição, abaixo no centro uma mochila e na esquerda e direita esses post it" · "deixe o visual do post it mais bonito e fonte do título mais desenhada, e remova o At home & at school" · "fundo branco e a mochila maior e azul" → 10/03
- Adults: "seção de mensagens eu queria igual do Satori" · "Eu deixaria só título e descrição mesmo… e depois aparecem as mensagens" · "diagrama isso melhor" · (print) "balão em cima da headline" · "o quadrado amarelo tá muito grande" → 10/04, 0.13
- Professor: "diagrame melhor, menos informação como no Gonzales" · "deixa essa seção e a seção de cima brancas" → 10/05
- Why Lobo: "Deixa branca" · "queria interação só com hover, sem scroll" → 10/06
- Walk-in: "Gostei bastante do efeito What You See When Walking" · "o último card escrito Clean faz ele sumir quando desce a seção" · "deixaria branca e as imagens com cor" → 10/07
- First class: "Deixa branca" · "deixa a UI mais bonita como um card e a imagem fica dentro" · "deixa o 1 amarelo o 2 preto o 3 amarelo e o 4 preto… quis dizer o card, não a letra somente" · "eu deixaria o texto… um pouco mais próximo ali do número" → 10/08
- Schedule: "ao invés de amarelo deixa preto com letras amarelas e o today fica na mesma linha do dia da semana" · "o dia… today fica com as classes amarelas com baixa opacidade, eu mesmo não gostei" → 10/09
- Pricing: "Deixa branco" · "deixaria um card um pouquinho mais destacado" · "Deixa a logo preta atrás do cartão" → 10/10
- Reviews: "deixaria um fade nas laterais e o background branco" · "deixa o card do meio amarelo" → 10/11
- FAQ: "tem muita pergunta. Vê se tem algum aí que vale descartar" · "não gostei desse 01 02 03 no FAQ" · "FAQ em acordeão… centralizado em uma coluna" → 10/12
- Footer: "o que queria no footer" (Pushpin Tear Footer) · "deixa anexado no prompt quando for subir o PRD" → 10/15 + `reference/anexo-footer-LOBO.md`

**Ajustes finais (protótipo final)**
- "Embaixo do botão da Hero, tire esse texto que fica ali" → 10/01
- "Programas aprovados, seção dos parentes aprovado, seção das mensagens aprovado" → 10/02, 10/03, 10/04
- Professor: "eu queria que ela fosse tipo um background vermelho dentro de um card branco, que aí teria da onde o professor está saindo" → 10/05 (feito em amarelo, ver Seção 20)
- Schedule: "Só o dia de domingo tá com design meio feio… Deixa só um pouquinho mais organizado" → 10/09
- Pricing: "deixa a logo em amarelo no fundo. E quando o cartão fica amarelo, deixa a logo preta" → 10/10
- Reviews: "Se tiver alguma coisa para melhorar… no UI do card dos reviews pode melhorar" → 10/11
- Footer: "eu queria que ele fosse preto ao invés de amarelo a parte de cima" · "Ao invés de estar escrito lobo… embaixo tinha que ter a logo" · "dá pra usar uma logo mais bonita, dá pra organizar mais bonito… Achei o texto muito jogado" → 10/15 + anexo
- "Todos os efeitos que derem pra ser responsivos sem ser uma péssima experiência, pode deixar" → 14 (Celular)

**Regras fixas dele (valem em toda seção)**
- "toda a informação de cada seção deve caber dentro de 100vh no desktop" · "títulos de seção em no máximo 2 linhas" · "títulos sem palavra sozinha na última linha" → 7
- "páginas precisam ter scroll suave" → 0.2, 14 (Lenis)
- "LPs são landing pages, não site institucional: pouco volume de texto… hero só com headline, subheadline e botão" → 10/01, 10/05
- "reviews são sempre carrossel personalizado" · "schedule tem um padrão próprio (quadro de parede)" → 10/09, 10/11

## 3. Antes de entregar
Confira **item por item** desta lista contra o PRD e contra o protótipo (prints lado a lado em 1440 e 390). O que faltar, **corrija no PRD** e no código, e registre em `design-decisions.md`.

## 4. Como trabalhar
- **F0 primeiro:** abrir `reference/prototipo-aprovado-LOBO.html` com Playwright, ler o código e tirar prints no MEIO de cada mecanismo (1440×900, 1723×953, 390×844) em `public/memory/prints/proto-*.png`; abrir o código das referências da 0.9.
- **Modo autônomo (0.12):** construir todas as seções até o fim sem parar; sem `/v2`; sem deploy nem push.
- Fases F0 → F7 com declaração de fase (0.1.2).
- Dado que não existe: `[… — CONFIRMAR]` em `src/data`, nunca inventar (Seção 20).
- Exceção do pin (0.13): implementar as durações-alvo e registrar.
- No fim: `public/memory/entrega.md` + rodar o **finalizador** (`FIM`).

## 5. Pronto quando
A LP em React/Vite reproduz o protótipo aprovado seção por seção, com os mesmos mecanismos e a mesma identidade (branco, preto e #FAC002, Saira 50/900, fotos coloridas, padrão do lobo contínuo), e passa em 1440, 1723×953, 2560×1080 e 390 sem tela vazia nem sobreposição. O booking funciona de ponta a ponta até o CRM, com Pixel + CAPI, e o footer de pôster rasgado está implementado conforme o anexo. Zero hex ou copy no TSX, zero componente de biblioteca com estilo padrão, e `entrega.md` lista o que ficou `[CONFIRMAR]`.
