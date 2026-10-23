// ============================================================
//  AS CARTAS DO DUELO DE DRAGÕES (rafael/duelo/index.html)
// ============================================================
//
//  Cada carta tem:
//    nome     - o nome do dragão
//    classe   - "Fogo", "Maré", "Pedra", "Raio" ou "Noite" (define a cor)
//    poderes  - cinco números de 1 a 100, nesta ordem:
//               Fogo, Velocidade, Força, Tamanho, Esperteza
//    papel    - "alfa" (ganha de todas, menos do terror) ou
//               "terror" (só ganha do alfa). As outras não têm papel.
//    imagem   - nome do arquivo em rafael/duelo/imagens/: a CARTA INTEIRA, como o Rafael
//               montou (proporção 2:3, 560×840). O jogo usa a imagem de fundo e desenha
//               por cima só o painel com os cinco poderes e os números deste arquivo,
//               cobrindo os atributos impressos na imagem.
//    painel   - onde fica o painel de atributos na imagem, em fração da altura
//               [topo, base] (ex.: [0.530, 0.910]): é ali que o jogo põe os poderes.
//               Medido em cada carta; sem ele vale [0.55, 0.92].
//               Deixe imagem "" enquanto não tiver carta: o jogo desenha uma moldura
//               própria, com o símbolo da classe no lugar do dragão.
//
//  Os valores foram calculados (out/2026, segunda versão) para a escolha não ser
//  automática: nenhum poder empata entre duas cartas; em quase toda carta a melhor
//  opção e a segunda têm chance parecida de vencer (a diferença fica abaixo de 10
//  pontos percentuais), e só três cartas comuns têm um poder que vence sempre, com
//  dois ou três poderes fracos para compensar. Cada poder tem a PRÓPRIA escala —
//  Fogo vai de 42 a 96, Tamanho de 24 a 90 —, então um 70 de Fogo é mediano e um
//  70 de Tamanho é forte: quem joga aprende isso com as partidas. Se mudar um
//  número, confira se ele não repete o de outra carta no mesmo poder.
// ============================================================

const PODERES = ["Fogo", "Velocidade", "Força", "Tamanho", "Esperteza"];

const CARTAS = [
  { nome: "Pesadelo Monstruoso", classe: "Fogo", poderes: [51, 41, 85, 71, 61], imagem: "pesadelo-monstruoso.jpg", painel: [0.571, 0.915] },
  { nome: "Cinzão", classe: "Fogo", poderes: [70, 79, 45, 37, 81], imagem: "" },
  { nome: "Lava Viva", classe: "Fogo", poderes: [79, 47, 80, 43, 55], imagem: "" },
  { nome: "Fagulha", classe: "Fogo", poderes: [60, 50, 70, 58, 64], imagem: "" },
  { nome: "Forno", classe: "Fogo", poderes: [91, 86, 39, 62, 36], imagem: "" },
  { nome: "Nadder Mortal", classe: "Maré", poderes: [47, 30, 94, 87, 70], imagem: "nadder-mortal.jpg", painel: [0.532, 0.911] },
  { nome: "Marujo", classe: "Maré", poderes: [48, 82, 72, 30, 84], imagem: "" },
  { nome: "Espuma", classe: "Maré", poderes: [76, 64, 55, 51, 51], imagem: "" },
  { nome: "Coral", classe: "Maré", poderes: [54, 78, 49, 53, 78], imagem: "" },
  { nome: "Abissal", classe: "Maré", poderes: [62, 74, 53, 47, 68], imagem: "" },
  { nome: "Gronckle", classe: "Pedra", poderes: [73, 61, 58, 49, 54], imagem: "gronckle.jpg", painel: [0.574, 0.926] },
  { nome: "Granito", classe: "Pedra", poderes: [64, 71, 51, 45, 75], imagem: "" },
  { nome: "Seixo", classe: "Pedra", poderes: [45, 92, 92, 24, 86], imagem: "" },
  { nome: "Cascalho", classe: "Pedra", poderes: [86, 36, 74, 84, 39], imagem: "" },
  { nome: "Montanha", classe: "Pedra", poderes: [82, 43, 67, 39, 72], imagem: "" },
  { nome: "Faísca", classe: "Raio", poderes: [42, 33, 42, 34, 88], papel: "terror", imagem: "" },
  { nome: "Zíper Horripilante", classe: "Raio", poderes: [69, 39, 81, 80, 41], imagem: "ziper-horripilante.jpg", painel: [0.550, 0.917] },
  { nome: "Relâmpago", classe: "Raio", poderes: [66, 54, 61, 55, 59], imagem: "" },
  { nome: "Centelha", classe: "Raio", poderes: [89, 68, 91, 28, 37], imagem: "" },
  { nome: "Cortador de Tempestades", classe: "Raio", poderes: [96, 90, 36, 90, 33], imagem: "cortador-de-tempestades.jpg", painel: [0.586, 0.934] },
  { nome: "Banguela", classe: "Noite", poderes: [94, 88, 89, 76, 76], papel: "alfa", imagem: "banguela.jpg", painel: [0.530, 0.910] },
  { nome: "Sombra", classe: "Noite", poderes: [59, 55, 76, 68, 49], imagem: "" },
  { nome: "Fúria da Luz", classe: "Noite", poderes: [57, 58, 78, 74, 44], imagem: "furia-da-luz.jpg", painel: [0.549, 0.920] },
  { nome: "Eclipse", classe: "Noite", poderes: [80, 48, 65, 66, 46], imagem: "" }
];
