import { v4 } from "uuid";
import * as Yup from "yup";

import User from "../models/User";

class UserController {
  async store(req, res) {
    //Validando informações de entrada dos usuarios
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password_hash: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    //Tratamento de informações incorretas dos usuarios
    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    //Apresentacao dos dados dos usuarios
    const { name, email, password_hash } = req.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Resposta de dados dos usuarios
    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
    });

    return res.status(201).json({ id: user.id, name, email });
  }
}

export default new UserController();
