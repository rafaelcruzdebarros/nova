// ============================================================
//  AS PESSOAS E OS PROJETOS QUE APARECEM NA HOME (index.html)
// ============================================================
//
//  Primeiro vêm as três pessoas da casa. Cada uma tem uma seção no
//  site, com a sua cor. Pode trocar a "frase" por algo seu, tipo
//  "Gosto de foguetes e de Minecraft." (deixe "" para não mostrar).
//
//  Depois vem a lista de projetos. Para colocar um projeto novo:
//    1. Crie uma pasta com o nome do projeto (sem espaço nem acento),
//       por exemplo "foguete/", e salve o index.html dele lá dentro.
//    2. Copie um bloco { ... } da lista PROJETOS, cole no fim e troque
//       os valores. Não esqueça a vírgula entre um bloco e outro.
//    3. Salve e faça o commit. Em um ou dois minutos o projeto
//       aparece em https://3dbarros.com.br, na seção de quem fez.
//
//  Campos de cada projeto:
//    nome       - título que aparece no cartão
//    descricao  - uma ou duas frases contando o que é
//    emoji      - um emoji (ou símbolo) que representa o projeto
//    link       - a pasta do projeto ("foguete/") ou um endereço completo
//    quem       - "matheus", "rafael", "andre" ou "todos" (feito em família)
//    quando     - mês/ano em que foi feito (opcional)
//    cor        - "coral", "sol" ou "mar" (opcional; se não puser,
//                 o cartão usa a cor de quem fez)
//
//  Regra da casa: só primeiro nome ou apelido. Nada de nome completo,
//  idade, telefone, escola ou endereço. Tudo o que está aqui pode ser
//  visto por qualquer pessoa na internet.
// ============================================================

const PESSOAS = [
  { id: "matheus", nome: "Matheus", papel: "o pai",              cor: "coral", frase: "" },
  { id: "rafael",  nome: "Rafael",  papel: "o irmão mais velho", cor: "sol",   frase: "" },
  { id: "andre",   nome: "André",   papel: "o irmão mais novo",  cor: "mar",   frase: "" }
];

const PROJETOS = [
  {
    nome: "Nova",
    descricao: "Uma assistente de IA que conversa, muda de humor conforme o papo e lê as respostas em voz alta.",
    emoji: "✦",
    link: "public/",
    quem: "rafael",
    quando: "2026"
  },

  // Jogo de cartas do Rafael (rafael/duelo/). As cartas ficam em rafael/duelo/cartas.js.
  {
    nome: "Duelo de Dragões",
    descricao: "Jogo de cartas com 24 dragões e cinco poderes. Dois jogadores no mesmo aparelho.",
    emoji: "🐉",
    link: "rafael/duelo/",
    quem: "rafael",
    quando: "10/2026"
  },

  // Desafios de lógica do Matheus (matheus/desafios/). Cada link abre um desafio direto.
  {
    nome: "Travessias",
    descricao: "Três níveis: o fazendeiro com o lobo, a ovelha e o capim; a família no barco; e os lobos com as ovelhas.",
    emoji: "🛶",
    link: "matheus/desafios/#rio",
    quem: "matheus",
    quando: "10/2026"
  },
  {
    nome: "Sudoku",
    descricao: "Grades de 4×4, 6×6 e 9×9, sempre novas, com dica e conferência.",
    emoji: "🔢",
    link: "matheus/desafios/#sudoku",
    quem: "matheus",
    quando: "10/2026"
  },
  {
    nome: "Torre de Hanói",
    descricao: "Mova a torre inteira, um disco por vez, sem pôr um maior sobre um menor.",
    emoji: "🗼",
    link: "matheus/desafios/#hanoi",
    quem: "matheus",
    quando: "10/2026"
  },
  {
    nome: "Diversos",
    descricao: "A ponte e a lanterna, as rãs saltadoras, os jarros de água e o Resta 1. Ainda sem categoria.",
    emoji: "🧩",
    link: "matheus/desafios/#diversos",
    quem: "matheus",
    quando: "10/2026"
  },
  {
    nome: "Charadas de lógica",
    descricao: "Dezesseis perguntas que enganam quem responde rápido demais.",
    emoji: "💡",
    link: "matheus/desafios/#charadas",
    quem: "matheus",
    quando: "10/2026"
  },

  // Jogos do Arcade do André (andre/arcade/). Cada link abre um jogo direto.
  {
    nome: "Tênis",
    descricao: "Partida contra a CPU: mouse, toque, teclado ou controle. Vence quem fizer 3 games.",
    emoji: "🎾",
    link: "andre/arcade/#s-tenis",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Jogo da Velha",
    descricao: "Contra a CPU ou duas pessoas no mesmo aparelho.",
    emoji: "❌",
    link: "andre/arcade/#s-velha",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Memória",
    descricao: "Vire as cartas e ache os pares.",
    emoji: "🧠",
    link: "andre/arcade/#s-mem",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Circuito Mortal 2K",
    descricao: "Corrida em neon, com suporte a gamepad.",
    emoji: "🏎️",
    link: "andre/arcade/#s-circ",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Soccer Star",
    descricao: "Futebol para 1 ou 2 jogadores.",
    emoji: "🥅",
    link: "andre/arcade/#s-soccer",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Hóquei de Mesa",
    descricao: "Air hockey contra a CPU ou em dupla, no mesmo aparelho.",
    emoji: "🏒",
    link: "andre/arcade/#s-hoquei",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Basquete",
    descricao: "Puxe como um estilingue e arremesse. Cesta limpa vale 3. Você tem 60 segundos.",
    emoji: "🏀",
    link: "andre/arcade/#s-basq",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Vôlei",
    descricao: "Contra a CPU ou em dupla, no mesmo aparelho. Quem fizer 7 pontos vence.",
    emoji: "🏐",
    link: "andre/arcade/#s-volei",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Atletismo 100 m",
    descricao: "Espere o \"JÁ!\" e alterne os lados o mais rápido que puder. Sozinho ou em dupla.",
    emoji: "🏃",
    link: "andre/arcade/#s-atl",
    quem: "andre",
    quando: "10/2026"
  },
  {
    nome: "Luta",
    descricao: "Soco e defesa contra a CPU, no teclado ou na tela.",
    emoji: "🥊",
    link: "andre/arcade/#s-luta",
    quem: "andre",
    quando: "10/2026"
  }
];
