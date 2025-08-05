/// <reference types="cypress" />
import faker from '@faker-js/faker';
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
    let email = 'teste@qa.com'
    let senha = 'teste'
    let sim = 'true'
    cy.cadastrarUsuario(nome, email, senha, sim)
    .should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
  });

  it('Deve validar um usuário com email inválido - GET', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
  "email": "emailInvalido@qa.com",
  "password": "teste"
  }
    }).then((response) =>{
      expect(response.body.message).to.equal('Email e/ou senha inválidos')
      expect(response.status).to.equal(401)
    })
  });


  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    cy.request({
          method: 'GET',
          url: 'usuarios'
           })
            .then(response => {
                let id = 'PLVbKyHHFuvjHhVh'
                cy.request({
            method: 'PUT',
            url: `usuarios/${id}`,
            body:{
                 "nome": 'Enzo Scartezini',
                 "email": "teste03@qa.com.br",
                "password": "teste 02",
                 "administrador": "true"
                }
        }).should(response => {
            expect(response.body.message).to.equal('Registro alterado com sucesso')
            expect(response.status).to.equal(200)
        })
  })
});
          

  it.only('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    cy.request({
          method: 'GET',
          url: 'usuarios'
           })
            .then(response => {
                let id = 'rvMVomnlhJxROpWY'
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
