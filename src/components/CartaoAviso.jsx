import { useState } from 'react';

function CartaoAviso({ aviso, setAvisos, setAvisoEmEdicao }) {
  const [erroExclusao, setErroExclusao] = useState('');

  async function handleExcluir() {
    let copiaAvisosOriginais;
    setErroExclusao('');
    

    setAvisos((antigos) => {
      copiaAvisosOriginais = [...antigos];
      return antigos.filter(item => item.id !== aviso.id);
    });

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${aviso.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error();
    } catch {

      setAvisos(copiaAvisosOriginais);
      setErroExclusao('Não foi possível excluir este aviso na API. Tente novamente.');
    }
  }

  return (
    <div className="cartao-aviso">
      <h4>{aviso.title}</h4>
      <p className="corpo-aviso">{aviso.body}</p>
      
      <div className="metadados">
        post id {aviso.id} · publicado pelo usuário {aviso.userId || 1}
      </div>

      {erroExclusao && <p className="alerta-validacao" style={{ margin: '10px 0' }}>⚠️ {erroExclusao}</p>}

      <div className="acoes-cartao">
        <button onClick={() => setAvisoEmEdicao(aviso)} className="btn-secundario">
          Editar
        </button>
        <button onClick={handleExcluir} className="btn-excluir">
          Excluir
        </button>
      </div>
    </div>
  );
}

export default CartaoAviso;
