import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dptopasantesytesistasuts@gmail.com",
    pass: "lvwj ksub ohrm veuc",
  },
});

transporter
  .verify()
  .then(() => console.log("gmail conectado con exito!..."))
  .catch((error) => console.error(error));

export default transporter;
