// Configuração da rede do modo "cada um no seu celular".
//
// Com supabaseUrl e supabaseAnon preenchidos, as duas pontas conversam pelo Realtime do
// Supabase (canal de broadcast + presença, sem tabela nenhuma): é o caminho estável.
// Em branco, o jogo tenta a ligação direta pelo PeerJS, que depende do servidor
// público 0.peerjs.com — e ele caiu nos dois primeiros testes (2026-10-25).
//
// A chave anon é pública por desenho (vai para o navegador de todo mundo). A
// service_role NUNCA entra aqui.
window.DUELO_REDE = {
  supabaseUrl: "",
  supabaseAnon: ""
};
