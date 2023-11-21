'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Cliente = () => {

  const [recorridos, setRecorridos] = useState([])
  const [loading, setLoading] = useState(false)
  const [conductor, setConductor] = useState(null)

  const handleSolicitar = async (e) => {
    e.preventDefault()
    const idRecorrido = e.target[0].value

    const { data } = await axios.get(`http://localhost:3000/recorrido/${idRecorrido}`)
    const barrioOrigenId = data.barrioOrigenId
    const barrioDestinoId = data.barrioDestinoId

    //send header bearer token and body
    const resp = await axios.post('http://localhost:3000/recorrido/solicitar', {
      barrioOrigenId,
      barrioDestinoId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log('conductor más cercano' , resp.data)
    setConductor(resp.data)
    
    
  }


  //useffect to call recorridos
  useEffect(() => {
    const getRecorridos = async () => {
      setLoading(true)
      const res = await axios.get('http://localhost:3000/recorrido')
      console.log(res)
      setRecorridos(res.data)
      setLoading(false)
    }
    getRecorridos()
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
              </div>
            </>
          }
        </div>
    </div>
  )
}

export default Cliente