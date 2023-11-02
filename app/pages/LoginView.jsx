'use client'

import FormLogin from "@/components/FormLogin"
import { useGlobalState } from "@/hooks/useGlobalState"
import { Col, Container, Row } from "react-bootstrap"

const LoginView = () => {

  const { user } = useGlobalState()
 
  return (
    <>
          {
            user ? <h1>Estas logueado! felicidades</h1>
            :  <Container>
            <Row>
              <Col></Col>
              <Col className="py-4 d-flex  flex-column justify-content-center align-items-center">
                <h1 className="text-white bg-dark p-2 rounded">Inicio de sesión</h1>
                <p className="text-muted">Como Cliente o Conductor</p>
                <FormLogin/>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          }
    </>
  )
}

export default LoginView