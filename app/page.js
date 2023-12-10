'use client'
import { Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGlobalState } from '@/hooks/useGlobalState'

export default function Home() {

  const router = useRouter()
  const { user } = useGlobalState()

  return (
    <>
      {
        user ?
        <> {router.push('/dashboard')} </>
        : <> 
          <main className='bg-dark' style={{height: '100vh'}}>
          <Container>
            <Row className='justify-content-center align-items-center' style={{height: '100vh'}}>
              <Col xs={12} md={6} lg={4} className='text-center'>
                <h1 className='fw-bold text-warning display-1'>UrbanNav</h1>
                <h3 className="text-white">Una plataforma de transporte diferente.</h3>
                <Link className='btn btn-outline-warning my-2 mx-1' href="/login">Iniciar sesión</Link>
                <Link className='btn btn-outline-warning my-2 mx-1' href="/register">Registrarse</Link>
              </Col>
            </Row>
          </Container>
        </main>

        <h2 className="display-3 text-white fw-bold text-center mb-4">La mejor App de transporte</h2>

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <h2 className="display-4 text-white fw-bold text-center mb-2">¿Qué es <strong className="text-warning">UrbanNav</strong>?</h2>
              <p className="lead text-white">UrbanNav es una plataforma de transporte que te permite viajar de forma segura y eficiente.</p>
              <div className="row">
                <div className="col">
                  <h4 className="text-white">Seguridad</h4>
                  <p className="text-white">UrbanNav se asegura que tus viajes sean seguros y óptimos.</p>
                </div>
                <div className="col">
                  <h4 className="text-white">Eficiencia</h4>
                  <p className="text-white">UrbanNav te permite encontrar viajes y disponibilidad como nunca antes.</p>
                </div>
              </div>
              
            </div>
            <div className="col-12 col-md-6">
              <img src="/background.jpg" alt="UrbanNav" className="img-fluid rounded" />
            </div>
          </div>
        </div>

        <div className="container mt-5">

            <h2 className="display-2 text-center text-white mb-5">Creada en la <strong className='text-info fw-bold'>UCaldas</strong></h2>

        </div>


        </>
      }
    </>
  )
}
