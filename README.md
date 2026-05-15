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
```text pWebProyecFinal/
├── controllers/          # Lógica de negocio y manejo de peticiones
│   ├── admin.controllers.js
│   ├── auth.controllers.js
│   ├── orders.controllers.js
│   └── product.controllers.js
├── database/             # Scripts de inicialización y datos de prueba
│   ├── init.sql
│   └── seed.js
├── lib/                  # Clientes de bases de datos y utilidades compartidas
│   └── db.js
├── middleware/           # Middlewares de Express (Autenticación, validaciones)
│   └── users.js
├── public/               # Archivos estáticos del frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├── routes/               # Definición de rutas del servidor (End-points)
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── orders.routes.js
│   └── products.routes.js
├── .env                  # Variables de entorno locales (Ignorado en Git)
├── .env.example          # Plantilla de ejemplo para las variables de entorno
├── .gitignore            # Archivos y carpetas excluidos del control de versiones
├── index.js              # Punto de entrada principal de la aplicación
├── package.json          # Dependencias y scripts del proyecto
├── package-lock.json     # Historial exacto de versiones de las dependencias
└── README.md             # Documentación del proyecto
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
