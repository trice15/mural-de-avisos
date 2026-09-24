import { useState, useEffect } from 'react';
import ListaAvisos from './components/ListaAvisos';
import FormularioAviso from './components/FormularioAviso';
import './App.css';

function App() {
  const [avisos, setAvisos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [avisoEmEdicao, setAvisoEmEdicao] = useState(null);


  useEffect(() => {
    const controller = new AbortController();
    
    async function carregarAvisos() {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Não foi possível conectar à API.');
        }

        const dados = await response.json();
        setAvisos(dados);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível conectar à API. Verifique sua conexão.');
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarAvisos();

    return () => controller.abort();
  }, []);

  return (
    <div className="container">
      <header className="cabecalho">
        <h1>Mural de Avisos</h1>
        <p className="subtitulo">avisos e recados da turma</p>
      </header>

      <main className="conteudo-principal">
        <section className="coluna-esquerda">
          <FormularioAviso 
            avisoEmEdicao={avisoEmEdicao} 
            setAvisoEmEdicao={setAvisoEmEdicao}
            setAvisos={setAvisos}
          />
        </section>

        <section className="coluna-direita">
          <h3>Avisos publicados ({avisos.length})</h3>
          

          {carregando && <p className="status-mensagem">Carregando avisos...</p>}
          
          {erro && <div className="faixa-erro">{erro}</div>}
          
          {!carregando && !erro && avisos.length === 0 && (
            <p className="status-mensagem">Nenhum aviso publicado, tipo errrr tipo han tipo nada ave.</p>
          )}

          {!carregando && !erro && (
            <ListaAvisos 
              avisos={avisos} 
              setAvisos={setAvisos} 
              setAvisoEmEdicao={setAvisoEmEdicao}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
