'use client'
import { Button, Col, Container, Form, Row } from "react-bootstrap"

const FormRegisterConductor = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const correo = e.target.correo.value;
    const clave = ''
    const primerNombre = e.target.primerNombre.value;
    const segundoNombre = e.target.segundoNombre.value;
    const primerApellido = e.target.primerApellido.value;
    const segundoApellido = e.target.segundoApellido.value;
    const celular = e.target.celular.value;
    const urlFoto = ''
    const estado = 'ACTIVO'
    const fechaNacimiento = e.target.fechaNacimiento.value;
    const documentoIdentidad = e.target.documentoIdentidad.value;
    const estadoServicio = 'NO DISPONIBLE'
    const placa = e.target.placa.value;
    const marca = e.target.marca.value;
    const modelo = e.target.modelo.value;
    const soat = e.target.soat.value;
    const tecno = e.target.tecno.value;
    const barrioId = 1; //*<-- barrio por defecto

    const data = {
      correo,
      clave,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      celular,
      urlFoto,
      estado,
      fechaNacimiento,
      documentoIdentidad,
      estadoServicio,
      placa,
      marca,
      modelo,
      soat,
      tecno,
      barrioId
    }

    // llamar a seguridad para registrar cliente

  }

  return (
    <Form>
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
          Fecha de nacimiento <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="date" name="fechaNacimiento" required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Documento de identidad <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="documentoIdentidad" required placeholder="Documento de identidad"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Placa del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="placa" required placeholder="Placa"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Marca del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="marca" required placeholder="Marca"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Modelo del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="modelo" required placeholder="Soat"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Soat del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="soat" required placeholder="Modelo"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento">
          Tecnomecánica del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="tecno" required placeholder="Tecnomecánica"/>
      </Form.Group>

    <Button variant="primary" type="submit">
        Registrarse
    </Button>
    </Form>
  )
}

export default FormRegisterConductor