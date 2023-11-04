'use client'
import AlertScreen from "@/components/Alert"
import FormRegisterCliente from "@/components/FormRegisterCliente";
import FormRegisterConductor from "@/components/FormRegisterConductor";
import { useGlobalState } from "@/hooks/useGlobalState"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Col, Container, Row } from "react-bootstrap";

export default function RegisterPage() {

    const [isClient, setIsClient] = useState(true)

    const { user } = useGlobalState()
    const router = useRouter()

    console.log(isClient)

    const toggleClient = () => {
        setIsClient(true)
    }

    const toggleConductor = () => {
        setIsClient(false)
    }

  return (
   <>
    {
      user ? <> 
        {router.push("/dashboard")}
      </>
      :  <Container className="py-4">
      <Row>
          <Col>
          </Col>
          <Col>
              <p className="text-muted text-center">Selecciona el tipo de registro</p>
              <Row className="d-flex flex-row align-items-center">
              <div className="btn-group mb-2" role="group" aria-label="Basic example">
                  <button type="button" className={`btn ${isClient ? 'btn-outline-primary' : 'btn-primary'}`} onClick={toggleConductor}>Conductor</button>
                  <button type="button" className={`btn ${!isClient ? 'btn-outline-primary' : 'btn-primary'}`} onClick={toggleClient}>Cliente</button>
              </div>
              </Row>
          </Col>
          <Col></Col>
      </Row>
        <Row>
          <Col></Col>
          <Col>
            <Container>
              {
                  isClient ? (
                      <>
                          <h2 className="text-dark fw-bold bg-info px-5 py-3 rounded text-center">Registro de Cliente</h2>

                          {/* <p className="text-secondary">Sé un nuevo cliente</p> */}
                          <FormRegisterCliente />
                      </>
                  ) : (
                      <>
                         <h2 className="text-dark fw-bold bg-info px-5 py-3 rounded text-center">Registro de Conductor</h2>
                          {/* <p className="text-secondary">Sé un nuevo conductor</p> */}
                          <FormRegisterConductor />
                      </>
                  )
              }
            </Container>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    }
   </>
  );
}
