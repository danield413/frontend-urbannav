'use client'
import NavTop from "@/components/NavTop"
import LoginView from "../pages/LoginView";
import { Form } from "react-bootstrap"
import axios from "axios"
import Swal from "sweetalert2"

// export const metadata = {
//   title: "UrbanNav | Inicio de sesión",
//   description: "Inicio de sesión de UrbanNav",
// };

export default function PQRSPage() {


    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target[0].value
        const email = e.target[1].value
        const message = e.target[2].value

        if(name === '' || email === '' || message === '') {
            Swal.fire({
                icon: 'error',
                title: 'Todos los campos son obligatorios',
                showConfirmButton: false,
                timer: 1500
              })
            return
        }

        const pqrsResponse = await axios.get('http://localhost:3001/variable/6531300f651aa729b8408de9')
        const to = pqrsResponse.data.valorVariable

        const url = 'https://notificaciones-urbannav.onrender.com/enviar-correo'

        const data = {
            to,
            subject: 'PQRS de un usuario',
            name: 'Administrador',
            content: `
                Correo: ${email}
                Nombre: ${name}
                Mensaje: ${message}
            `
        }

        const response = await axios.post(url, data)

        if(response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'PQRS enviado correctamente',
                showConfirmButton: false,
                timer: 1500
              })

            //reset form
            e.target[0].value = ''
            e.target[1].value = ''
            e.target[2].value = ''
        }

    }



  return <>
    <NavTop />
    <div className="container">
        <h1 className="text-warning fw-bold display-2 mt-2">PQRS</h1>
        <h2 className="text-white fw-bold display-5">Peticiones, Quejas, Reclamos y Sugerencias</h2>

        <div className="row mb-5">
            <div className="col"></div>
            <div className="col">
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-white">Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Nombre" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-white">Correo</Form.Label>
                    <Form.Control type="email" placeholder="Correo" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="text-white">Mensaje</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <button type="submit" className="btn btn-warning">Enviar</button>
            </Form>
            </div>
            <div className="col"></div>
        </div>
    </div>
  </>
}
