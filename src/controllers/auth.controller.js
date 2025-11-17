import { registerService, loginService} from "../services/auth.service.js";

export const cookieOptions = {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const user = await registerService(username, email, password);
        return res.status(201).json({
            message: "User registered successfully",
            data: user,
        });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const { token, user } = await loginService(email, password);

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Login successful",
            token,
            data: user,
        });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};
