

module.exports = {
    accountActivation: (data) => `<h1>Hospital de Pediatría S.A.M.I.C. Prof. Dr. Juan P. Garrahan</h1><h3>Banco de Sangre | Centro Regional de Hemoterapia</h3><p>Estimado: ${data.user.firstname} ${data.user.lastname}, su cuenta se ha registrado correctamente.</p><p>Para activar la misma, debe ingresar <a href="http://localhost:4200/confirmar-cuenta?token=${data.token}">aquí</a></p>`,
    passwordReset: (data) => `<h1>Hospital de Pediatría S.A.M.I.C. Prof. Dr. Juan P. Garrahan</h1><h3>Banco de Sangre | Centro Regional de Hemoterapia</h3><p>Estimado: ${data.user.firstname} ${data.user.lastname}, su nombre de usuario es: <strong>${data.user.username}</strong></p><p>Para cambiar su contraseña haga click <a href="http://localhost:4200/password-change?token=${data.token}">aquí</a></p>`


}
