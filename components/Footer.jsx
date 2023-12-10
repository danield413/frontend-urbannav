import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
    <div className="container">
        <p className="fw-bold text-white">&copy; {new Date().getFullYear()} UrbanNav. Todos los derechos reservados.</p>
    </div>
</footer>
  )
}

export default Footer