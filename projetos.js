// ============================================================
//  LISTA DOS PROJETOS QUE APARECEM NA HOME (index.html)
// ============================================================
//
//  Para colocar um projeto novo no site:
//    1. Crie uma pasta com o nome do projeto (sem espaço nem acento),
//       por exemplo "foguete/", e salve o index.html dele lá dentro.
//    2. Copie um bloco { ... } abaixo, cole no fim da lista e troque
//       os valores. Não esqueça a vírgula entre um bloco e outro.
//    3. Salve e faça o commit. Em um ou dois minutos o projeto
//       aparece em https://3dbarros.com.br
//
//  Campos de cada projeto:
//    nome       - título que aparece no cartão
//    descricao  - uma ou duas frases contando o que é
//    emoji      - um emoji (ou símbolo) que representa o projeto
//    link       - a pasta do projeto ("foguete/") ou um endereço completo
//    quem       - quem fez (opcional). Use apelido, nunca nome completo.
//    quando     - mês/ano em que foi feito (opcional)
//    cor        - "coral", "sol" ou "mar" (opcional; muda a cor do cartão)
//
//  Regra da casa: nada de nome completo, telefone, escola ou endereço.
//  Tudo o que está aqui pode ser visto por qualquer pessoa na internet.
// ============================================================

const PROJETOS = [
  {
    nome: "Nova",
    descricao: "Uma assistente de IA que conversa, muda de humor conforme o papo e lê as respostas em voz alta.",
    emoji: "✦",
    link: "public/",
    quando: "2026",
    cor: "mar"
  }
];
