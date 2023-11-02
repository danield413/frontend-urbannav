'use client';

import MiContexto from "@/context/contextApp"
import { useState } from "react"


export function Providers({ children }) {

    const [user, setUser] = useState(null)

  return (
    <MiContexto.Provider value={{
        user,
        setUser
    }}>
        {children}
    </MiContexto.Provider>
  );
}