# 🛡️ Panel de Administración - FullMart

## 📋 Descripción

El panel de administración de FullMart permite a los administradores gestionar usuarios, productos, órdenes y ver estadísticas del negocio.

## 🔐 Acceso de Administrador

### Credenciales por Defecto
- **Email**: `admin@fullmart.com`
- **Contraseña**: `admin123`

### Creación de Usuarios Admin
Para crear un usuario administrador adicional, ejecuta:
```bash
cd backend
node create_admin.js
```

## 📊 Funcionalidades del Panel

### 1. Dashboard Principal (`/admin/dashboard`)
- **Estadísticas Generales**: Total de usuarios, productos, órdenes y ingresos
- **Órdenes Recientes**: Lista de las últimas 10 órdenes
- **Productos Más Vendidos**: Top 5 productos con mayor volumen de ventas
- **Ingresos Mensuales**: Gráfico de ingresos de los últimos 6 meses

### 2. Gestión de Usuarios (`/admin/users`)
- **Lista de Usuarios**: Visualización paginada de todos los usuarios
- **Búsqueda**: Filtrar usuarios por nombre o email
- **Información Detallada**: 
  - Datos personales (nombre, email)
  - Rol (Usuario/Administrador)
  - Fechas de registro y última actualización

### 3. Gestión de Órdenes (`/admin/orders`)
- **Lista de Órdenes**: Visualización paginada de todas las órdenes
- **Filtros**: Por estado (pendiente, procesando, enviado, entregado, cancelado)
- **Gestión de Estados**: Cambiar el estado de las órdenes directamente
- **Información Detallada**:
  - Datos del cliente y envío
  - Monto total
  - Estado actual
  - Fecha de creación

### 4. Gestión de Productos (`/admin/products`)
- **Lista de Productos**: Visualización paginada de todos los productos
- **Búsqueda**: Filtrar por nombre o descripción
- **Filtros**: Por categoría
- **Información Detallada**:
  - Imagen, nombre y descripción
  - Precio y categoría
  - Stock disponible
  - Estado (activo/inactivo)

## 🔧 APIs Administrativas

### Endpoints Disponibles

#### Dashboard
```
GET /api/admin/dashboard
```
Retorna estadísticas generales, órdenes recientes, productos más vendidos e ingresos mensuales.

#### Usuarios
```
GET /api/admin/users?page=1&limit=20&search=query
```
Lista usuarios con paginación y búsqueda.

#### Órdenes
```
GET /api/admin/orders?page=1&limit=20&status=pending
PUT /api/admin/orders/:id/status
```
Lista órdenes con filtros y permite actualizar el estado.

#### Productos
```
GET /api/admin/products?page=1&limit=20&search=query&category=Electronics
```
Lista productos con filtros y búsqueda.

## 🛡️ Seguridad

- **Autenticación**: Todas las rutas requieren token JWT válido
- **Autorización**: Solo usuarios con rol `admin` pueden acceder
- **Middleware**: `requireAdmin` protege todas las rutas administrativas
- **Frontend**: Componente `ProtectedRoute` con verificación de rol

## 🎨 Interfaz de Usuario

### Características del UI
- **Responsive**: Diseño adaptativo para dispositivos móviles
- **Navegación**: Acceso directo desde el menú de usuario
- **Paginación**: Manejo eficiente de grandes cantidades de datos
- **Búsqueda en Tiempo Real**: Con debounce para mejor rendimiento
- **Estados Visuales**: Indicadores claros de stock, estados de órdenes, etc.

### Iconografía
- 📊 Dashboard: Estadísticas y métricas
- 👥 Usuarios: Gestión de cuentas
- 🛒 Órdenes: Seguimiento de pedidos
- 📦 Productos: Inventario y catálogo

## 🚀 Instalación y Configuración

1. **Backend**: Las rutas están configuradas en `/api/admin/*`
2. **Frontend**: Las páginas están en `src/pages/Admin*`
3. **Navegación**: Configurada automáticamente en el Header
4. **Protección**: ProtectedRoute verifica roles automáticamente

## 📱 Acceso desde la Aplicación

1. Inicia sesión con credenciales de administrador
2. Ve al menú de usuario (esquina superior derecha)
3. En la sección "Administración" encontrarás:
   - 📊 Dashboard
   - 📦 Productos  
   - 🛒 Órdenes
   - 👥 Usuarios

## 🔄 Estados de Órdenes

- **Pendiente**: Orden recién creada
- **Procesando**: Orden en preparación
- **Enviado**: Orden en tránsito
- **Entregado**: Orden completada
- **Cancelado**: Orden cancelada

## 📈 Métricas Disponibles

- Total de usuarios registrados
- Total de productos activos
- Total de órdenes procesadas
- Ingresos totales generados
- Tendencias mensuales
- Productos más populares
