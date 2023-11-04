'use client'
import Link from 'next/link'
import React from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { usePathname } from "next/navigation";
import { useGlobalState } from '@/hooks/useGlobalState'

const NavTop = () => {

  const currentRoute = usePathname()

  const { user, setUser } = useGlobalState()

  console.log(user)

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" fixed="top">
    <Container>
      <Link href="/" className='navbar-brand'>
          UrbanNav
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto d-flex align-items-center">
          <Link href="/login" className={`text-secondary px-2 link-underline-dark ${ currentRoute === '/login' && 'text-white' }`} >Inicio sesión</Link>
          <Link href="/register" className={`text-secondary px-2 link-underline-dark ${ currentRoute === '/register' && 'text-white' }`}>Registro</Link>

          <Link href="/dashboard" className={`text-secondary px-2 link-underline-dark ${ currentRoute === '/dashboard' && 'text-white' }`}>Dashboard</Link>
          
          {
            user && (
              <>
                <span className="text-secondary px-2">|</span>

                <span className="text-warning text-bold">@{user.name}</span>

                <button className="btn btn-dark mx-2" onClick={logout}>Cerrar sesión</button>
              </>
            )
          }

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavTop