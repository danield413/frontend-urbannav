"use client";

import FormLogin from "@/components/FormLogin";
import { useGlobalState } from "@/hooks/useGlobalState"
import Link from "next/link"
import { Col, Container, Row } from "react-bootstrap";

const DashboardView = () => {

  const {user} = useGlobalState()

  return (
    <>
      {
        user ? <Container>
            <Row>
              <h1>Bienvenido</h1>
        </Row>
      </Container> : <>
      <h1>No estás logueado</h1>
      <Link href="/login" className="btn btn-primary mx-2">Inicia sesión</Link>
       </>
      }
    </>
  );
};

export default DashboardView;
