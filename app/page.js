import Image from 'next/image'
import styles from './page.module.css'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='bg-dark' style={{height: '100vh'}}>
      <Container>
        <Row className='justify-content-center align-items-center' style={{height: '100vh'}}>
          <Col xs={12} md={6} lg={4} className='text-center'>
            <h1 className='fw-bold text-primary'>UrbanNav</h1>
            <h3 className="text-secondary">Una plataforma de transporte diferente.</h3>
            <Link className='btn btn-outline-warning my-2 mx-1' href="/login">Iniciar sesión</Link>
            <Link className='btn btn-outline-warning my-2 mx-1' href="/register">Registrarse</Link>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
