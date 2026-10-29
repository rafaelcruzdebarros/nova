# Nova — a IA pelo Google Apps Script

O site é estático e não pode guardar a chave do Gemini. O `Code.gs` desta pasta
roda no Google Apps Script, guarda a chave e responde ao site. É o mesmo desenho
do IAgo do MAPA.

## Publicar (uma vez)

1. Pegue uma chave do Gemini em [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   (conta Google normal; o plano gratuito basta para a família).
2. Abra [script.google.com](https://script.google.com) › **Novo projeto**. Apague o
   conteúdo de `Code.gs` e cole o `Code.gs` desta pasta. Dê um nome ao projeto (ex.: Nova).
3. Engrenagem (**Configurações do projeto**) › **Propriedades do script** › Adicionar
   ao menos uma chave:
   - `ANTHROPIC_API_KEY` = chave da API do Claude (ver "Usar o Claude" abaixo)
   - `GEMINI_API_KEY` = a chave do passo 1
   - `CLAUDE_MODEL` / `GEMINI_MODEL` = nome do modelo (opcionais; os padrões estão no topo do `Code.gs`)
   - `LIMITE_DIA` e `LIMITE_DIA_TOTAL` = mensagens por pessoa e por todos, por dia (opcionais)

   Com as duas chaves, o Claude responde e o Gemini é a reserva quando o Claude falha.
4. **Implantar** › **Nova implantação** › tipo **Aplicativo da web**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Autorize quando pedir (é a sua conta chamando o Gemini e as propriedades).
5. Copie a **URL do aplicativo da web** (termina em `/exec`) e cole em
   `public/config.js`, no campo `NOVA_API_URL`. Publique o site.

Para conferir: abra a URL no navegador; deve aparecer `{"ok":true,"nova":"no ar",...}`.

## Usar o Claude

A assinatura do claude.ai não inclui a API: ela é cobrada por uso, com crédito
pré-pago, em [console.anthropic.com](https://console.anthropic.com).

1. Crie a conta no console (pode ser o mesmo e-mail), vá em **Billing** e compre
   um crédito inicial (o mínimo é pequeno; para uma família dura meses).
2. Em **API Keys**, crie uma chave e copie.
3. No Apps Script, crie a propriedade `ANTHROPIC_API_KEY` com ela e publique
   uma **nova versão** (Gerenciar implantações › editar › Nova versão).

Modelo: o padrão é `claude-opus-5-5`. Para gastar menos, crie `CLAUDE_MODEL`
com `claude-sonnet-5-5` ou `claude-haiku-5-5`. Preço por milhão de tokens
(entrada / saída) em out/2026: Opus 5.5 US$ 4 / 20; Sonnet 5.5 US$ 2 / 10;
Haiku 5.5 US$ 0,10 / 0,50. Uma mensagem de chat gasta por volta de 1.500 tokens
de entrada e 300 de saída.

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
