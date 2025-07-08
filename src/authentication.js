import jwt from 'jsonwebtoken';

const SECRET_KEY = 'C41'; // tengo que guardar la variable de entorno, aun no lo hago

export function generarToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verificarToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

