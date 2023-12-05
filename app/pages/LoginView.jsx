'use client'

import FormLogin from "@/components/FormLogin"
import { useGlobalState } from "@/hooks/useGlobalState"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Col, Container, Row } from "react-bootstrap"
import Swal from "sweetalert2"
const LoginView = () => {

  const { user } = useGlobalState()
  const router = useRouter()


  const recuperarContrasena = () => {
    Swal.fire({
      title: 'Recuperar contraseña',
      html:
        '<input id="swal-input2" class="swal2-input" placeholder="Correo electrónico">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input2')).value,
        ];
      },
    }).then(async(result) => {
      if (result.isConfirmed){
        const correo = result.value[0]
        const response = await axios.post('http://localhost:3001/recuperar-clave', { correo })
        if(response.data.message) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha enviado un correo electrónico con tu nueva contraseña'
          })
        }
        
      }
    })
  }
 
  return (
    <>
          {
            user ? <>
              {router.push("/dashboard")}
             </>
            :  <Container>
            <Row>
              <Col></Col>
              <Col className="py-4 d-flex  flex-column justify-content-center align-items-center">
                <h1 className="text-dark fw-bold bg-warning px-4 py-3 rounded">Inicio de sesión</h1>
                <p className="text-white">Como Cliente o Conductor</p>
                <FormLogin/>
                <button className="btn btn-link text-white" onClick={recuperarContrasena}>¿Olvidaste tu contraseña?</button>

              </Col>
              <Col></Col>
            </Row>
          </Container>
          }

    </>
  )
}

export default LoginView