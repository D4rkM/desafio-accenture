import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token not provided',
        });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

        req.userId = decoded.id;

        return next();
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(401).json({
                mensagem: 'Sessão expirada',
            });
        }
        return res.status(401).json({
            mensagem: 'Token Inválido',
        });
    }
};
