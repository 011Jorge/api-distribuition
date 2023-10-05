import * as Yup from "yup";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    //Validando informações de login
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    //Validando email duplicado
    const userEmailOrPasswordIncorrect = () => {
      return res
        .status(400)
        .json({ error: "Make sure your password or email are correct" });
    };

    if (!(await schema.isValid(req.body))) {
      userEmailOrPasswordIncorrect();
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      userEmailOrPasswordIncorrect();
    }

    //Validando password
    if (!(await user.checkPassword(password))) {
      userEmailOrPasswordIncorrect();
    }

    return res.json({ id: user.id, email, name: user.name });
  }
}

export default new SessionController();
