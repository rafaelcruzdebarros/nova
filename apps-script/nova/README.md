# Nova — a IA pelo Google Apps Script

O site é estático e não pode guardar a chave do Gemini. O `Code.gs` desta pasta
roda no Google Apps Script, guarda a chave e responde ao site. É o mesmo desenho
do IAgo do MAPA.

## Publicar (uma vez)

1. Pegue uma chave do Gemini em [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   (conta Google normal; o plano gratuito basta para a família).
2. Abra [script.google.com](https://script.google.com) › **Novo projeto**. Apague o
   conteúdo de `Code.gs` e cole o `Code.gs` desta pasta. Dê um nome ao projeto (ex.: Nova).
3. Engrenagem (**Configurações do projeto**) › **Propriedades do script** › Adicionar:
   - `GEMINI_API_KEY` = a chave do passo 1 (obrigatória)
   - `GEMINI_MODEL` = nome do modelo (opcional; o padrão está no topo do `Code.gs`)
   - `LIMITE_DIA` e `LIMITE_DIA_TOTAL` = mensagens por pessoa e por todos, por dia (opcionais)
4. **Implantar** › **Nova implantação** › tipo **Aplicativo da web**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Autorize quando pedir (é a sua conta chamando o Gemini e as propriedades).
5. Copie a **URL do aplicativo da web** (termina em `/exec`) e cole em
   `public/config.js`, no campo `NOVA_API_URL`. Publique o site.

Para conferir: abra a URL no navegador; deve aparecer `{"ok":true,"nova":"no ar",...}`.

## Atualizar o código depois

Cole o `Code.gs` novo e vá em **Implantar › Gerenciar implantações › (lápis) ›
Versão: Nova versão › Implantar**. Isso mantém a URL. Uma **nova implantação** gera
outra URL e o site para de responder até trocar o `config.js`.

## O que fica onde

| o quê | onde |
|---|---|
| chave do Gemini | só nas Propriedades do script; nunca no repositório |
| URL do Apps Script | `public/config.js` (pública; é o endereço, não a chave) |
| prompt da Nova e regras | `Code.gs` (constante `SISTEMA`) |
| cota diária | propriedade `COTA`, zerada a cada dia |

A URL é pública, então qualquer um que a descubra pode mandar mensagens; a cota
diária (por pessoa e total) é o que impede de esgotar a chave. Se um dia precisar,
gere uma chave nova no AI Studio e troque a propriedade: o site não muda.
