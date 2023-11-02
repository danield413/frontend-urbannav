'use client'
import FormRegisterCliente from "@/components/FormRegisterCliente";
import FormRegisterConductor from "@/components/FormRegisterConductor";
import { useState } from "react"
import { Col, Container, Row } from "react-bootstrap";

export default function RegisterPage() {

    const [isClient, setIsClient] = useState(true)

    console.log(isClient)

    const toggleClient = () => {
        setIsClient(!isClient)
    }

  return (
    <Container className="py-4">
    <Row>
        <Col>
        </Col>
        <Col>
            <p className="text-muted text-center">Selecciona el tipo de registro</p>
            <Row className="d-flex flex-row align-items-center">
            <div className="btn-group mb-2" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-primary" onClick={toggleClient}>Cliente</button>
                <button type="button" className="btn btn-primary" onClick={toggleClient}>Conductor</button>
            </div>
            </Row>
        </Col>
        <Col></Col>
    </Row>
      <Row>
        <col></col>
        <Col>
          <Container>
            {
                isClient ? (
                    <>
                        <h2 className="text-white bg-dark p-2 rounded">Registro Cliente</h2>
                        <p className="text-muted">Sé un nuevo cliente</p>
                        <FormRegisterCliente />
                    </>
                ) : (
                    <>
                        <h2 className="text-white bg-dark p-2 rounded">Registro Conductor</h2>
                        <p className="text-muted">Sé un nuevo conductor</p>
                        <FormRegisterConductor />
                    </>
                )
            }
          </Container>
        </Col>
        <col></col>
      </Row>
    </Container>
  );
}
