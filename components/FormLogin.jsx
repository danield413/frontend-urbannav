'use client'
import { Button, Col, Container, Form, Row } from "react-bootstrap"

const FormLogin = () => {
  return (
    <Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Enter email" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    
    <Button variant="primary" type="submit">
        Iniciar sesión
    </Button>
    </Form>
  )
}

export default FormLogin