'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const Cliente = () => {

  const [recorridos, setRecorridos] = useState([])
  const [recorridoSolicitado, setRecorridoSolicitado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [conductor, setConductor] = useState(null)
  const[precioRecorridoSolicitado, setPrecioRecorridoSolicitado] = useState(0)

  console.log(conductor)

  const aceptarConductor = () => {
    //TODO: OK
    console.log("OK ESE CONDUCTOR")
  }

  const rechazarConductor = async  () => {
    console.log("NO, OTRO CONDUCTOR")

    const { barrioOrigenId, barrioDestinoId } = recorridoSolicitado

    const resp = await axios.post('http://localhost:3000/recorrido/solicitar', {
      barrioOrigenId,
      barrioDestinoId,
      conductorId: conductor.idMongoDB
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log('NUEVO conductor más cercano' , resp.data)
    setConductor(resp.data)

  }

  const handleSolicitar = async (e) => {
    e.preventDefault()
    const idRecorrido = e.target[0].value

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
          pedirServicio(idRecorrido)
          
        }} className='btn btn-primary m-2'>
          Aceptar
        </button>
      </span>
    ))
    
  }

  const pedirServicio = async (idRecorrido) => {
    const { data } = await axios.get(`http://localhost:3000/recorrido/${idRecorrido}`)
    const barrioOrigenId = data.barrioOrigenId
    const barrioDestinoId = data.barrioDestinoId

    // //send header bearer token and body
    // const resp = await axios.post('http://localhost:3000/recorrido/solicitar', {
    //   barrioOrigenId,
    //   barrioDestinoId,
    //   conductorId: ''
    // }, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // })

    // console.log('conductor más cercano' , resp.data)
    // setConductor(resp.data)

    // setRecorridoSolicitado({
    //   barrioOrigenId,
    //   barrioDestinoId
    // })
  }


  //useffect to call recorridos
  useEffect(() => {
    const getRecorridos = async () => {
      setLoading(true)
      const res = await axios.get('http://localhost:3000/recorrido')
      console.log(res)
      setRecorridos(res.data)
      localStorage.setItem('recorridos', JSON.stringify(res.data))
      setLoading(false)
    }

    if(localStorage.getItem('recorridos')) setRecorridos(JSON.parse(localStorage.getItem('recorridos')))
    else getRecorridos()

  }, [])

  return (
    <div>
        <p className='text-secondary'>Es hora de pedir viajes.</p>

        <h1 className='text-white text-center fw-bold'>Solicita tu servicio</h1>
        <div className="container">
          {
            !conductor ? <>
              <form className="w-50" style={{margin: '0 auto'}} onSubmit={handleSolicitar}>
              <label htmlFor="" className="text-white mb-2">Selecciona el recorrido</label>
            {
              loading ? <p className='text-white'>Cargando...</p>
              : <select className="form-select" aria-label="Default select example">
              <option selected>Selecciona el recorrido</option>
              {
                recorridos.map(r => (
                  <option value={r.recorrido.idRecorrido} key={r.recorrido.idRecorrido}>{r.barrioOrigen.nombreBarrio} - {r.barrioDestino.nombreBarrio} - {r.recorrido.DistanciaKM} Kms</option>
                ))
              }
            </select>
            }

         {
          !loading && <button type="submit" className='btn btn-primary mt-2'>Solicitar</button>
         }
          </form>
            </>
            : <>
              <h1 className='text-white text-center fw-bold'>Conductor asignado</h1>
              <div className="card w-50" style={{margin: '0 auto'}}>
                <div className="card-body">
                  <h5 className="card-title">Conductor: {conductor.primerNombre} {conductor.primerApellido}</h5>
                </div>
              <div className="d-grid gap-2 col-12">
                <div className="col d-flex justify-content-center">
                <button className="btn btn-primary" onClick={aceptarConductor}>Aceptar servicio</button>
                </div>
                <div className="col d-flex justify-content-center">
                <button className="btn btn-warning" onClick={rechazarConductor}>Quiero otro conductor</button>

                </div>
              </div>
              </div>
            </>
          }
        </div>

       
    </div>
  )
}

export default Cliente