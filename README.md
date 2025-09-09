# FullMart 🛒

**FullMart** es un mini e-commerce fullstack diseñado como proyecto de portfolio. Permite a los usuarios navegar productos, agregarlos al carrito y realizar autenticación completa. Sistema completamente funcional con backend Express y frontend React.

## 🚀 Tecnologías

**Frontend:** React + TypeScript + Redux Toolkit + Tailwind CSS  
**Backend:** Node.js + Express + TypeScript  
**Base de datos:** PostgreSQL  
**Autenticación:** JWT (JSON Web Tokens)  
**Desarrollo:** Vite + ESLint + Nodemon  
**Containerización:** Docker + docker-compose  

## ✨ Funcionalidades Implementadas

✅ **Sistema de Productos**
- Listado de productos con paginación
- Detalle individual de productos
- Imágenes dinámicas con fallbacks por categoría

✅ **Carrito de Compra**
- Agregar/eliminar productos del carrito
- Actualizar cantidades
- Persistencia por usuario autenticado
- Cálculo automático de totales

✅ **Autenticación Completa**
- Registro de usuarios
- Login/Logout
- Protección de rutas
- Gestión de sesiones con JWT

✅ **Base de Datos**
- 100 productos precargados
- Gestión de usuarios y carritos
- Relaciones optimizadas

## 📁 Estructura del Proyecto

```
FullMart/
├── backend/
│   ├── src/
│   │   ├── config/database.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── cart.routes.ts
│   │   │   └── product.routes.ts
│   │   ├── middleware/
│   │   ├── types/
│   │   └── index.ts
│   ├── sql/
│   │   ├── init_db.sql
│   │   └── add_100_products.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── docker-compose.yml
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/DrawDrewpf/FullMart.git
cd FullMart
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

**Configuración de .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullmart
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_super_seguro
PORT=3001
```

### 3. Configurar Base de Datos
```bash
# Crear la base de datos
createdb fullmart

# Ejecutar scripts SQL
psql -d fullmart -f sql/init_db.sql
psql -d fullmart -f sql/add_100_products.sql

# O cargar productos con Node.js
node load_products.js
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

### 5. Ejecutar el Proyecto

**Backend (Puerto 3001):**
```bash
cd backend
npm run dev
```

**Frontend (Puerto 5174):**
```bash
cd frontend
npm run dev
```

## 🐳 Ejecutar con Docker

```bash
# Ejecutar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle de producto

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart/:productId` - Actualizar cantidad
- `DELETE /api/cart/:productId` - Eliminar del carrito

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con nodemon
npm run build    # Compilar TypeScript
npm start        # Producción
```

### Frontend
```bash
npm run dev      # Desarrollo con Vite
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

## 🌟 Características Técnicas

- **Autenticación JWT** con middleware de protección
- **Validación de datos** con Zod
- **Gestión de estado** con Redux Toolkit
- **Responsive design** con Tailwind CSS
- **Imágenes optimizadas** con fallbacks automáticos
- **Arquitectura modular** y escalable
- **TypeScript** en frontend y backend
- **Manejo de errores** centralizado

## 📱 Funcionalidades de Usuario

1. **Registro/Login** - Sistema completo de autenticación
2. **Navegación de productos** - Catálogo con búsqueda y filtros
3. **Carrito dinámico** - Agregar, modificar y eliminar productos
4. **Persistencia** - Carrito guardado por usuario
5. **Responsive** - Funciona en móvil y desktop

## 🚧 Estado del Proyecto

✅ **Completado y funcional:**
- Sistema de autenticación
- Gestión de productos
- Carrito de compra
- Base de datos con productos
- Frontend responsive
- Backend API REST

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado por [DrawDrewpf](https://github.com/DrawDrewpf)** 🚀
