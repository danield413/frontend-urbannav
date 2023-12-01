'use client'
import { useGlobalState } from '@/hooks/useGlobalState'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
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


    socket.on('servicio-solicitud-de-conductor', (data) => {
      console.log('servicio-solicitud-de-conductor', data)
      toast.success(`El conductor: ${data.conductor.primerNombre} ${data.conductor.primerApellido} quiere tomar tu servicio!`)
      
      toast((t) => (
        <span>
          El conductor: <strong>{data.conductor.primerNombre} {data.conductor.primerApellido}</strong> quiere tomar tu servicio! - calificación: 4.8
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

          //TODO: CAMBIAR EL ESTADO DEL VIAJE A CANCELADO
          const resp2 = await axios.patch(`http://localhost:3000/viaje/${viajeActivo.idViaje}`, {
            estadoViaje: 'CANCELADO'
          })
          if(resp.data) {
            toast(`Tu viaje ha sido cancelado por seguridad`)
          }
          //TODO: JUSTIFICAR EL VIAJE CANCELADO
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

          //TODO: TERMINAR EL VIAJE
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

  return (
    <div>
        {
          !viajeActivo && <>
            <p className='text-secondary'>Es hora de pedir viajes.</p>
            <h1 className='text-white text-center fw-bold'>Solicita tu servicio</h1>
          </>
        }

        <div className="container">
          {
            !conductor && !viajeActivo ? <>
              <form className="w-50" style={{margin: '0 auto'}} onSubmit={handleSolicitar}>
              <label htmlFor="" className="text-white mb-2">Selecciona el recorrido</label>
            {
              loading ? <p className='text-white'>Cargando...</p>
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
          !loading && !viajeActivo && <button type="submit" className='btn btn-primary mt-2'>Solicitar</button>
         }
          </form>
            </>
            : <>
             
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
                <p>Estado: <strong>{viajeActivo.estadoViaje}</strong></p>
                <p>Id del viaje: <strong>{viajeActivo.idViaje}</strong></p>
                <p>Conductor: <strong>{viajeActivo.conductor.primerNombre} {viajeActivo.conductor.primerApellido}</strong></p>
                <button className="btn btn-danger" onClick={handlePanicButton}>Botón de pánico</button>
              </div>
            
            </>
           }

        </div>

       
    </div>
  )
}

export default Cliente