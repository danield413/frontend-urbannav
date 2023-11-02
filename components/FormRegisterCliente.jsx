"use client";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const FormRegisterCliente = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

    const correo = e.target.correo.value;
    const primerNombre = e.target.primerNombre.value;
    const segundoNombre = e.target.segundoNombre.value;
    const primerApellido = e.target.primerApellido.value;
    const segundoApellido = e.target.segundoApellido.value;
    const celular = e.target.celular.value;
    const correoPanico = e.target.correoPanico.value;
    const fechaNacimiento = e.target.fechaNacimiento.value;
    const urlFoto = ''
    const descripcion = ''
    const clave = ''
    const estado = 'ACTIVO'

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
    

  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Correo electrónico <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="email"
          name="correo"
          placeholder="Tu correo electrónico"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Primer Nombre <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="text"
          name="primerNombre"
          placeholder="Primer Nombre"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">Segundo Nombre</label>
        <Form.Control
          type="text"
          name="segundoNombre"
          placeholder="Segundo Nombre"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Primer Apellido <strong className="text-danger">*</strong>
        </label>
        <Form.Control
          type="text"
          name="primerApellido"
          placeholder="Primer Apellido"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">Segundo Apellido</label>

        <Form.Control
          type="text"
          name="segundoApellido"
          placeholder="Segundo Apellido"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Celular <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" placeholder="Celular" name="celular" required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
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
        <label htmlFor="tipoDocumento">
          Fecha de nacimiento <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="date" name="fechaNacimiento" required/>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrarse
      </Button>
    </Form>
  );
};

export default FormRegisterCliente;
