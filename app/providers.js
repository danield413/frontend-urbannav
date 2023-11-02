'use client';

import MiContexto from "@/context/contextApp"
import axios from "axios"
import { useEffect, useState } from "react"


export function Providers({ children }) {

  const [user, setUser] = useState(null)

  useEffect(() => {
    
    const verificarToken = async () => {
      const token = localStorage.getItem('token')

      console.log(token)

      if(token) {
        const res = await axios.post('http://localhost:3001/usuario/verificar-token', { token })

        if(res.data === null) {
          localStorage.removeItem('token')
          setUser(null)
        } else {
          setUser({
            correo: res.data.email,
            idMongoDB: res.data.idMongoDB,
            name: res.data.name,
            role: res.data.role
          })
        }

      }
    }

    verificarToken()

  }, [])

  return (
    <MiContexto.Provider value={{
        user,
        setUser
    }}>
        {children}
    </MiContexto.Provider>
  );
}