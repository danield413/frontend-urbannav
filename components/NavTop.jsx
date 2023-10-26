'use client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'

const NavTop = () => {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="/">UrbanNav</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link href="/login" className='text-secondary px-2 link-underline-dark' >Inicio sesión</Link>
          <Link href="/register" className='text-secondary px-2 link-underline-dark'>Registro</Link>
          
          
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavTop