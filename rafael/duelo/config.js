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
  supabaseUrl: "https://tozovgjsgvwbqqzxxwdi.supabase.co",
  supabaseAnon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvem92Z2pzZ3Z3YnFxenh4d2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzg0NTEsImV4cCI6MjEwODUxNDQ1MX0.yjE2Np9i77gZSAr_P6KeZk7zULfyeei-U7mgeASKDYg"
};
