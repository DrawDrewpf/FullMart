const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">FullMart</h3>
            <p className="text-gray-300">
              Tu e-commerce de confianza. Encuentra los mejores productos al mejor precio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Productos</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Acerca de</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="text-gray-300 space-y-2">
              <p>📧 info@fullmart.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Commerce St, City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 FullMart. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
