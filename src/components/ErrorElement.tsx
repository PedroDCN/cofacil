import { useRouteError } from "react-router-dom";

export default function ErrorElement() {
  const error: any = useRouteError();

  // Definir várias rotas de erro
  // dependendo de erros http que acontecem nos loaders
  // se não tiver passa o erro pra o AppError retornando o erro

  return (
    <>
      <h2>Ocorreu um erro ;/</h2>
      <p>{error.message}</p>
    </>
  );
}
