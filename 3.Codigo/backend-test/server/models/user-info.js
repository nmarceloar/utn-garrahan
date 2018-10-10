'use strict';

module.exports = function (UserInfo) {

    UserInfo.validate('passwordConfirm', customValidator, { message: 'Las contraseñas no coinciden' });

    function customValidator(err) {

        if (this.password !== this.passwordConfirm)
            err();

    }

};
