import { useState, useEffect } from 'react';

function FormularioAviso({ avisoEmEdicao, setAvisoEmEdicao, setAvisos }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');


  useEffect(() => {
    if (avisoEmEdicao) {
      setTitle(avisoEmEdicao.title);
      setBody(avisoEmEdicao.body);
      setErroValidacao('');
    } else {
      setTitle('');
      setBody('');
    }
  }, [avisoEmEdicao]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErroValidacao('');



    if (!title.trim() || !body.trim()) {
      setErroValidacao('Preencha o título e o texto antes de publicar.');
      return;
    }

    if (avisoEmEdicao) {

      try {
        if (avisoEmEdicao.criadoLocalmente) {
          setAvisos(antigos => antigos.map(item => item.id === avisoEmEdicao.id
            ? { ...item, title, body }
            : item));
          setAvisoEmEdicao(null);
          setTitle('');
          setBody('');
          return;
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${avisoEmEdicao.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: avisoEmEdicao.id,
            userId: 1,
            title: title,
            body: body
          })
        });

        if (!response.ok) throw new Error();

        const dadosAtualizados = await response.json();
        setAvisos(antigos => antigos.map(item => item.id === avisoEmEdicao.id ? dadosAtualizados : item));
        setAvisoEmEdicao(null);
        setTitle('');
        setBody('');
      } catch (err) {
        setErroValidacao('Erro ao salvar alteração na API. Tente novamente.');
      }


    } else {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1,
            title: title,
            body: body
          })
        });


        
        if (!response.ok) throw new Error();

        const novoAviso = await response.json();
        setAvisos(antigos => [{ ...novoAviso, criadoLocalmente: true }, ...antigos]);
        setTitle('');
        setBody('');
      } catch (err) {
        setErroValidacao('Erro ao publicar aviso na API. Tente novamente.');
      }
    }
  }

  function handleCancelar() {
    setAvisoEmEdicao(null);
    setTitle('');
    setBody('');
    setErroValidacao('');
  }

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h3>{avisoEmEdicao ? 'Editar aviso' : 'Novo aviso'}</h3>
      
      {erroValidacao && <p className="alerta-validacao">{erroValidacao}</p>}

      <div className="campo">
        <label htmlFor="title">Título</label>
        <input 
          type="text" 
          id="title"
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="titulo do aviso"
        />
      </div>

      <div className="campo">
        <label htmlFor="body">Texto do aviso</label>
        <textarea 
          id="body"
          rows="5"
          value={body} 
          onChange={(e) => setBody(e.target.value)}
          placeholder="descrição tuff"
        />
      </div>

      <div className="acoes-form">
        <button type="submit" className="btn-principal">
          {avisoEmEdicao ? 'Salvar' : 'Publicar aviso'}
        </button>
        {avisoEmEdicao && (
          <button type="button" onClick={handleCancelar} className="btn-secundario">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioAviso;
