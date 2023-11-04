"use client";

import { useGlobalState } from "@/hooks/useGlobalState"
import { Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { idClienteRol } from "@/config/config"
import { BiSolidUserCircle } from "react-icons/bi"
import Cliente from "@/components/Cliente"
import Conductor from "@/components/Conductor"


const DashboardView = () => {

  const {user} = useGlobalState()
  const [rol, setRol] =  useState('')
  const router = useRouter()

  useEffect(() => {
    if(user) {
      if(user.role === idClienteRol) {
        setRol('Cliente')
      } else {
        setRol('Conductor')
      }
    }
  }, [])

  return (
    <>
      {
        user ? <Container>
            <Row>
              <h1 className="text-white fw-bold mt-2">Hola, <span className="text-warning">{user.name}</span> :')</h1>
              <h4 className="text-white d-flex align-items-center"> <BiSolidUserCircle  className="mx-2"/> {rol} </h4>

              {
                rol === 'Cliente' 
                ? <Cliente />
                : <Conductor />
              }

        </Row>
      </Container> : <>
        {router.push("/login")}
        {/* <AlertScreen texto="Debes iniciar sesión primero" url="/login" urlTxt="Iniciar sesión"/> */}
       </>
      }
    </>
  );
};

export default DashboardView;
