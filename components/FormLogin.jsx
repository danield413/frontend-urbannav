"use client";
import { useGlobalState } from "@/hooks/useGlobalState"
import axios from "axios"
import { MD5 } from "crypto-js"
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const FormLogin = () => {

  const { user, setUser } = useGlobalState()

  const [idUsuario, setIdUsuario] = useState(''); 
  const [codigo2FA, setCodigo2FA] = useState(false);

  const cifrar = (cadena) => {
    const cadenaCifrada = MD5(cadena).toString();
    return cadenaCifrada;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const correo = e.target[0].value;
    const password = e.target[1].value;

    const clave = cifrar(password);

    // llamar a seguridad para verificar
    const response = await axios.post('http://localhost:3001/identificar-usuario' , {
      correo, 
      clave
    })

    setIdUsuario(response.data._id)
    setCodigo2FA(true)
    
  };

  const handleSubmit2FA = async (e) => {
    e.preventDefault();
    const codigo = e.target[0].value;

    // llamar a seguridad para verificar codigo 2fa
    const response = await axios.post('http://localhost:3001/verificar-2fa', {
      codigo2fa: codigo,
      usuarioId: idUsuario
    })

    console.log(response.data)

    const token = response.data.token
    localStorage.setItem('token', token)

    setUser(response.data)

  };

  return (
    <>
      {!codigo2FA ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Ingresa tu contraseña" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit2FA}>
          <h3 className="py-2">Autenticación de 2do Factor</h3>
          <p className="text-muted">
            Te enviamos un código, revisa tu correo.
          </p>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Ingresa el código"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Verificar
          </Button>
        </Form>
      )}
    </>
  );
};

export default FormLogin;
