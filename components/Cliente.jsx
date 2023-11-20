'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Cliente = () => {

  const [recorridos, setRecorridos] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSolicitar = (e) => {
    e.preventDefault()
    const idRecorrido = e.target[0].value

    console.log(idRecorrido)
    
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
        </div>
    </div>
  )
}

export default Cliente