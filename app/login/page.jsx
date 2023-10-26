import FormLogin from "@/components/FormLogin"
import { Col, Container, Row } from "react-bootstrap"

export default function LoginPage () {
    return(
        <Container>
        <Row>
            <Col></Col>
            <Col className="pt-2">
               <Container className="py-4">
                <h2 className="py-2">Iniciar sesión</h2>
                <FormLogin />
               </Container>
            </Col>
            <Col></Col>
        </Row>
        </Container>
    )
}