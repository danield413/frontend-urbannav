'use client';
import { useGlobalState } from '@/hooks/useGlobalState'
// import { socket, socket } from '@/socket/socket'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
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

      //TODO: EMPEZAR EL VIAJE tanto para CLIENTE COMO CONDUCTOR y LO OTRO
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

      //TODO: OBTENER PROMEDIO CALIFICACIONES DEL CONDUCTOR

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

    // TODO: TERMINAR VIAJE EN LA BASE DE DATOS
    const resp = await axios.patch(`http://localhost:3000/viaje/${viajeActivo.viaje.idViaje}`, {
      estadoViaje: 'FINALIZADO-NORMAL'
    })

    toast.success('Viaje finalizado con éxito! ✅')

    //TODO: CALIFICAR AL CLIENTE
    
    // const { value: formValues } = await Swal.fire({
    //   title: "Justificación de cancelación",
    //   html: `
    //     <h2 class="text-center">Motivo de cancelación</h2>
    //     <input id="swal-input1" class="swal2-input" placeholder="Escribe el motivo">
    //   `,
    //   focusConfirm: false,
    //   preConfirm: () => {
    //     return [
    //       document.getElementById("swal-input1").value
    //     ];
    //   },
    //   confirmButtonText: "Enviar",
    //   denyButtonText: "Cancelar",
    //   showDenyButton: true,
    // });
    // if (formValues) {
    //   const justificacion = formValues[0];
    //   console.log(justificacion)
    //   const resp3 = await axios.post('http://localhost:3000/resena-viaje-cliente', {
    //       comentario: justificacion,
    //       viajeId: viajeActivo.idViaje
    //   })
    //   console.log(resp3.data)
    //   if(resp3.data) {
    //     toast('Tu justificación ha sido enviada')
    //   }
    // }

    // TODO: NOTIFICAR AL CLIENTE PARA QUE CALIFIQUE AL CONDUCTOR

    // TODO: ENVIAR FACTURA
  }

  const llegoOrigen = async () => {
    socket.emit('llego-origen', {
      idCliente: viajeActivo.servicio.idCliente,
      conductor: viajeActivo.conductor,
    })
  }

  return (
    <div>
        <p className='text-secondary'>Es hora de hacer viajes.</p>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
           {
            !esperandoServicios && !viajeActivo && <>
              <h1 className='text-white text-center fw-bold'>¿En dónde te encuentras?</h1>
               <form onSubmit={handleSubmit}>
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
            esperandoServicios && !viajeActivo && <>
              {
                
                servicios.length > 0 ? <> 
                      <h3 className='text-white text-center fw-bold'>Servicios disponibles</h3>
                      <div style={{ height: '300px', overflowY: 'scroll', overflowX: 'hidden' }} className="px-4">
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
            viajeActivo && <>

              <h2 className="text-warning text-center">Estás en viaje</h2>

              <div className="card p-3" style={{margin: '0 auto'}}>
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