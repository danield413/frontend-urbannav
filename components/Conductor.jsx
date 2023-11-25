'use client';
import { useGlobalState } from '@/hooks/useGlobalState'
// import { socket, socket } from '@/socket/socket'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
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

  console.log(servicios)

  useEffect(() => {
    const getBarrios = async () => {
      setLoading(true)
      const resp = await fetch('http://localhost:3000/barrio')
      const data = await resp.json()
      setBarrios(data)
      setLoading(false)
      localStorage.setItem('barrios', JSON.stringify(data))
    }

    if(localStorage.getItem('barrios')) setBarrios(JSON.parse(localStorage.getItem('barrios')))
    else getBarrios()
    getBarrios()
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

      const texto = `El cliente ${nombreCliente} ${apellidoCliente} ha solicitado un servicio desde ${barrioOrigen} hasta ${barrioDestino} por un valor de ${precio}`
      
      setServicios( prevServicios => [...prevServicios, {
        nombreCliente,
        apellidoCliente,
        barrioOrigen,
        barrioDestino,
        precio,
        distancia: data.recorrido.recorrido.DistanciaKM
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
    if(socket) { 
      setIsConnected(true)
      const resp = await axios.get(`http://localhost:3000/conductor/mongo/${user.idMongoDB}`)

      const usuarioIdLogica = resp.data.idConductor;
  
      const resp2 = await axios.patch(`http://localhost:3000/conductor/${usuarioIdLogica}`, {
        estadoServicio: 'LIBRE'
      })
  
      if(resp2.status === 204) toast('Ahora estás disponible para recibir servicios')
    }
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

  const handleChange = (e) => {
    // console.log(e.target.value)
  }

  return (
    <div>
        <p className='text-secondary'>Es hora de hacer viajes.</p>
        <div className="row">
          <div className="col"></div>
          <div className="col">
           {
            !esperandoServicios && <>
              <h1 className='text-white text-center fw-bold'>¿En dónde te encuentras?</h1>
               <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="barrioOrigen" className="form-label text-white">Barrio</label>
                  <select className="form-select" aria-label="Default select example" id='barrioOrigen' onChange={handleChange}>
                    <option selected>Selecciona tu barrio</option>
                      {
                        barrios.length > 0 && barrios.map(barrio => (
                          <option key={barrio.barrioId} value={barrio.barrioId}>{barrio.barrio} - {barrio.ciudad}</option>
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
            esperandoServicios && <>
              {
                
                servicios.length > 0 ? <> 
                      <h3 className='text-white text-center fw-bold'>Servicios disponibles</h3>
                      <div style={{ height: '300px', overflowY: 'scroll', overflowX: 'hidden' }} className="px-4">
                        {
                          servicios.map((servicio, index) => (
                            <div class="alert alert-primary row" role="alert" key={index} >
                              <div className="col col-8">
                              <p className='fw-bold'>{servicio.nombreCliente} {servicio.apellidoCliente} de  {servicio.barrioOrigen} hasta {servicio.barrioDestino}</p>
                              <p><strong>Precio:</strong> ${servicio.precio} - {servicio.distancia} kms</p>
                              </div>
                              <div className="col col-4">
                              <button className='btn btn-primary'>Tomar</button>
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
        </div>
          <div className="col"></div>
          </div>
    </div>
  )
}

export default Conductor