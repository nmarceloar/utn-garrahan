# utn garrahan

Proyecto para el banco de sangre del Hospital Garrahan. Permite la gestión de órdenes de irradiación de hemocomponentes (sangre) solicitadas por los clientes. 

## Requerimientos

Instalar [mysql5.7](https://dev.mysql.com/downloads/mysql/5.7.html)

Instalar [nodejs](https://nodejs.org/en/download/)

Instalar angular-cli con:

```javascript
npm install g -@angular/cli
```

## Instalación

``` bash
Crear base de datos mysql con los siguientes datos: 

user: root
password: root
database: p2018

```

Luego:

```bash

git clone https://github.com/nmarceloar/utn-garrahan.git

cd 3.Codigo/frontend
npm install --save 

cd 3.Codigo/backend-test 
npm install --save 

```


## Ejecución

``` bash

cd 3.Codigo/backend-test
npm run start 

cd 3.Codigo/frontend
npm run start 

```


## Datos de acceso

``` bash
Acceder en http://localhost:4200

Acceso como operador: 
user: operador
pass: garrahan

Acceso como administrador: 
user: administrador
pass: garrahan

Acceso como cliente: 
user: cliente1 ó cliente2
pass: garrahan

```



