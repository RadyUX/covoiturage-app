import jwt from "jsonwebtoken"
import { User  } from "../models/user.models"
import { UserRepository } from "../repositories/user.repository"
import bcrypt from "bcrypt"
import { db } from "../config/db"
import { CreditService } from "./credit.service"
import { CreditRepository } from "../repositories/credit.repository"

type SafeUser = Omit<User, "password">;

const creditRepository = new CreditRepository()

export class UserService{
 private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
   
  }

    async register(user: Pick<User, "email" | "password" | "pseudo">): Promise<SafeUser> {
   
    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log("Mot de passe hashé lors de l'enregistrement :", hashedPassword);
     const sanitizedUser = {
    email: user.email,
    pseudo: user.pseudo,
    password: hashedPassword,
  };

    // Crée un nouvel utilisateur
    const newUser = await this.userRepository.create(sanitizedUser);
console.log("ID du nouvel utilisateur :", newUser.id);

    if (typeof newUser.id !== "number") {
        throw new Error("L'identifiant de l'utilisateur nouvellement créé est invalide.");
    }
    await creditRepository.createInitialCredits(newUser.id, 20);

     const { password: _, ...safeUser } = newUser;
console.log("Nouvel utilisateur créé :", newUser);
    return safeUser;
}

    async login(email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    console.log("Tentative de connexion avec :", { email, password });

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
        console.error("Utilisateur non trouvé :", email);
        throw new Error("Utilisateur non trouvé");
    }



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

    const token = jwt.sign({
  userId: existingUser.id,
  email: existingUser.email,
  pseudo: existingUser.pseudo
}, jwt_secret, { expiresIn: "24h" });
    console.log("Connexion réussie pour :", email);

console.log("Utilisateur trouvé :", existingUser);
console.log("ID utilisateur :", existingUser?.id);
  const safeUser: SafeUser = {
  id: existingUser.id, // Ajoute explicitement l'ID utilisateur
  firstname: existingUser.firstname,
  lastname: existingUser.lastname,
  email: existingUser.email,
  telephone: existingUser.telephone,
  adress: existingUser.adress,
  birthdate: existingUser.birthdate,
  photo: existingUser.photo,
  pseudo: existingUser.pseudo,
};

console.log("Utilisateur renvoyé :", safeUser);
return { token, user: safeUser };
}

async updateRoles(userId: number, roles: string[]): Promise<void> {
    // Vérifie si l'utilisateur existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    // Récupère les rôles actuels de l'utilisateur
    const currentRoles = await this.userRepository.getUserRoles(userId);

    // Détermine les rôles à ajouter
    const rolesToAdd = roles.filter((role) => !currentRoles.includes(role));

    // Détermine les rôles à supprimer
    const rolesToRemove = currentRoles.filter((role) => !roles.includes(role));

    // Ajoute les nouveaux rôles
    for (const role of rolesToAdd) {
        await this.userRepository.addRoleToUser(userId, role);
    }

    // Supprime les rôles désélectionnés
    for (const role of rolesToRemove) {
        await this.userRepository.removeRoleFromUser(userId, role);
    }
}


async userGetRoles(userId: number): Promise<string[]>{
    const user = await this.userRepository.findById(userId);
    if (!user) {
        throw new Error("Utilisateur introuvable");
    }
    const roles = await this.userRepository.getUserRoles(userId);
    return roles;
}


    }

