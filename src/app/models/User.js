import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    email: String,
    senha: String,
    data_criacao: { type: Date, default: Date.now },
    data_atualizacao: Date,
    ultimo_login: { type: Date, default: Date.now },
    telefones: [
        {
            numero: String,
            ddd: String,
        },
    ],
    token: String,
});

export default mongoose.model('User', UserSchema);
