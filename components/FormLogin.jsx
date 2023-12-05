"use client";
import { useGlobalState } from "@/hooks/useGlobalState"
import axios from "axios"
import { MD5 } from "crypto-js"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast"

const FormLogin = () => {

  const { user, setUser } = useGlobalState()
  const router = useRouter()

  const [captcha, setCaptcha] = useState(false)
  console.log(captcha)

  const onChange = (value) => {
    setCaptcha(value)
  }


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
    if (!captcha) {
      toast.error('Debes verificar que no eres un robot 😅')
      return
    }

    const clave = cifrar(password);

    toast.promise(
      axios.post('http://localhost:3001/identificar-usuario' , {
        correo, 
        clave
      }),
      {
        duration: 4000,
        loading: 'Iniciando sesión...',
        success: (res) => {
          if(res.data.message) {
            return res.data.message
          } else {
            setIdUsuario(res.data._id)
            setCodigo2FA(true)
            return 'Se ha enviado un correo electrónico con el código 😊'
          }
        },
        error: (err) => {
          console.log(err)
          return 'Error al iniciar sesión'
        }
      }
    )
  };

  const handleSubmit2FA = async (e) => {
    e.preventDefault();
    const codigo = e.target[0].value;

    toast.promise(
      axios.post('http://localhost:3001/verificar-2fa' , {
        codigo2fa: codigo,
        usuarioId: idUsuario
      }),
      {
        duration: 4000,
        loading: 'Iniciando sesión...',
        success: (res) => {
          if(res.data.message) {
            return res.data.message
          } else {
            localStorage.setItem('token', res.data.token)
            setUser({
              correo: res.data.user.correo,
              idMongoDB: res.data.user._id,
              name: res.data.usuarioLogica.primerNombre,
              role: res.data.user.rolId
            })
            return `Hola, ${res.data.usuarioLogica.primerNombre} 👋`
          }
        },
        error: (err) => {
          console.log(err)
          return 'Error al iniciar sesión'
        }
      }
    ) 
  };

  return (
    <>
      {!codigo2FA ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="text-white">Correo electrónico <strong className="text-danger">*</strong></Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="text-white">Contraseña <strong className="text-danger">*</strong></Form.Label>
            <Form.Control type="password" placeholder="Ingresa tu contraseña" />
            <ReCAPTCHA
              className="mt-3"
              sitekey="6Le0hCcpAAAAAIp7n99Yj9CokJ6uAapkCcmAfWZk"
              onChange={onChange}
            />,
          </Form.Group>

          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit2FA}>
          <h3 className="py-2 text-dark bg-white px-2 py-3 text-center rounded fw-bold">Autenticación de segundo factor</h3>
          <p className="text-white">
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
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
    </>
  );
};

export default FormLogin;
