# 3D Barros

Site da família de Barros, publicado em [3dbarros.com.br](https://3dbarros.com.br).
O nome é um trocadilho duplo: somos três de Barros e trabalhamos com impressão 3D.
É a casa de tudo o que nós 3 criamos: peças impressas, sites, jogos, experimentos e ideias.

## Como o site funciona

O GitHub Pages publica a raiz deste repositório. Cada pasta vira um endereço:

| Arquivo / pasta | Endereço |
| --- | --- |
| `index.html` | `3dbarros.com.br` (a home) |
| `projetos.js` | as 3 pessoas e a lista dos projetos que aparecem na home |
| `pecas/` | `3dbarros.com.br/pecas/`, a galeria das peças impressas em 3D |
| `pecas/pecas.js` | lista das peças; as fotos ficam em `pecas/fotos/` |
| `404.html` | página de endereço errado; volta para a home |
| `public/` | `3dbarros.com.br/public/` (a Nova) |

## As 3 seções

A home tem uma seção para cada um: Matheus, Rafael e André, cada um com a sua
cor. O projeto aparece na seção de quem fez, conforme o campo `quem`. Projeto
feito em família (`quem: "todos"`) entra em "Feito pelos 3".

## Peças impressas em 3D

A home tem um cartão fixo que leva à galeria em `pecas/`. Para incluir uma peça,
salve a foto em `pecas/fotos/` e acrescente um bloco em `pecas/pecas.js` (os
campos estão explicados no começo do arquivo). A galeria filtra por quem fez.

## Como adicionar um projeto

1. Crie uma pasta com o nome do projeto, sem espaço nem acento (ex.: `foguete/`),
   e salve o `index.html` dele lá dentro.
2. Abra `projetos.js`, copie um bloco `{ ... }` e troque nome, descrição, emoji,
   link (`foguete/`) e `quem` fez (`matheus`, `rafael`, `andre` ou `todos`).
   Os campos estão explicados no começo do arquivo.
3. Faça o commit. Em um ou dois minutos o cartão aparece na home.

## Regra da casa

Qualquer pessoa na internet consegue ver este repositório e o site. Nos projetos
não entra nome completo, telefone, escola, endereço, senha nem chave de API.
Chaves ficam no arquivo `.env`, que não é versionado.

## Nova

A Nova (`public/`) é uma assistente de IA. A parte visual abre direto pelo site,
mas as respostas dependem do servidor `server.mjs` rodando com uma chave do
Gemini no `.env`:

```bash
npm install
echo 'GEMINI_API_KEY=sua-chave-aqui' > .env
npm start
```
