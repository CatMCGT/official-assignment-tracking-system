export default function checkRole(id) {
    const letter = id[0];
    if (letter == "a") return "admin";
    if (letter == "s") return "student";
    if (letter == "t") return "teacher";
}