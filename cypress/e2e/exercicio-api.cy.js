/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contrato from'../contracts/usuarios.contract';

describe('Testes da Funcionalidade Usuários', () => {
  let token=

beforeEach(() => {
  cy.token('fulano@qa.com', 'teste').then( tkn => {
    token = tkn
  })
})

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
        return contrato.validateAsync(response.body)
    })
  }); 

  it('Deve listar usuários cadastrados com sucesso - GET', () => {
    cy.request({
          method: 'GET',
          url: 'usuarios'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('usuarios')
        })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    let nome = 'Enzo'
    const randomEmail = faker.internet.email()
    let senha = 'teste'
    let sim = 'true'
    cy.cadastrarUsuario(nome, randomEmail, senha, sim)
    .should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
        cy.request({
      method: 'POST',
      url: 'login',
      failOnStatusCode: false,
      body: {
        "email": "emailInvalido@qa.com",
        "password": "teste"
           }
    }).should((response) =>{
      expect(response.body.message).to.equal('Email e/ou senha inválidos')
      expect(response.status).to.equal(401)
    })
  });


  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    let nome = 'Enzo'
    const randomEmail = faker.internet.email()
    let senha = 'teste'
    let sim = 'true'
    cy.cadastrarUsuario(nome, randomEmail, senha, sim)
    .then((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
                let id = response.body._id
                cy.request({
            method: 'PUT',
            url: `usuarios/${id}`,
            body:{
                 "nome": 'Enzo Scartezini',
                 "email": randomEmail,
                "password": "teste 02",
                 "administrador": "true"
                }
        }).should(response => {
            expect(response.body.message).to.equal('Registro alterado com sucesso')
            expect(response.status).to.equal(200)
        })
  })
});
          

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    let nome = 'Enzo'
    const randomEmail = faker.internet.email()
    let senha = 'teste'
    let sim = 'true'
    cy.cadastrarUsuario(nome, randomEmail, senha, sim)
    .then((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
                let id = response.body._id
                cy.request({
            method: 'DELETE',
            url: `usuarios/${id}`,
        }).should(resp =>{
          expect(resp.body.message).equal('Registro excluído com sucesso')
          expect(resp.status).equal(200)
        })
  })
  });


});
