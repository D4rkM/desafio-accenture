import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, senha } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ mensagem: 'Usuário e/ou senha inválidos' });
        }

        if (!(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({
                mensagem: 'Usuário e/ou senha inválidos',
            });
        }
        const { _id, nome } = user;

        const token = jwt.sign({ _id, nome, email }, process.env.SECRET, {
            expiresIn: authConfig.expiresIn,
        });

        User.updateOne({ email }, { token, ultimo_login: Date.now() });

        return res.json({
            user,
        });
    }
}

export default new SessionController();
