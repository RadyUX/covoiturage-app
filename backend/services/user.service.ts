import jwt from "jsonwebtoken"
import { User  } from "../models/user.models"
import { UserRepository } from "../repositories/user.repository"
import bcrypt from "bcrypt"
import { db } from "../config/db"


export class UserService{
 private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

    async register(user: User): Promise<User> {
   
    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log("Mot de passe hashé lors de l'enregistrement :", hashedPassword);

    // Crée un nouvel utilisateur
    const newUser = await this.userRepository.create({
        ...user,
        password: hashedPassword,
    });

    return newUser;
}

    async login(email: string, password: string): Promise<{ token: string; user: User }> {
    console.log("Tentative de connexion avec :", { email, password });

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
        console.error("Utilisateur non trouvé :", email);
        throw new Error("Utilisateur non trouvé");
    }

  console.log("Mot de passe en clair :", password);
console.log("Mot de passe hashé :", existingUser.password);

const isPasswordValid = await bcrypt.compare(password, existingUser.password);
console.log("Résultat de bcrypt.compare :", isPasswordValid);

if (!isPasswordValid) {
    console.error("Mot de passe incorrect pour :", email);
    throw new Error("Mot de passe incorrect");
}

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        console.error("JWT_SECRET n'est pas défini");
        throw new Error("JWT_SECRET n'est pas défini dans le fichier .env");
    }

    const token = jwt.sign({ userId: existingUser.id }, jwt_secret, { expiresIn: "24h" });
    console.log("Connexion réussie pour :", email);

    return { token, user: existingUser };
}
    }

