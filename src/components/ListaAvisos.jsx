import CartaoAviso from './CartaoAviso';

function ListaAvisos({ avisos, setAvisos, setAvisoEmEdicao }) {
  return (
    <div className="lista-avisos">
      {avisos.map((aviso) => (
        <CartaoAviso 
        key={aviso.id} 
        aviso={aviso} 
        setAvisos={setAvisos} 
        setAvisoEmEdicao={setAvisoEmEdicao}
        />
      ))}
    </div>
  );
}

export default ListaAvisos;
