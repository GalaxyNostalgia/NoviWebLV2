const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// 1) EJS setup (mora biti prije res.render)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2) Static files iz /public (CSS, slike, index.html...)
app.use(express.static(path.join(__dirname, "public")));

// 3) Root ruta: serviraj index.html eksplicitno (najpouzdanije)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 4) Galerija: /slike
app.get("/slike", (req, res) => {
  const folderPath = path.join(__dirname, "public", "images");

  let files = [];
  try {
    files = fs.readdirSync(folderPath);
  } catch (e) {
    return res
      .status(500)
      .send("Ne mogu pročitati folder public/images. Provjeri da postoji.");
  }

  const images = files
    .filter((f) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f))
    .map((file, index) => ({
      url: `/images/${file}`,
      id: `slika${index + 1}`,
      title: `Slika ${index + 1}`,
    }));

  res.render("slike", { images });
});

// 5) Railway/hosting: koristi PORT iz okoline, lokalno 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});