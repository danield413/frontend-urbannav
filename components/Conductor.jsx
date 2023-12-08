'use client';
import { useGlobalState } from '@/hooks/useGlobalState'
// import { socket, socket } from '@/socket/socket'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'


const Conductor = () => {

  const [barrios, setBarrios] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useGlobalState()
  const [ esperandoServicios, setEsperandoServicios ] = useState(false)
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [servicios, setServicios] = useState([])
  const [viajeActivo, setViajeActivo] = useState(null)
  const [isRating, setIsRating] = useState(false)
  const [rating, setRating] = useState(0)

  console.log(servicios)

  useEffect(() => {
    const getBarrios = async () => {
      setLoading(true)
      const resp = await fetch('http://localhost:3000/barrio?filter={"include":[{"relation":"ciudad"}]}')
      const data = await resp.json()
      console.log(data)
      setBarrios(data)
      setLoading(false)
      localStorage.setItem('barrios', JSON.stringify(data))
    }
    getBarrios()

    // if(localStorage.getItem('barrios')) setBarrios(JSON.parse(localStorage.getItem('barrios')))
    // else getBarrios()
  }, [])

  useEffect(() => {
  
    if(!socket) return;

    socket.on('connect', () => {
      console.log('conectado')
    })

    socket.on('nuevo-servicio', (data) => {
      console.log('MSG', data)
      const nombreCliente = data.cliente.usuarioEnLogica.primerNombre
      const apellidoCliente = data.cliente.usuarioEnLogica.primerApellido
      const barrioOrigen = data.recorrido.barrioOrigen.nombreBarrio
      const barrioDestino = data.recorrido.barrioDestino.nombreBarrio
      const precio = data.precio
      const recorrido = data.recorrido

      const texto = `El cliente ${nombreCliente} ${apellidoCliente} ha solicitado un servicio desde ${barrioOrigen} hasta ${barrioDestino} por un valor de ${precio}`
      
      setServicios( prevServicios => [...prevServicios, {
        idCliente: data.cliente.usuario._id,
        id: data.id,
        nombreCliente,
        apellidoCliente,
        barrioOrigen,
        barrioDestino,
        precio,
        recorrido,
        distancia: data.recorrido.DistanciaKM
      }] )

      toast('Tienes un nuevo servicio disponible, apurate! 🔥', {
        icon: '🚀',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    })

    socket.on('actualizacion-servicios', (data) => {
      console.log('servicio borrar', data)
      setServicios( prevServicios => prevServicios.filter(servicio => servicio.id !== data) )
    })

    socket.on('servicio-solicitud-aceptada', (data) => {
      console.log('servicio-solicitud-aceptada', data)
      toast.success(`El cliente: ${data.servicio.nombreCliente} ${data.servicio.apellidoCliente} ha aceptado tu solicitud! 🔥✅`)

      setServicios([])
      console.log(data)
      setViajeActivo(data)

    })

    socket.on('servicio-solicitud-rechazada', (data) => {
      console.log('servicio-solicitud-rechazada', data)
      toast.error(`El cliente: ${data.servicio.nombreCliente} ${data.servicio.apellidoCliente} ha rechazado tu solicitud! 😢❌`)

      setServicios([])
    })

    socket.on('viaje-cancelado-cliente', (data) => {
      console.log('viaje-cancelado-cliente', data)
      // toast.error(`El cliente: ${data.servicio.nombreCliente} ${data.servicio.apellidoCliente} ha cancelado el viaje! 😢❌`)
      toast.error(`El cliente ha cancelado el viaje! 😢❌`)

      setServicios([])
      setViajeActivo(null)
      setEsperandoServicios(false)
      setBarrios([])
    })

    return () => {
      socket.off('connect')
      socket.off('message')
    }

  }, [socket]);

  const cerrarSocket = async () => {

    const resp = await axios.get(`http://localhost:3000/conductor/mongo/${user.idMongoDB}`)

    const usuarioIdLogica = resp.data.idConductor;

    const resp2 = await axios.patch(`http://localhost:3000/conductor/${usuarioIdLogica}`, {
      barrioId: 1,
      estadoServicio: 'NO DISPONIBLE'
    })

    if(resp2.status === 204) toast('Ya no estás disponible para recibir servicios')


    socket.disconnect()
    setIsConnected(false)
  }
  
  const startWaiting = async () => {
    setSocket(
      io('http://localhost:5050', { 
        query: {
            idUsuario: user.idMongoDB,
            tipoUsuario: 'CONDUCTOR'
        },
    }))
    
      setIsConnected(true)
      const resp = await axios.get(`http://localhost:3000/conductor/mongo/${user.idMongoDB}`)

      const usuarioIdLogica = resp.data.idConductor;
  
      const resp2 = await axios.patch(`http://localhost:3000/conductor/${usuarioIdLogica}`, {
        estadoServicio: 'LIBRE'
      })
  
      if(resp2.status === 204) toast('Ahora estás disponible para recibir servicios')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const barrioActual = e.target[0].value

    
    const resp = await axios.get(`http://localhost:3000/conductor/mongo/${user.idMongoDB}`)

    const usuarioIdLogica = resp.data.idConductor;

    try {
      const resp2 = await axios.patch(`http://localhost:3000/conductor/${usuarioIdLogica}`, {
        barrioId: Number(barrioActual)
      })

      const resp3 = await axios.get(`http://localhost:3000/barrio/${barrioActual}`)
      toast.success(`Ahora te encuentras en el barrio ${resp3.data.nombreBarrio}`)
    } catch (error) {
      console.log(error)
    }


  }

  const tomarServicio = useCallback( async ( servicio, id ) => {

    if(socket) {
      socket.emit('servicio-tomado', id)

      toast('Has tomado el servicio, le hemos avisado al usuario, espera su respuesta... ⌚')

      const resp = await axios.get(`http://localhost:3000/conductor/mongo/${user.idMongoDB}`)

      const conductor = resp.data;

      const response = await axios.get(`http://localhost:3000/promedio-conductor/${conductor.idConductor}`)

      const promedio = response.data
      console.log('PROMEDIO', promedio)

      socket.emit('servicio-solicitud-a-cliente', {
        conductor,
        servicio,
        cliente: servicio.cliente,
      })


    } else {
      console.log('no hay socket')
    }

  }, [socket]);

  const handleChange = (e) => {
    // console.log(e.target.value)
  }

  const terminarViaje = async () => {
    socket.emit('terminar-viaje', {
      idCliente: viajeActivo.servicio.idCliente,
      conductor: viajeActivo.conductor,
    })

    const resp = await axios.patch(`http://localhost:3000/viaje/${viajeActivo.viaje.idViaje}`, {
      estadoViaje: 'FINALIZADO-NORMAL'
    })

    toast.success('Viaje finalizado con éxito! ✅')

    //emitirle al cliente para que califique al conductor
    socket.emit('emision-puntuacion-conductor', {
      idCliente: viajeActivo.servicio.idCliente,
    })

    setIsRating(true)

    // TODO: ENVIAR FACTURA
  }

  const llegoOrigen = async () => {
    socket.emit('llego-origen', {
      idCliente: viajeActivo.servicio.idCliente,
      conductor: viajeActivo.conductor,
    })
  }

  const handleCalificarCliente = async (e) => {

    e.preventDefault()

    const comentario = e.target[0].value
    console.log({
      comentario,
      puntuacion: rating,
      viajeId:viajeActivo.viaje.idViaje
    })

    //* CREAR RESEÑA y CALIFICACION
    const response = await axios.post('http://localhost:3000/resena-viaje-cliente', {
      comentario,
      viajeId:viajeActivo.viaje.idViaje
    })

    const idResena = response.data.idResena

    const response2 = await axios.post('http://localhost:3000/puntuacion-cliente', {
      resenaViajeClienteId: idResena,
      puntuacion: rating,
    })

    console.log(response2)

    if(response2.status === 200) {
      toast.success('Calificación enviada con éxito! ✅')
      setIsRating(false)
      setViajeActivo(null)
      setEsperandoServicios(false)
      setBarrios([])
    }

    

  }

  return (
    <div className='animate__animated animate__fadeIn'>
        <p className='text-secondary'>Es hora de hacer viajes.</p>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">

            {
              (isRating) && (
                <>
                  <h1 className='text-warning text-center fw-bold'>Califica al cliente</h1>
                  <Form onSubmit={handleCalificarCliente} className='animate__animated animate__fadeIn'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        placeholder="Comentario"
                      />

                      <Form.Check
                        type="radio"
                        label="1 estrella"
                        name="rating"
                        id="rating1"
                        value={1}
                        className='text-white fw-bold mt-2'
                        onChange={(e) => setRating(1)}
                      />
                      <Form.Check
                        type="radio"
                        label="2 estrellas"
                        name="rating"
                        id="rating2"
                        value={2}
                        className='text-white fw-bold'
                        onChange={(e) => setRating(2)}

                      />
                      <Form.Check
                        type="radio"
                        label="3 estrellas"
                        name="rating"
                        id="rating3"
                        value={3}
                        className='text-white fw-bold'
                        onChange={(e) => setRating(3)}

                      />
                      <Form.Check
                        type="radio"
                        label="4 estrellas"
                        name="rating"
                        id="rating4"
                        value={4}
                        className='text-white fw-bold'
                        onChange={(e) => setRating(4)}

                      />
                      <Form.Check
                        type="radio"
                        label="5 estrellas"
                        name="rating"
                        id="rating5"
                        value={5}
                        className='text-white fw-bold'
                        onChange={(e) => setRating(5)}
                      />


                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Calificar
                    </Button>
                  </Form>
                </>
              )
            }

           {
            !esperandoServicios && !viajeActivo && !isRating && <>
              <h1 className='text-white text-center fw-bold'>¿En dónde te encuentras?</h1>
               <form onSubmit={handleSubmit} className='animate__animated animate__fadeIn'>
                <div className="mb-3">
                  <label htmlFor="barrioOrigen" className="form-label text-white">Barrio</label>
                  <select className="form-select" aria-label="Default select example" id='barrioOrigen' onChange={handleChange}>
                    <option selected>Selecciona tu barrio</option>
                      {
                        barrios.length > 0 && barrios.map(barrio => (
                          <option key={barrio.idBarrio} value={barrio.idBarrio}>{barrio.nombreBarrio} - {barrio.ciudad.Nombre}</option>
                        ))
                      }
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary">Guardar ubicación actual</button>
              </form>
              <button className='btn btn-info mt-2' onClick={() => {
                startWaiting()
                setEsperandoServicios(true)
              }}>Esperar servicios</button>
            </>
           }
           {
            esperandoServicios && !viajeActivo && !isRating && <>
              {
                
                servicios.length > 0 ? <> 
                      <h3 className='text-white text-center fw-bold'>Servicios disponibles</h3>
                      <div style={{ height: '300px', overflowY: 'scroll', overflowX: 'hidden' }} className="px-4 animate__animated animate__fadeIn">
                        {
                          servicios.map((servicio, index) => (
                            <div class="alert alert-primary row" role="alert" key={index} >
                              <div className="col col-8">
                              <p className='fw-bold'>{servicio.nombreCliente} {servicio.apellidoCliente} de  {servicio.barrioOrigen} hasta {servicio.barrioDestino}</p>
                              <p><strong>Distancia: </strong>{servicio.distancia} kms</p>
                              </div>
                              <div className="col col-4">
                              <button className='btn btn-primary' onClick={() => tomarServicio(servicio, servicio.id)}>Tomar</button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </>
                 : <div className="container d-flex justify-content-center">
                  <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
                </div>
              }
              <h4 className='text-white text-center fw-bold mt-2'>Esperando servicios... 😊</h4>
              <button className='btn btn-danger mt-2' onClick={() => {
                cerrarSocket()
                setEsperandoServicios(false)
              }}>Cancelar</button>
            </>
           }

           {
            viajeActivo && !isRating && <>

              <h2 className="text-warning text-center">Estás en viaje</h2>

              <div className="card p-3 animate__animated animate__fadeIn" style={{margin: '0 auto'}}>
                {/* {
                  JSON.stringify(viajeActivo)
                } */}
                <h3>Pasajero: {viajeActivo.servicio.nombreCliente} {viajeActivo.servicio.apellidoCliente}</h3>
                <h3>{viajeActivo.servicio.barrioOrigen} - {viajeActivo.servicio.barrioDestino}</h3>
                <h4>{viajeActivo.servicio.distancia} kms</h4>
                <p>Estado: <strong>{viajeActivo.viaje.estadoViaje}</strong></p>
                <p>Id del viaje: <strong>{viajeActivo.viaje.idViaje}</strong></p>
                <p>Conductor: <strong>{viajeActivo.conductor.primerNombre} {viajeActivo.conductor.primerApellido}</strong></p>
                <button className="btn btn-primary" onClick={llegoOrigen}>Llegué al destino</button>

                <button className="btn btn-danger mt-2" onClick={terminarViaje}>Finalizar viaje</button>
              </div>
                
            </>
           }
        </div>
          <div className="col-2"></div>
          </div>
    </div>
  )
}

export default Conductor