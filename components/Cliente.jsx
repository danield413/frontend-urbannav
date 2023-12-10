'use client'
import { useGlobalState } from '@/hooks/useGlobalState'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import { io } from 'socket.io-client'
import Swal from 'sweetalert2'

const Cliente = () => {

  const [recorridos, setRecorridos] = useState([])
  const [recorridoSolicitado, setRecorridoSolicitado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [conductor, setConductor] = useState(null)
  const[precioRecorridoSolicitado, setPrecioRecorridoSolicitado] = useState(0)
  const [socket, setSocket] = useState(null);
  const { user } = useGlobalState()
  const [recorrido, setRecorrido] = useState(null)
  const [viajeActivo, setViajeActivo] = useState(null)
  const [isRating, setIsRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [paying, setIsPaying] = useState(false)
  const [metodosPago, setMetodosPago] = useState([])

  const handleSolicitar = async (e) => {
    e.preventDefault()
    const idRecorrido = e.target[0].value

    console.log("id recorrido", idRecorrido)

    if(idRecorrido === 'Selecciona el recorrido') return toast.error('Debes seleccionar un recorrido')

    if(!idRecorrido) return toast.error('Debes seleccionar un recorrido')
    setRecorridoSolicitado(idRecorrido)

    const respCosto = await axios.get(`http://localhost:3000/precio-recorrido/${idRecorrido}`)
    
    toast((t) => (
      <span>
        Tu servicio costará <strong>${respCosto.data.precio}</strong> pesos 
        <button onClick={() => toast.dismiss(t.id)} className='btn btn-warning m-2'>
          Cancelar
        </button>
        <button onClick={() => {
          toast.dismiss(t.id)
          setPrecioRecorridoSolicitado(respCosto.data.precio)
          pedirServicio(Number(idRecorrido))
          
        }} className='btn btn-primary m-2'>
          Aceptar
        </button>
      </span>
    ))
    
  }

  const pedirServicio = async (idRecorrido) => {
    console.log('pedir servicio', idRecorrido)
    const { data } = await axios.get(`http://localhost:3000/recorrido/${idRecorrido}`)
    const barrioOrigenId = data.barrioOrigenId
    const barrioDestinoId = data.barrioDestinoId

    const recorridos = await axios.get('http://localhost:3000/recorrido?filter={"include":[{"relation":"barrioOrigen"},{"relation":"barrioDestino"}]}')
    console.log(recorridos.data)
    const recorridoSolicitado = recorridos.data.find(r => r.idRecorrido === idRecorrido)

    const resp2 = await axios.post('http://localhost:3000/recorrido/solicitar/conductores-cercanos', {
      barrioOrigenId,
      barrioDestinoId,
      conductorId: ''
    })
    
    const conductoresCercanos = resp2.data
    if(resp2.data.length === 0) return toast.error('No hay conductores cercanos, intenta en unos minutos 🫠')
    toast.success(`Conductores cercanos: ${resp2.data.length}. Les avisamos que deseas un servicio!`)
    
    const usuario = await axios.get(`http://localhost:3001/usuario/${user.idMongoDB}`)
    const usuarioData = usuario.data

   sendMessage({
    conductoresCercanos,
    cliente: usuarioData,
    recorrido: recorridoSolicitado,
   })
    
  }

  const sendMessage = useCallback(( data ) => {

    //create a random id for the message
    const id = Math.floor(Math.random() * 1000000000);

    if(socket) {
      socket.emit('alertar-conductores', {...data, id})
    } else {
      console.log('no hay socket')
    }

  }, [socket]);

  useEffect(() => {
  
    if(!socket) {
      setSocket(
        io('http://localhost:5050', { 
          query: {
              idUsuario: user.idMongoDB,
              tipoUsuario: 'CLIENTE'
          },
      }))
      return
    };

    socket.on('connect', () => {
      console.log('conectado')
    })

    socket.on('message', (data) => {
      console.log("MSG", data)
    })

    socket.on('puntuar-conductor', (data) => {
      console.log('PUNTUAR CONDUCTOR')
      setIsRating(true)
    })

    socket.on('servicio-solicitud-de-conductor', (data) => {
      console.log('servicio-solicitud-de-conductor', data)
      toast.success(`El conductor: ${data.conductor.primerNombre} ${data.conductor.primerApellido} quiere tomar tu servicio!`)
      
      if(!data.servicio.promedio) {
        data.servicio.promedio = 0
      }
      
      toast((t) => (
        <span>
          El conductor: <strong>{data.conductor.primerNombre} {data.conductor.primerApellido}</strong> quiere tomar tu servicio! - calificación: {data.servicio.promedio.toFixed(1)} estrellas
          <button onClick={() => {
            toast.dismiss(t.id)
            socket.emit('servicio-solicitud-cliente-rechazada', {
              conductor: data.conductor,
              servicio: data.servicio
            })
            toast('Vuelve a solicitar un servicio')
          }} className='btn btn-warning m-2'>
            Rechazar
          </button>
          <button onClick={ async () => {
            toast.dismiss(t.id)
            console.log("la data para el viaje es: ", data)
            console.log("_-------_")
            const cliente = await axios.get(`http://localhost:3000/cliente/mongo/${user.idMongoDB}`)
            const clienteData = cliente.data
            const resp =  await axios.post('http://localhost:3000/viaje', {
              estadoViaje: 'EN CURSO',
              fechahoraInicio: new Date(),
              fechahoraFin: '',
              conductorId: data.conductor.idConductor,
              clienteId: Number(clienteData.idCliente),
              recorridoId: data.servicio.recorrido.idRecorrido
            })
            
            const viaje = resp.data

            //TODO: enviar correo y/o mensaje al pasajero con la confirmación del viaje y datos del conductor y vehículo 

            setViajeActivo({
              ...viaje,
              conductor: data.conductor,
              servicio: data.servicio
            })
            
            socket.emit('servicio-solicitud-cliente-aceptada', {
              conductor: data.conductor,
              servicio: data.servicio,
              viaje       
            })

          }} className='btn btn-primary m-2'>
            Aceptar
          </button>
        </span>
      ))
    })

    socket.on('llego-origen-conductor', (data) => {
      console.log('llego-origen-conductor', data)
      toast.success(`El conductor: ${data.conductor.primerNombre} ${data.conductor.primerApellido} llegó a tu ubicación!`)
    })

    return () => {
      socket.off('connect')
      socket.off('message')
    }

  }, [socket]);


  //useffect to call recorridos
  useEffect(() => {
    const getRecorridos = async () => {
      setLoading(true)
      const res = await axios.get('http://localhost:3000/recorrido?filter={"include":[{"relation":"barrioOrigen"},{"relation":"barrioDestino"}]}')
      console.log(res.data)
      setRecorridos(res.data)
      setLoading(false)
      // localStorage.setItem('recorridos', JSON.stringify(res.data))
    }

    getRecorridos()

  }, [])

  const handlePanicButton = async () => {
    toast((t) => (
      <span>
        ¿Sientes que estás en posible peligro?
        <button onClick={() => {
          toast.dismiss(t.id)
         
        }} className='btn btn-success m-2'>
          NO
        </button>
        <button onClick={ async () => {
          toast.dismiss(t.id)
          
          toast('Manten la calma y espera a que llegue la ayuda - Equipo de UrbanNav')
          
          const cliente = await axios.get(`http://localhost:3000/cliente/mongo/${user.idMongoDB}`)
          const clienteData = cliente.data
          
          console.log(clienteData)
          const correoPanico = clienteData.correoPanico
          toast.success(`Alerta enviada a tu correo de pánico: ${correoPanico }`)

          const resp =  await axios.post('http://localhost:3000/generar-alerta', {
            fechahora: new Date(),
            viajeId: viajeActivo.idViaje
          })

          console.log(resp)

          const resp2 = await axios.patch(`http://localhost:3000/viaje/${viajeActivo.idViaje}`, {
            estadoViaje: 'CANCELADO'
          })
          if(resp.data) {
            toast(`Tu viaje ha sido cancelado por seguridad`)
          }
          const { value: formValues } = await Swal.fire({
            title: "Justificación de cancelación",
            html: `
              <h2 class="text-center">Motivo de cancelación</h2>
              <input id="swal-input1" class="swal2-input" placeholder="Escribe el motivo">
            `,
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById("swal-input1").value
              ];
            },
            confirmButtonText: "Enviar",
            denyButtonText: "Cancelar",
            showDenyButton: true,
          });
          if (formValues) {
            const justificacion = formValues[0];
            console.log(justificacion)
            const resp3 = await axios.post('http://localhost:3000/resena-viaje-cliente', {
                comentario: justificacion,
                viajeId: viajeActivo.idViaje
            })
            console.log(resp3.data)
            if(resp3.data) {
              toast('Tu justificación ha sido enviada')
            }
          }

          const resp4 = await axios.patch(`http://localhost:3000/viaje/${viajeActivo.idViaje}`, {
            estadoViaje: 'FINALIZADO',
            fechahoraFin: new Date()
          })
        
          toast('Tu viaje ha sido finalizado')
          setViajeActivo(null)

          socket.emit('viaje-cancelado', {
            viajeId: viajeActivo.idViaje,
            conductorId: viajeActivo.conductor.idMongoDB
          })


        }} className='btn btn-danger m-2'>
          SI, ALERTAR
        </button>
      </span>
    ))
  }

  const handleCalificarConductor = async (e) => {

    e.preventDefault()


    const comentario = e.target[0].value
    console.log({
      comentario,
      puntuacion: rating,
      viajeId:viajeActivo.idViaje
    })

    //* CREAR RESEÑA y CALIFICACION
    const response = await axios.post('http://localhost:3000/resena-viaje-conductor', {
      comentario,
      viajeId:viajeActivo.idViaje
    })

    const idResena = response.data.idResena

    const response2 = await axios.post('http://localhost:3000/puntuacion-conductor', {
      resenaViajeConductorId: idResena,
      puntuacion: rating,
    })

    console.log(response2)

    if(response2.status === 200) {
      toast.success('Calificación enviada con éxito! ✅')
      toast('Gracias por usar UrbanNav - Viaje finalizado')

      const resp = await axios.get('http://localhost:3000/metodo-pago')
      console.log(resp.data)
      setMetodosPago(resp.data)

      setIsRating(false)
      setIsPaying(true)
    }

  }

  const handlePagar = async (e) => {
    e.preventDefault()

    const metodoPago = e.target[0].value

    if(metodoPago === 'Selecciona un método') return toast.error('Debes seleccionar un método de pago')

    console.log({
      viajeActivo,
      metodoPago
    })

    //hacer peticion y obtener precio del recorrido
    const resp = await axios.get(`http://localhost:3000/precio-recorrido/${viajeActivo.recorridoId}`)
    const precio = resp.data.precio

    const resp2 = await axios.post('http://localhost:3000/pago', {
      Total: precio,
      metodoPagoId: Number(metodoPago)
    })

    if(resp.status === 200) {

      const resp3 = await axios.post('http://localhost:3000/generar-factura', {
        fechahora: new Date(),
        viajeId: viajeActivo.idViaje,
        pagoId: resp2.data.idPago
      })

      if(resp3.status === 200) {
        toast.success('Pago realizado con éxito! ✅ - Muchas gracias por usar UrbanNav')

        setIsRating(false)
        setViajeActivo(null)
        setIsPaying(false)
      }

    }
    // if(resp.status === 200) {
    //   toast.success('Pago realizado con éxito! ✅')

    //   setIsRating(false)
    //   setViajeActivo(null)
    //   setEsperandoServicios(false)
    //   setBarrios([])
    // }
  } 

  const addPreferencia = () => {
    toast((t) => (
      <span>
        ¿Quieres añadir preferencias de viaje?
        <button onClick={() => {
          toast.dismiss(t.id)
         
        }} className='btn btn-success m-2'>
          NO
        </button>
        <button onClick={ async () => {
          toast.dismiss(t.id)
          
          toast('Añade tus preferencias de viaje')
          
          const { value: formValues } = await Swal.fire({
            title: "Preferencias de viaje",
            html: `
              <input id="swal-input1" class="swal2-input" placeholder="Escribe tus preferencias">
            `,
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById("swal-input1").value
              ];
            },
            confirmButtonText: "Enviar",
            denyButtonText: "Cancelar",
            showDenyButton: true,
          });
          if (formValues) {
            const preferencia = formValues[0];
            const usuario = await axios.get(`http://localhost:3001/usuario/${user.idMongoDB}`)
            const clienteId = usuario.data.usuarioEnLogica.idCliente

            //post to preferencia and pass the token in the header
            const response = await axios.post('http://localhost:3000/preferencia', {
              descripcion: preferencia,
              clienteId
            })

            if(response.status === 200) {
              toast.success('Preferencia añadida')
            }
          }

        }} className='btn btn-primary m-2'>
          SI, AÑADIR
        </button>
      </span>
    ))
  }

  const verComentariosConductor = async () => {

    const resp = await axios.get(`http://localhost:3000/resena-viaje-conductor`)
    console.log(resp.data)
    console.log(viajeActivo)

    const resenas = resp.data.filter(r => r.viaje.conductor.idConductor === viajeActivo.conductor.idConductor)

    // mostrar en un sweet alert los comentarios
    let comentarios = ''
    resenas.forEach(r => {
     comentarios += `<div style="margin-bottom: 10px" >${r.comentario} calificación: ${r.puntuacionConductor.puntuacion} estrellas </div>`
    })

    Swal.fire({
      title: 'Comentarios de este conductor',
      html: `<div>
        ${comentarios}
      </div>`
    })


  }

  return (
    <div className='animate__animated animate__fadeIn dash'>

      <button className='btn btn-outline-primary mb-2' onClick={addPreferencia}>Añadir preferencias de viaje</button>

          {
              (paying && !isRating) && (
                <>
                  <h1 className='text-warning text-center fw-bold'>Pagar viaje</h1>
                  <Form onSubmit={handlePagar} className='animate__animated animate__fadeIn'>
                      {/* iterate the metodoPago and create a select */}
                      <select className="form-select" aria-label="Default select example">
                        <option selected>Selecciona un método</option>
                        {
                          metodosPago.length > 0 && metodosPago.map(metodo => (
                            <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>{metodo.Nombre}</option>
                          ))
                        }
                      </select>

                      <Button variant="primary" type="submit" className='mt-2'>
                        Pagar
                      </Button>

                  </Form>
                </>
              )
            }

      {
          (isRating && !paying) && (
            <>
              <h1 className='text-warning text-center fw-bold'>Califica al conductor</h1>
              <Form onSubmit={handleCalificarConductor} className='animate__animated animate__fadeIn'>
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
          !viajeActivo && !isRating && !paying && <>
            <p className='text-secondary'>Es hora de pedir viajes.</p>
            <h1 className='text-white text-center fw-bold'>Solicita tu servicio</h1>
          </>
        }

        <div className="container">
          {
            !conductor && !viajeActivo && !isRating ? <>
              <form className="w-50 animate__animated animate__fadeIn" style={{margin: '0 auto'}} onSubmit={handleSolicitar}>
              <label htmlFor="" className="text-white mb-2">Selecciona el recorrido</label>
            {
              loading ? <div class="d-flex justify-content-center">
                <div class="spinner-border text-warning" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              : <select className="form-select" aria-label="Default select example">
              <option selected>Selecciona el recorrido</option>
              {
                recorridos.length > 0 && recorridos.map(r => (
                  <option value={r.idRecorrido} key={r.idRecorrido}>{r.barrioOrigen.nombreBarrio} - {r.barrioDestino.nombreBarrio}</option>
                ))
              }
            </select>
            }

         {
          !loading && !viajeActivo && !isRating && !paying && <button type="submit" className='btn btn-primary mt-2'>Solicitar</button>
         }
          </form>
            </>
            : <>
             
            </>
          }

          {
            viajeActivo && !isRating && !paying && <>

              <h2 className="text-warning text-center">Estás en viaje</h2>

              <div className="card p-3 animate__animated animate__fadeIn" style={{margin: '0 auto'}}>
                {/* {
                  JSON.stringify(viajeActivo)
                } */}
                <h3>Pasajero: {viajeActivo.servicio.nombreCliente} {viajeActivo.servicio.apellidoCliente}</h3>
                <h3>{viajeActivo.servicio.barrioOrigen} - {viajeActivo.servicio.barrioDestino}</h3>
                <h4>{viajeActivo.servicio.distancia} kms</h4>
                <p>Estado: <strong>{viajeActivo.estadoViaje}</strong></p>
                <p>Id del viaje: <strong>{viajeActivo.idViaje}</strong></p>
                <p>Conductor: <strong>{viajeActivo.conductor.primerNombre} {viajeActivo.conductor.primerApellido}</strong></p>
                <button className="btn btn-danger" onClick={handlePanicButton}>Botón de pánico</button>
              </div>
              <button className="btn btn-warning mt-2" onClick={verComentariosConductor}>Ver comentarios de este conductor</button>

            
            </>
           }

        </div>

       
    </div>
  )
}

export default Cliente