const Sauce = require('../models/sauce')
const fs = require('fs')
const log = require('../utils/winston')

//ajout nouvelle sauce 
exports.createSauce = (req, res, next) => {
    log.info('Création d\'une nouvelle sauce');
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    log.info(`sauce=${sauce}`);
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistré" }))
        .catch((error) => {
            log.error(`Erreur lors de la création d'une nouvelle sauce : ${error}`);
            res.status(400).json({ error });
        });
};


//modifier uen sauce
exports.modifySauce = (req, res, next) => {
    log.info('Modification d\'une sauce');
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

//récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

//récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//like/dislike

exports.likeSauce = (req, res, next) => {
    //Switch Case (1, 0, -1)
    switch (req.body.like) {
        //Si like = 1
        case 1:
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                .catch(error => res.status(400).json({ error }));
            break;
        //annuler like
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                            .then(() => res.status(200).json({ message: 'Like annulé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                            .then(() => res.status(200).json({ message: 'Dislike annulé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                }
                )
                .catch(error => res.status(404).json({ error }));
            break;
            // dislike = -1
        case -1:
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like-- }, $push: { usersDisliked: req.body.userId } })
                .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                .catch(error => res.status(400).json({ error }));
            break;
        default:
            console.error('Bad request');
    }
}

        