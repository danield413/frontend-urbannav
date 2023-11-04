'use client'
import axios from "axios"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"

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
    const fechaNacimiento = `${e.target.fechaNacimiento.value}T19:25:30.199Z`;
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
    toast.promise(
      axios.post('http://localhost:3001/usuario/conductor', data),
      {
        duration: 4000,
        loading: 'Registrando conductor...',
        success: (res) => {
          if(res.data.message) {
            return res.data.message
          } else {
            //reset form
            e.target.reset()
            return 'Conductor registrado correctamente 😊, se te envió un correo de bienvenida con tu clave.'
          }
        },
        error: (err) => {
          console.log(err)
          return 'Error al registrar conductor'
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
          Fecha de nacimiento <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="date" name="fechaNacimiento" required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Documento de identidad <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="documentoIdentidad" required placeholder="Documento de identidad"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Placa del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="placa" required placeholder="Placa"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Marca del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="marca" required placeholder="Marca"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Modelo del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="modelo" required placeholder="Modelo"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Soat del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="soat" required placeholder="Soat"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <label htmlFor="tipoDocumento" className="text-white">
          Tecnomecánica del vehículo <strong className="text-danger">*</strong>
        </label>
        <Form.Control type="text" name="tecno" required placeholder="Tecnomecánica"/>
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
  )
}

export default FormRegisterConductor