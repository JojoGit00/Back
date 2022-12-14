const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();

schemaPassword
  .is()
  .min(8) // Minimum de 8 caractères requis
  .is()
  .max(20) // Maximum de 20 caractères
  .has()
  .uppercase() // contient au moins une majuscule
  .has()
  .lowercase() // contient au moins une minuscule
  .has()
  .digits() // contient au moins un chiffre
  .has()
  .not()
  .spaces(); // Ne contient pas d'espaces

module.exports = (req, res, next) => {
  if (!schemaPassword.validate(req.body.password)) {
    const message = "Votre adresse password n'a pas un format valide";
    res.status(400).json({ message });
  } else {
    next();
  }
};
