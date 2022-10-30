import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="actions-buttons">
        <Button variant="primary" className="m-2" onClick={() => navigate('/login')}>
          Entrar
        </Button>
        <Button variant="primary" className="m-2" onClick={() => navigate('/register')}>
          Registrar
        </Button>
      </div>
    </>
  )
}