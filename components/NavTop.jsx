'use client'
import Link from 'next/link'
import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { usePathname } from "next/navigation";
import { useGlobalState } from '@/hooks/useGlobalState'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

const NavTop = () => {

  const currentRoute = usePathname()

  const { user, setUser } = useGlobalState()

  const logout = async () => {
    toast.success('Sesión cerrada correctamente')
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <>
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" fixed="top">
    <Container>
      <Link href="/" className='navbar-brand fw-bold'>
          UrbanNav
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto d-flex align-items-center">
          {
            !user &&
            <>
              <Link href="/login" className={`fw-bold text-secondary px-2 link-underline-dark ${ currentRoute === '/login' && 'text-white' }`} >Inicio sesión</Link>
              <Link href="/register" className={`fw-bold text-secondary px-2 link-underline-dark ${ currentRoute === '/register' && 'text-white' }`}>Registro</Link>
            </>
          }

          {
            user && <>
            <Link href="/dashboard" className={`fw-bold text-secondary px-2 link-underline-dark ${ currentRoute === '/dashboard' && 'text-white' }`}>Dashboard</Link>
            </>
          }

          
          {
            user && (
              <>
                <span className="text-secondary px-2">|</span>

                <span className="text-warning fw-bold">@{user.name}</span>

                <button className="btn btn-dark mx-2" onClick={logout}>Cerrar sesión</button>
              </>
            )
          }

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  <Toaster
    position="bottom-left"
    reverseOrder={false}
    />
  </>
    )
}

export default NavTop