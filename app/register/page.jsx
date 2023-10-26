import FormRegisterCliente from "@/components/FormRegisterCliente"
import FormRegisterConductor from "@/components/FormRegisterConductor"
import {  Col, Container, Row } from "react-bootstrap"

export default function RegisterPage () {
    return(
        <Container className="py-4">
        <Row>
            <Col>
                <Container>
                    <h2>Registro como cliente</h2>
                    <FormRegisterCliente />
                </Container>
            </Col>
            <Col>
            <Container>
                    <h2>Registro como conductor</h2>
                    <FormRegisterConductor />
                </Container>
            </Col>
        </Row>
        </Container>
    )
}