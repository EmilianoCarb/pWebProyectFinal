# Tienda Nemesio — pWebProyectFinal

Proyecto final para la materia de Programación Web. Aplicación web Full Stack de una tienda en línea con autenticación JWT, gestión de inventario y procesamiento de pedidos.

---

## 🚀 Características

### 👤 Usuarios y Autenticación
- Registro e inicio de sesión con JWT.
- Roles diferenciados: `client` y `admin`.
- Middleware de protección de rutas por token y rol.
- Sesión persistente en el frontend mediante `localStorage`.

### 📦 Gestión de Productos
- Catálogo con búsqueda por nombre y descripción.
- Indicador de stock disponible en tiempo real.
- Panel admin para crear, editar y gestionar inventario.
- Validación de precios y stock no negativos.

### 🛒 Carrito y Pedidos
- Carrito de compras con control de cantidades y stock máximo.
- Creación de pedidos con transacción SQL (rollback automático ante errores).
- Descuento de stock al confirmar compra.
- Historial de pedidos con detalle de productos y precios al momento de compra.

---

## 🛠️ Tecnologías

### Backend
- **Node.js & Express** — Servidor y API REST.
- **MySQL2** — Base de datos relacional.
- **JWT (jsonwebtoken)** — Autenticación por token.
- **bcryptjs** — Hash de contraseñas.
- **UUID** — Identificadores únicos.
- **dotenv** — Variables de entorno.

### Frontend
- **HTML5, CSS3, JavaScript Vanilla** — Sin frameworks.
- **Fetch API** — Consumo de la API REST.

---

## ⚙️ Instalación

### Requisitos
- Node.js v18 o superior
- MySQL Server en ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/EmilianoCarb/pWebProyectFinal.git
cd pWebProyectFinal
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiá el archivo de ejemplo y completá los valores:
```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_api
PORT=5000
JWT_SECRET=una_clave_secreta_segura
```

### 4. Crear la base de datos
Entrá a MySQL y ejecutá:
```bash
mysql -u root -p < database/init.sql
```

### 5. Iniciar el servidor
```bash
npm start
```

Al iniciar por primera vez se crean automáticamente:
- Usuario admin: `admin@tienda.com` / `admin1234`
- 8 productos de ejemplo

Abre el navegador en `http://localhost:5000`

## 📁 Estructura del Proyecto
```text
pWebProyectFinal/
├── controllers/
│   ├── admin.controllers.js      # Listar clientes (solo admin)
│   ├── auth.controllers.js       # Registro y login con JWT
│   ├── orders.controllers.js     # Crear pedidos y consultar historial
│   └── product.controllers.js   # CRUD de productos
├── database/
│   ├── init.sql                  # Esquema de tablas
│   └── seed.js                   # Crea el admin y productos de ejemplo al iniciar
├── lib/
│   └── db.js                     # Pool de conexión MySQL
├── middleware/
│   └── users.js                  # Validación de token y rol admin
├── public/
│   ├── index.html
│   ├── script.js                 # Lógica del frontend y consumo de la API
│   └── style.css
├── routes/
│   ├── admin.routes.js           # Rutas protegidas para administrador
│   ├── auth.routes.js
│   ├── orders.routes.js
│   └── products.routes.js
├── .env.example                  # Variables de entorno requeridas
├── .gitignore
├── index.js                      # Punto de entrada del servidor
└── package.json
```
## 🔌 Endpoints de la API

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar cliente |
| POST | `/auth/login` | Iniciar sesión |

### Productos (requiere token)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/search?q=` | Buscar productos |

### Pedidos (requiere token)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/orders` | Ver mis pedidos |
| POST | `/orders` | Crear nuevo pedido |

### Admin (requiere token + rol admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/clients` | Ver todos los clientes |
| GET | `/admin/products` | Ver todos los productos |
| POST | `/admin/products` | Agregar producto nuevo |
| PUT | `/admin/products/:id` | Modificar producto |

---

## 🧪 Comandos CURL de prueba

```bash
# Login admin
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tienda.com", "password": "admin1234"}'

# Ver todos los clientes (admin)
curl -X GET http://localhost:5000/admin/clients \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Ver todos los productos (admin)
curl -X GET http://localhost:5000/admin/products \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Agregar producto nuevo (admin)
curl -X POST http://localhost:5000/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{"name": "Chamarra", "description": "Resistente al viento", "price": 1599, "stock": 25}'

# Modificar producto (admin)
curl -X PUT http://localhost:5000/admin/products/UUID_PRODUCTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{"name": "Chamarra premium", "description": "Resistente al viento y agua", "price": 1899, "stock": 20}'
```

---

## 👤 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@tienda.com | admin1234 |
| Cliente | (registrarse desde la app) | — |
