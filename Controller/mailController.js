const nodemailer = require("nodemailer");

//send mail from testing account
const signup = async (req, res) => {
  
  //testing account
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  // send mail with defined transport object
  const message = {
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Successfully registed with us", // plain text body
    html: "<b>Successfully registed </b>", // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res
        .status(201)
        .json({
          msg: "you should receive an email",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

//send mail through real gmail account
const send__Mail =  (req, res) => {
    var transporter =  nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mobappssolutions131@gmail.com",
        pass: "rjncjdcsyopzycqg",
      },
    });

    var mailOptions = {
      from: "mobappssolutions131@gmail.com",
      to: "aseth9900@gmail.com",
      subject: "Sending Email using Node.js",
      html: "<h1>This is the email sendint for the learning purpose </h1>"
    };

  transporter
    .sendMail(mailOptions)
    .then((info) => {
      return res
        .status(201)
        .json({
          success : true,
          msg: "you should receive an email",
          info: info.messageId,
       });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

module.exports = { signup, send__Mail };
