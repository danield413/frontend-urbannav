'use client'
import React from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'

const NavTop = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="/">UrbanNav</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/login">Inicio de sesión</Nav.Link>
          <Nav.Link href="/register">Registro</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavTop