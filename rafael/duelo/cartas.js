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
//  Os valores foram calculados para não haver empate em nenhum poder e para
//  as cartas comuns somarem quase o mesmo. Se mudar um número, confira se ele
//  não repete o de outra carta no mesmo poder.
// ============================================================

const PODERES = ["Fogo", "Velocidade", "Força", "Tamanho", "Esperteza"];

const CARTAS = [
  { nome: "Pesadelo Monstruoso", classe: "Fogo", poderes: [71, 56, 22, 56, 67], imagem: "pesadelo-monstruoso.jpg", painel: [0.571, 0.915] },
  { nome: "Cinzão", classe: "Fogo", poderes: [90, 12, 67, 82, 22], imagem: "" },
  { nome: "Lava Viva", classe: "Fogo", poderes: [82, 48, 52, 67, 19], imagem: "" },
  { nome: "Fagulha", classe: "Fogo", poderes: [98, 30, 90, 26, 26], imagem: "" },
  { nome: "Forno", classe: "Fogo", poderes: [78, 19, 48, 71, 52], imagem: "" },
  { nome: "Nadder Mortal", classe: "Maré", poderes: [67, 90, 44, 33, 33], imagem: "nadder-mortal.jpg", painel: [0.532, 0.911] },
  { nome: "Marujo", classe: "Maré", poderes: [74, 26, 86, 44, 37], imagem: "" },
  { nome: "Espuma", classe: "Maré", poderes: [59, 22, 26, 78, 82], imagem: "" },
  { nome: "Coral", classe: "Maré", poderes: [15, 33, 78, 52, 90], imagem: "" },
  { nome: "Abissal", classe: "Maré", poderes: [37, 44, 82, 94, 15], imagem: "" },
  { nome: "Gronckle", classe: "Pedra", poderes: [22, 67, 71, 59, 48], imagem: "gronckle.jpg", painel: [0.574, 0.926] },
  { nome: "Granito", classe: "Pedra", poderes: [41, 82, 94, 15, 41], imagem: "" },
  { nome: "Seixo", classe: "Pedra", poderes: [48, 78, 37, 19, 86], imagem: "" },
  { nome: "Cascalho", classe: "Pedra", poderes: [56, 71, 41, 90, 12], imagem: "" },
  { nome: "Montanha", classe: "Pedra", poderes: [12, 59, 74, 98, 30], imagem: "" },
  { nome: "Faísca", classe: "Raio", poderes: [19, 37, 12, 12, 98], papel: "terror", imagem: "" },
  { nome: "Zíper Horripilante", classe: "Raio", poderes: [30, 52, 98, 22, 71], imagem: "ziper-horripilante.jpg", painel: [0.550, 0.917] },
  { nome: "Relâmpago", classe: "Raio", poderes: [33, 86, 33, 37, 78], imagem: "" },
  { nome: "Centelha", classe: "Raio", poderes: [44, 94, 15, 63, 56], imagem: "" },
  { nome: "Cortador de Tempestades", classe: "Raio", poderes: [94, 15, 30, 86, 44], imagem: "cortador-de-tempestades.jpg", painel: [0.586, 0.934] },
  { nome: "Banguela", classe: "Noite", poderes: [86, 98, 56, 41, 94], papel: "alfa", imagem: "banguela.jpg", painel: [0.530, 0.910] },
  { nome: "Sombra", classe: "Noite", poderes: [63, 41, 59, 30, 74], imagem: "" },
  { nome: "Fúria da Luz", classe: "Noite", poderes: [26, 74, 63, 48, 59], imagem: "furia-da-luz.jpg", painel: [0.549, 0.920] },
  { nome: "Eclipse", classe: "Noite", poderes: [52, 63, 19, 74, 63], imagem: "" }
];
