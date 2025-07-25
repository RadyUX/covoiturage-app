import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { describe, it, expect, beforeEach, vi } from "vitest";


describe("UserService - updateRoles", () => {
    let userService: UserService;
   let userRepository: {
  findById: ReturnType<typeof vi.fn>,
  getUserRoles: ReturnType<typeof vi.fn>,
  addRoleToUser: ReturnType<typeof vi.fn>,
  removeRoleFromUser: ReturnType<typeof vi.fn>,
};

beforeEach(() => {
  userRepository = {
    findById: vi.fn(),
    getUserRoles: vi.fn(),
    addRoleToUser: vi.fn(),
    removeRoleFromUser: vi.fn(),
  };

  userService = new UserService(userRepository as any);
});
    it("ajoute et supprime les rôles correctement", async () => {
        userRepository.findById.mockResolvedValue({ id: 1, email: "user1@test.com", password: "password123" });
        userRepository.getUserRoles.mockResolvedValue(["passager"]);

        await userService.updateRoles(1, ["chauffeur"]);

        expect(userRepository.addRoleToUser).toHaveBeenCalledWith(1, "chauffeur");
        expect(userRepository.removeRoleFromUser).toHaveBeenCalledWith(1, "passager");
    });

    it("lève une erreur si l'utilisateur n'existe pas", async () => {
        userRepository.findById.mockResolvedValue(null);

        await expect(userService.updateRoles(1, ["chauffeur"])).rejects.toThrow("Utilisateur introuvable");
    });
});