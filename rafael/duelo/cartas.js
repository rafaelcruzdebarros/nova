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
//    imagem   - nome do arquivo em rafael/duelo/imagens/ (ex.: "brasa-real.png").
//               Deixe "" enquanto não tiver imagem: a carta mostra o símbolo da classe.
//
//  Os valores foram calculados para não haver empate em nenhum poder e para
//  as cartas comuns somarem quase o mesmo. Se mudar um número, confira se ele
//  não repete o de outra carta no mesmo poder.
// ============================================================

const PODERES = ["Fogo", "Velocidade", "Força", "Tamanho", "Esperteza"];

const CARTAS = [
  { nome: "Brasa Real", classe: "Fogo", poderes: [71, 56, 22, 56, 67], imagem: "" },
  { nome: "Cinzão", classe: "Fogo", poderes: [90, 12, 67, 82, 22], imagem: "" },
  { nome: "Lava Viva", classe: "Fogo", poderes: [82, 48, 52, 67, 19], imagem: "" },
  { nome: "Fagulha", classe: "Fogo", poderes: [98, 30, 90, 26, 26], imagem: "" },
  { nome: "Forno", classe: "Fogo", poderes: [78, 19, 48, 71, 52], imagem: "" },
  { nome: "Onda Prata", classe: "Maré", poderes: [67, 90, 44, 33, 33], imagem: "" },
  { nome: "Marujo", classe: "Maré", poderes: [74, 26, 86, 44, 37], imagem: "" },
  { nome: "Espuma", classe: "Maré", poderes: [59, 22, 26, 78, 82], imagem: "" },
  { nome: "Coral", classe: "Maré", poderes: [15, 33, 78, 52, 90], imagem: "" },
  { nome: "Abissal", classe: "Maré", poderes: [37, 44, 82, 94, 15], imagem: "" },
  { nome: "Rochedo", classe: "Pedra", poderes: [22, 67, 71, 59, 48], imagem: "" },
  { nome: "Granito", classe: "Pedra", poderes: [41, 82, 94, 15, 41], imagem: "" },
  { nome: "Seixo", classe: "Pedra", poderes: [48, 78, 37, 19, 86], imagem: "" },
  { nome: "Cascalho", classe: "Pedra", poderes: [56, 71, 41, 90, 12], imagem: "" },
  { nome: "Montanha", classe: "Pedra", poderes: [12, 59, 74, 98, 30], imagem: "" },
  { nome: "Faísca", classe: "Raio", poderes: [19, 37, 12, 12, 98], papel: "terror", imagem: "" },
  { nome: "Trovão", classe: "Raio", poderes: [30, 52, 98, 22, 71], imagem: "" },
  { nome: "Relâmpago", classe: "Raio", poderes: [33, 86, 33, 37, 78], imagem: "" },
  { nome: "Centelha", classe: "Raio", poderes: [44, 94, 15, 63, 56], imagem: "" },
  { nome: "Tempestade", classe: "Raio", poderes: [94, 15, 30, 86, 44], imagem: "" },
  { nome: "Fúria Negra", classe: "Noite", poderes: [86, 98, 56, 41, 94], papel: "alfa", imagem: "" },
  { nome: "Sombra", classe: "Noite", poderes: [63, 41, 59, 30, 74], imagem: "" },
  { nome: "Lua Nova", classe: "Noite", poderes: [26, 74, 63, 48, 59], imagem: "" },
  { nome: "Eclipse", classe: "Noite", poderes: [52, 63, 19, 74, 63], imagem: "" }
];
