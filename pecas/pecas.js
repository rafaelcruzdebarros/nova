// ============================================================
//  PEÇAS IMPRESSAS EM 3D (galeria em pecas/index.html)
// ============================================================
//
//  Para colocar uma peça nova na galeria:
//    1. Tire uma foto da peça e salve na pasta "pecas/fotos/", com um
//       nome sem espaço nem acento (ex.: "suporte-celular.jpg").
//       Dica: foto só da peça, sem gente e sem o endereço de casa ao
//       fundo. Se a foto for pesada (mais de 1 MB), reduza antes.
//    2. Copie um bloco { ... } abaixo, cole no fim da lista e troque os
//       valores. Não esqueça a vírgula entre um bloco e outro.
//    3. Salve e faça o commit. Em um ou dois minutos a peça aparece
//       em https://3dbarros.com.br/pecas/
//
//  Campos de cada peça:
//    nome       - nome da peça
//    descricao  - para que serve, como foi feita, o que deu trabalho
//    foto       - caminho da foto ("fotos/suporte-celular.jpg"); pode
//                 deixar "" se ainda não tiver foto
//    quem       - "matheus", "rafael", "andre" ou "todos"
//    material   - "PLA", "PETG", "ABS", "resina"... (opcional)
//    quando     - mês/ano em que foi impressa (opcional)
//    modelo     - endereço do modelo 3D, se estiver na internet (opcional)
// ============================================================

const PECAS = [
  // Exemplo (apague as barras // para ativar):
  // {
  //   nome: "Suporte de celular",
  //   descricao: "Segura o celular na mesa. Imprimiu em duas horas.",
  //   foto: "fotos/suporte-celular.jpg",
  //   quem: "andre",
  //   material: "PLA",
  //   quando: "10/2026"
  // }
];
