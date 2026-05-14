# Tienda Nemesio - pWebProyectFinal

Este es el proyecto final para la materia de Programación Web. Consiste en una aplicación web completa (Full Stack) de una tienda en línea con sistema de autenticación, gestión de inventario y procesamiento de pedidos.

## 🚀 Características

### 👤 Usuarios y Autenticación
- **Registro e Inicio de Sesión:** Implementado con JWT (JSON Web Tokens) para sesiones seguras.
- **Roles de Usuario:** Diferenciación entre `client` (clientes) y `admin` (administradores).
- **Protección de Rutas:** Middleware para validar sesiones y permisos de administrador.

### 📦 Gestión de Productos
- **Catálogo Público:** Los clientes pueden ver productos, buscarlos por nombre/descripción y ver el stock disponible.
- **Administración (Admin):** Panel exclusivo para crear, editar y gestionar el inventario de productos.

### 🛒 Carrito y Pedidos
- **Carrito de Compras:** Gestión persistente durante la sesión en el cliente.
- **Creación de Pedidos:** Sistema transaccional que valida el stock antes de confirmar la compra.
- **Historial:** Los clientes pueden consultar sus pedidos anteriores.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js & Express:** Servidor y API REST.
- **MySQL:** Base de datos relacional para usuarios, productos y pedidos.
- **JWT (jsonwebtoken):** Manejo de autenticación.
- **bcryptjs:** Encriptación de contraseñas.
- **UUID:** Generación de identificadores únicos para registros.

### Frontend
- **HTML5 & CSS3:** Estructura y diseño responsivo.
- **JavaScript (Vanilla):** Lógica del cliente y consumo de la API mediante `fetch`.

---

## ⚙️ Configuración e Instalación

### 1. Requisitos Previos
- Node.js instalado.
- MySQL Server en ejecución.

### 2. Clonar el repositorio
```bash
git clone [https://github.com/EmilianoCarb/pWebProyectFinal.git](https://github.com/EmilianoCarb/pWebProyectFinal.git)
cd pWebProyectFinal
