const router = require("express").Router()
const { Trip, validate } = require("../models/trip")
const tokenVerification = require('../middleware/tokenVerification')
const { body, validationResult} = require('express-validator')

router.post("/", [body('name').not().isEmpty().trim().escape(),
body('date').not().isEmpty().trim().escape(),
body('description').not().isEmpty().trim().escape()], tokenVerification, async (req, res) => {
  try {
    if (!req.body.name || !req.body.date || !req.body.description) {
      res.status(400).send({ message: "Pola formularza nie mogą być puste" });
      return;
    }
    
    const er = validationResult(req);
    if (!er.isEmpty())
            return res.status(400).send({ message: "Wprowadzone dane są niepoprawne" })

    req.body.userId = req.user._id
    await new Trip({ ...req.body }).save()
    res.status(201).send({ message: "Wycieczka została dodana pomyślnie" })

  } catch (error) {
    res.status(500).send({ message: "Wystąpił nieoczekiwany problem w dodawaniu wycieczki" })
  }
})

router.get("/", tokenVerification, async (req, res) => {
  Trip.find({ userId: req.user._id }).exec()
  .then(async () => {
    const trips = await Trip.find({ userId: req.user._id });
    res.status(200).send({ data: trips });
  })
    .catch(error => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w pobieraniu wycieczek" });
    });
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  Trip.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Nie można usunąć wycieczki. Być może nie istnieje.`
        });
      } else {
        res.send({
          message: "Wycieczka została usunięta pomyślnie"
        });
      }
    }).catch(err => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w usuwaniu wycieczki" })
    })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  Trip.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Nie znaleziono wycieczki." });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500).send({ message: "Wystąpił nieoczekiwany problem w szukaniu wycieczki." });
    });
})

router.put("/:id", [body('name').not().isEmpty().trim().escape(),
body('date').not().isEmpty().bail().trim().escape(),
body('description').not().isEmpty().bail().trim().escape()], async (req, res) => {
  if (!req.body || !req.body.date || !req.body.description) {
    return res.status(400).send({
      message: "Edytowane dane nie mogą być puste!"
    });
  }

  const er = validationResult(req);
  if (!er.isEmpty())
    return res.status(400).send({ message: "Wprowadzone dane są niepoprawne" })

  const id = req.params.id;

  Trip.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Nie można zedytować wycieczki. Być może nie istnieje.` });
      } else
        res.send({ message: "Wycieczka została zedytowana pomyślnie." });
    })
    .catch(err => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w edytowaniu wycieczki." });
    });
})

router.delete("/", tokenVerification, async (req, res) => {
  Trip.deleteMany({ userId: req.user._id })
    .then(data => {
      res.send({ message: `Wycieczki zostały usunięte pomyślnie. ` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Wystąpił nieoczekiwany problem w trakcie usuwania wycieczek."
      });
    });
})

module.exports = router