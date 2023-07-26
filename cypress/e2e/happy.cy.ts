import {
  checkVatRequest,
  buttonRemove as buttonUncheck,
  buttonResolveAllErrors,
  buttonResolveError,
  checkSilent,
  inputError,
  inputTelegramChatId,
  inputVatNumber,
  interceptAllRequests,
  modal,
  noVatRequestErrors,
  noVatRequests,
  populateVatRequestErrors,
  populateVatRequests,
  refresh,
  reset,
  toast,
  vatRequestErrors,
  vatRequests,
  waitForCheckRequest,
  waitForResolveAllErrorsRequest,
  waitForResolveErrorRequest,
  waitForUncheckRequest
} from './shared';

const HOST = Cypress.env('HOST') || 'http://localhost';
const PORT = Cypress.env('PORT') || 7071;

describe('Happy Tests!', () => {
  before(() => {
    reset();

    cy.visit(`${HOST}:${PORT}`);

    // Remove fade animations on modal because they interfere with testing.
    modal().then((m) => {
      m.removeClass('fade');
    });
  });

  beforeEach(() => {
    interceptAllRequests();
  });

  context('When trying to add new VAT Request', () => {
    before(() => {
      reset();
      refresh();
    });

    context("You can't submit form", () => {
      it('If you omit both Telegram Chat ID and VAT Number', () => {
        checkVatRequest('', '');
        modal().should('be.visible');
      });

      it('If you fill out Telegram Chat ID but omit VAT Number', () => {
        checkVatRequest('123', '');
        modal().should('be.visible');
      });

      it('If you fill out VAT Number but omit Telegram Chat ID', () => {
        checkVatRequest('', 'PL123');
        modal().should('be.visible');
      });
    });

    context('Submitting the form', () => {
      it("Should result in VAT number appearing in the list if it's not yet registered in VIES", () => {
        checkVatRequest('123', 'PL123');
        waitForCheckRequest().should((xhr) => {
          expect(xhr.request.body).to.equal(
            'input-telegram-chat-id=123&input-vat-number=PL123'
          );
          expect(xhr.response?.statusCode).to.equal(200);
        });
        toast().should(
          'contain.text',
          'Successfully registered new VAT request'
        );
        vatRequests()
          .first()
          .within(() => {
            inputTelegramChatId().should('have.value', '123');
            inputVatNumber().should('have.value', 'PL123');
          });
      });
    });

    context('Submitting the form the second time', () => {
      it("Should not add VAT number to the list if it's already there", () => {
        checkVatRequest('123', 'PL123');
        waitForCheckRequest().should((xhr) => {
          expect(xhr.request.body).to.equal(
            'input-telegram-chat-id=123&input-vat-number=PL123'
          );
          expect(xhr.response?.statusCode).to.equal(200);
        });
        toast().should(
          'contain.text',
          'Successfully registered new VAT request'
        );
        vatRequests().should('have.length', 1);
      });

      it("Should add VAT number to the list if it's different", () => {
        checkVatRequest('234', 'PL234');
        waitForCheckRequest().should((xhr) => {
          expect(xhr.request.body).to.equal(
            'input-telegram-chat-id=234&input-vat-number=PL234'
          );
          expect(xhr.response?.statusCode).to.equal(200);
        });
        toast().should(
          'contain.text',
          'Successfully registered new VAT request'
        );
        vatRequests().should('have.length', 2);
      });
    });
  });

  context('Pressing the "Remove" button', () => {
    before(() => {
      reset();
      populateVatRequests();
      refresh();
    });

    it('Should remove this VAT Request from the list', () => {
      vatRequests()
        .first()
        .within(() => {
          buttonUncheck().click();
        });
      waitForUncheckRequest().then((xhr) => {
        expect(xhr.request.body).to.equal(
          'input-telegram-chat-id=123&input-vat-number=PL123'
        );
        expect(xhr.response?.statusCode).to.equal(200);
      });
      vatRequests().should('have.length', 1);
    });

    it('Should display the "no content" message if there are no more items in the list', () => {
      vatRequests()
        .first()
        .within(() => {
          buttonUncheck().click();
        });
      waitForUncheckRequest();
      noVatRequests().should('be.visible');
    });
  });

  context('When there are VAT Request Errors present in the list', () => {
    before(() => {
      reset();
      refresh();
    });

    context('"Resolve All" button', () => {
      before(() => {
        populateVatRequestErrors();
        refresh();
      });

      it('Should be visible', () => {
        buttonResolveAllErrors().should('be.visible');
      });

      context('When clicked', () => {
        before(() => {
          buttonResolveAllErrors().click();
        });

        it('Should leave the errors list empty', () => {
          noVatRequestErrors().should('be.visible');
        });

        it('Should bring back errored VAT Requests', () => {
          vatRequests().should('have.length', 2);
        });
      });
    });

    context('"Resolve" button', () => {
      before(() => {
        populateVatRequestErrors();
        refresh();
        vatRequestErrors()
          .first()
          .within(() => {
            buttonResolveError().click();
          });
      });

      it('Should remove error from the list', () => {
        vatRequestErrors().should('have.length', 1);
        vatRequestErrors()
          .first()
          .within(() => {
            inputTelegramChatId().should('have.value', '234');
            inputVatNumber().should('have.value', 'PL234');
            inputError().should('have.value', 'Oops2');
          });
      });

      it('Should bring back the errored VAT Request', () => {
        vatRequests().should('have.length', 1);
        vatRequests()
          .first()
          .within(() => {
            inputTelegramChatId().should('have.value', '123');
            inputVatNumber().should('have.value', 'PL123');
          });
      });
    });
  });

  context('When "silent" check box is checked', () => {
    before(() => {
      reset();
      populateVatRequestErrors();
      refresh();
      checkSilent().check();
    });

    context('"silent" param should be added to', () => {
      it('"check" API call', () => {
        checkVatRequest('1234', 'PL1234');
        waitForCheckRequest().then((xhr) => {
          expect(xhr.request.body).to.include('silent=on');
        });
      });

      it('"uncheck" API call', () => {
        vatRequests()
          .first()
          .within(() => {
            buttonUncheck().click();
          });
        waitForUncheckRequest().then((xhr) => {
          expect(xhr.request.body).to.include('silent=on');
        });
      });

      it('"resolve-error" API call', () => {
        vatRequestErrors()
          .first()
          .within(() => {
            buttonResolveError().click();
          });
        waitForResolveErrorRequest().then((xhr) => {
          expect(xhr.request.body).to.include('silent=on');
        });
      });

      it('"resolve-all-errors" API call', () => {
        buttonResolveAllErrors().click();
        waitForResolveAllErrorsRequest().then((xhr) => {
          expect(xhr.request.body).to.include('silent=on');
        });
      });
    });
  });
});
