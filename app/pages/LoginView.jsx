'use client'

import FormLogin from "@/components/FormLogin"
import { useGlobalState } from "@/hooks/useGlobalState"
import { useRouter } from "next/navigation"
import { Col, Container, Row } from "react-bootstrap"

const LoginView = () => {

  const { user } = useGlobalState()
  const router = useRouter()
 
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
              </Col>
              <Col></Col>
            </Row>
          </Container>
          }

    </>
  )
}

export default LoginView