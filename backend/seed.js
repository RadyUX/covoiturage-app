"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2/promise");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, noms, prenoms, villes, modeles, couleurs, marques, commentaires, i, i, i, i, date_depart, arrive, i, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.createConnection({
                        host: 'sql7.freesqldatabase.com',
                        user: 'sql7790472',
                        password: 'uF4c1z3p38',
                        database: 'sql7790472',
                    })];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, connection.execute("SET FOREIGN_KEY_CHECKS = 0")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE participe")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE avis")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE covoiturage")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE voiture")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE utilisateur")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE marque")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("SET FOREIGN_KEY_CHECKS = 1")];
                case 9:
                    _a.sent();
                    noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert'];
                    prenoms = ['Alice', 'Lucas', 'Emma', 'Hugo', 'Chloé'];
                    villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
                    modeles = ['Model X', 'Clio', '308', 'Civic', 'Golf'];
                    couleurs = ['Rouge', 'Bleu', 'Noir', 'Blanc', 'Gris'];
                    marques = ['Tesla', 'Renault', 'Peugeot', 'Honda', 'Volkswagen'];
                    commentaires = [
                        'Très bon conducteur, ponctuel et sympa.',
                        'Voiture confortable, je recommande.',
                        'Excellent trajet, je referai volontiers.',
                        'Très agréable, musique au top.',
                        'Super covoiturage, chauffeur très prudent.',
                    ];
                    i = 1;
                    _a.label = 10;
                case 10:
                    if (!(i <= marques.length)) return [3 /*break*/, 13];
                    return [4 /*yield*/, connection.execute('INSERT IGNORE INTO marque (marque_id, libellé) VALUES (?, ?)', [i, marques[i - 1]])];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 10];
                case 13:
                    i = 1;
                    _a.label = 14;
                case 14:
                    if (!(i <= 5)) return [3 /*break*/, 17];
                    return [4 /*yield*/, connection.execute("INSERT INTO utilisateur (user_id, lastname, firstname, email, password, telephone, adress, birthdate, photo, pseudo)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                            i,
                            noms[Math.floor(Math.random() * noms.length)],
                            prenoms[Math.floor(Math.random() * prenoms.length)],
                            "user".concat(i, "@test.com"),
                            'password123',
                            "060000000".concat(i),
                            "".concat(Math.floor(Math.random() * 100), " rue ").concat(villes[i % villes.length]),
                            '2000-01-01',
                            'photo.png',
                            "pseudo".concat(i),
                        ])];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 14];
                case 17:
                    i = 1;
                    _a.label = 18;
                case 18:
                    if (!(i <= 5)) return [3 /*break*/, 21];
                    return [4 /*yield*/, connection.execute("INSERT INTO voiture (voiture_id, modele, immatriculation, energie, couleur, premiere_immatriculation_date, user_id, marque_id)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                            i,
                            modeles[i % modeles.length],
                            1000 + i,
                            i % 2 === 0,
                            couleurs[i % couleurs.length],
                            '2019-01-01',
                            i,
                            i,
                        ])];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20:
                    i++;
                    return [3 /*break*/, 18];
                case 21:
                    i = 1;
                    _a.label = 22;
                case 22:
                    if (!(i <= 5)) return [3 /*break*/, 25];
                    date_depart = new Date();
                    date_depart.setDate(date_depart.getDate() + i);
                    arrive = new Date(date_depart);
                    arrive.setHours(arrive.getHours() + 2);
                    return [4 /*yield*/, connection.execute("INSERT INTO covoiturage (covoiturage_id, date_depart, heure_depart, lieu_depart, arrive_date, arrive_heure, status, nb_place, prix, voiture_id)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                            i,
                            date_depart.toISOString().split('T')[0],
                            '08:00:00',
                            villes[i % villes.length],
                            arrive.toISOString().split('T')[0],
                            '10:00:00',
                            'disponible',
                            3,
                            15 + i,
                            i,
                        ])];
                case 23:
                    _a.sent();
                    _a.label = 24;
                case 24:
                    i++;
                    return [3 /*break*/, 22];
                case 25:
                    i = 1;
                    _a.label = 26;
                case 26:
                    if (!(i <= 5)) return [3 /*break*/, 29];
                    return [4 /*yield*/, connection.execute('INSERT INTO participe (user_id, covoiturage_id) VALUES (?, ?)', [i, i])];
                case 27:
                    _a.sent();
                    _a.label = 28;
                case 28:
                    i++;
                    return [3 /*break*/, 26];
                case 29:
                    i = 1;
                    _a.label = 30;
                case 30:
                    if (!(i <= 5)) return [3 /*break*/, 33];
                    return [4 /*yield*/, connection.execute("INSERT INTO avis (avis_id, commentaire, note, status, auteur_id, cible_id)\n   VALUES (?, ?, ?, ?, ?, ?)", [
                            i,
                            commentaires[i - 1],
                            Math.floor(Math.random() * 3) + 3,
                            'public',
                            i, // auteur
                            i === 5 ? 1 : i + 1 // cible (pour éviter l’auto-évaluation et boucler sur le premier)
                        ])];
                case 31:
                    _a.sent();
                    _a.label = 32;
                case 32:
                    i++;
                    return [3 /*break*/, 30];
                case 33:
                    console.log('✅ Données insérées avec succès.');
                    return [4 /*yield*/, connection.end()];
                case 34:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error('❌ Erreur :', err);
});
