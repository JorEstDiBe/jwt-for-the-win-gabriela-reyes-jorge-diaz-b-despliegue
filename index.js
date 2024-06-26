const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3030;
const SECRET_KEY = 'Minions';

app.use(express.json());

// Middleware para verificar el token JWT en cada ingreso a las otras rutas
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

// Endpoint para ruta raiz donde crea y envía el token 
app.post('/', (req, res) => {
  const { email, contraseña } = req.body;

  if (email === 'admin@admin.com' && contraseña === 'admin') {
    const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ message: 'Credenciales Invalidas' });
  }
});

// Endpoint para el login donde crea y envía el token 
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  if (email === 'admin@admin.com' && contraseña === 'admin') {
    const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ message: 'Credenciales Invalidas' });
  }
});


// Endpoint protegido: Profile donde devuelve un usuario x con nombre, apellido, email y fechaDeNacimiento
app.get('/profile', verifyToken, (req, res) => {
  const userProfile = {
    nombre: 'Pepito',
    apellido: 'Pérez',
    email: 'pepito.perez@hotmail.com',
    fechaDeNacimiento: '2024-04-04'
  };

  res.status(200).json(userProfile);
});

// Endpoint protegido: Form en forma de post que envia un texto y devuelve el mismo texto
app.post('/form', verifyToken, (req, res) => {
  const { text } = req.body;

  if (text) {
    res.status(200).json({ text: text });
  } else {
    res.status(400).json({ message: 'Es necesario introducir un texto' });
  }
});

// Endpoint protegido: Contacts que recupera una lista de usuarios
app.get('/contacts', verifyToken, (req, res) => {
  const contacts = [
    { nombre: 'Jorge', apellido: 'Diaz', email: 'jorgito@diaz.com' },
    { nombre: 'Gabriela', apellido: 'Reyes', email: 'gabrielita@reyes.com' },
    { nombre: 'Juan', apellido: 'Murillo', email: 'juanito@murillo.com' }
  ];

  // Crear una copia de la lista para manipularla y asi no afectar el arreglo "contacts"
  const contactosTemp = [...contacts];

  // Seleccionar el primer usuario aleatorio y eliminarlo de la lista temporal para no repetir
  const primerUsuarioAleatorio = contactosTemp.splice(Math.floor(Math.random() * contactosTemp.length), 1)[0];

  // Seleccionar el segundo usuario aleatorio de la lista temporal actualizada
  const segundoUsuarioAleatorio = contactosTemp[Math.floor(Math.random() * contactosTemp.length)];

  // Crear un array con los dos usuarios seleccionados
  const usuariosAleatorios = [primerUsuarioAleatorio, segundoUsuarioAleatorio];

  // Devolver los dos usuarios aleatorios
  res.status(200).json(usuariosAleatorios);
});

// Ruta para indicar el puerto a utilizar
app.listen(PORT, () => {
  console.log(`Esta vivito en http://localhost:${PORT}`);
});