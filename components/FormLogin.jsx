'use client'
import { Button, Col, Container, Form, Row } from "react-bootstrap"

const FormLogin = () => {

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value

    //verify
    if (email === '') {
      alert('Ingresa tu correo electrónico')
    } 
    if (password === '') {
      alert('Ingresa tu contraseña')
    }

    //login

  }

  return (
    <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Ingresa tu correo electrónico" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Ingresa tu contraseña" />
    </Form.Group>
    
    <Button variant="primary" type="submit">
        Iniciar sesión
    </Button>
    </Form>
  )
}

export default FormLogin