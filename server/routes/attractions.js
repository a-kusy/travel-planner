const router = require("express").Router()
const { Attraction } = require("../models/attraction")
const { body, validationResult } = require('express-validator')

router.post("/", body('name').not().isEmpty().trim().escape(), async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).send({ message: "Pola formularza nie mogą być puste" });
      return;
    }

    const er = validationResult(req);
    if (!er.isEmpty())
      return res.status(400).send({ message: "Wprowadzone dane są niepoprawne" })


    await new Attraction({ ...req.body }).save()
    res.status(201).send({ message: "Atrakcja została dodana pomyślnie" })

  } catch (error) {
    res.status(500).send({ message: "Wystąpił nieoczekiwany problem w dodawaniu atrakcji" })
  }
})

router.get("/", async (req, res) => {
  Attraction.find().exec().then(async () => {
    const attractions = await Attraction.find();
    res.status(200).send({ data: attractions });
  })
    .catch(error => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w pobieraniu atrakcji" });
    });
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  Attraction.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Nie można usunąć atrakcji. Być może nie istnieje.`});
      } else {
        res.send({ message: "Atrakcja została usunięta pomyślnie"});
      }
    }).catch(err => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w usuwaniu atrakcji" })
    })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  Attraction.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Nie znaleziono atrakcji." });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w szukaniu atrakcji." });
    });
})

router.put("/:id",body('name').not().isEmpty().trim().escape(), async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Edytowane dane nie mogą być puste!" });
  }

  const er = validationResult(req);
  if (!er.isEmpty())
    return res.status(400).send({ message: "Wprowadzone dane są niepoprawne" })

  const id = req.params.id;

  Attraction.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Nie można zedytować atrakcji. Być może nie istnieje.`});
      } else res.send({ message: "Atrakcja została zedytowana pomyślnie." });
    })
    .catch(err => {
      res.status(500).send({ message: "Wystąpił nieoczekiwany problem w edytowaniu atrakcji." });
    });
})

router.delete("/", async (req, res) => {
  Attraction.deleteMany({})
    .then(data => {
      res.send({ message: `Atrakcje zostały usunięte pomyślnie.`});
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Wystąpił nieoczekiwany problem w trakcie usuwania atrakcji." });
    });
})

//pobiera atrakcje po id wycieczki
router.get("/get/:tripId", async (req, res) => {
  Attraction.find({ tripId: req.params.tripId })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Wystąpił nieoczekiwany problem w trakcie szukania atrakcji."});
    });
})

//usuwa atrakcje po id wycieczki
router.delete("/delete/:tripId", async (req, res) => {
  Attraction.deleteMany({ tripId: req.params.tripId })
    .then(data => {
      res.send({ message: `Atrakcje zostały usunięte pomyślnie.` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Wystąpił nieoczekiwany problem w trakcie usuwania atrakcji." });
    });
})

module.exports = router