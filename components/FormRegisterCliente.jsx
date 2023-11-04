"use client";
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast"

const FormRegisterCliente = () => {

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();

    const correo = e.target.correo.value;
    const primerNombre = e.target.primerNombre.value;
    const segundoNombre = e.target.segundoNombre.value;
    const primerApellido = e.target.primerApellido.value;
    const segundoApellido = e.target.segundoApellido.value;
    const celular = e.target.celular.value;
    const correoPanico = e.target.correoPanico.value;
    const fechaNacimiento = `${e.target.fechaNacimiento.value}T19:25:30.199Z`;
    const urlFoto = ''
    const descripcion = ''
    const clave = ''
    const estado = 'ACTIVO'

    console.log(fechaNacimiento)

    const data = {
      correo,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      celular,
      correoPanico,
      fechaNacimiento,
      urlFoto,
      descripcion,
      clave,
      estado
    }

    // llamar a seguridad para registrar cliente
    toast.promise(
      axios.post('http://localhost:3001/usuario/cliente', data),
      {
        duration: 4000,
        loading: 'Registrando cliente...',
        success: (res) => {
          if(res.data.message) {
            return res.data.message
          } else {
            //reset form
            e.target.reset()
            return 'Cliente registrado correctamente 😊, se te envió un correo de bienvenida con tu clave.'
          }
        },
        error: (err) => {
          console.log(err)
          return 'Error al registrar cliente'
        }
      }
    )

  }

  return (
    <>
    <Form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Correo electrónico <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Primer nombre <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="text"
          name="primerNombre"
          placeholder="Primer nombre"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">Segundo nombre</label>
        <Form.Control
          type="text"
          name="segundoNombre"
          placeholder="Segundo nombre"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Primer apellido <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="text"
          name="primerApellido"
          placeholder="Primer apellido"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">Segundo apellido</label>

        <Form.Control
          type="text"
          name="segundoApellido"
          placeholder="Segundo apellido"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Celular <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" placeholder="Celular" name="celular" required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Correo de pánico <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="email"
          placeholder="Correo de pánico"
          name="correoPanico"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Fecha de nacimiento <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="date" name="fechaNacimiento" required/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrarse
      </Button>
    </Form>

    <Toaster
    position="bottom-left"
    reverseOrder={false}
    />
    </>
  );
};

export default FormRegisterCliente;
