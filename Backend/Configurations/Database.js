import mongoose from "mongoose";
// on cree un fonction qui etablie une connection a la base de donnee .
const connectionDataBase = async () => {
  try {MONGODB_URI
    // on utilise la methode connect de mongoose pour se connecter a la base de donnee
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB", error);
  }
};

export default connectionDataBase;
