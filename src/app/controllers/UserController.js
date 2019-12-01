import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { uuid } from 'uuidv4';

import User from '../models/User';

import authConfig from '../../config/auth';

class UserController {
    async store(req, res) {
        const { nome, email, senha, telefones } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ mensagem: 'E-mail já existente' });
        }

        const hash = bcrypt.hashSync(senha, 8);

        const _id = uuid();

        const token = jwt.sign({ _id, nome, email }, process.env.SECRET, {
            expiresIn: authConfig.expiresIn,
        });

        const user = await User.create({
            _id,
            nome,
            email,
            senha: hash,
            telefones,
            token,
        });

        return res.status(201).json({
            user,
        });
    }

    async show(req, res) {
        const { user_id } = req.params;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        return res.status(200).json({ user });
    }
}

export default new UserController();
