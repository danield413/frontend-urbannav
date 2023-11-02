import MiContexto from '@/context/contextApp'
import React from 'react'

export const useGlobalState = () => {
  
    const contexto = React.useContext(MiContexto);

    return {
        user: contexto.user,
        setUser: contexto.setUser
    }

}
