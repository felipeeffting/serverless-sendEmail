'use strict';

const MAILER = require('nodemailer')

const remetente = MAILER.createTransport({
  host: 'smtp.gmail.com',
  service: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user:'xxx',
    pass:'xxx'
  }
})

module.exports.hello = async event => {

  let body = JSON.parse(event.body)
  // let emailList = body?.email Optional chaining não é suportado na versão atual do node 12.x
  let emailList = body.emailList
  let assunto = body.assunto
  let texto = body.texto

  let status
  let retorno

  if (emailList && assunto && texto) {

    let emailEnviado = {
      to: emailList,
      subject: assunto,
      text: texto
    }

    retorno = await remetente.sendMail(emailEnviado)
      .then(() => {
        status = 200
        return 'Email enviado com sucesso!'
      })
  
      .catch(err => {
        status = 500
        return err.response
      })
  } else {
    retorno = "Campos necessarios não foram recebidos"
    status = 500
  }

  return {
    statusCode: status,
    body: JSON.stringify(
      {
        conteudo: retorno
      },
      null,
      2
    ),
  };

};
