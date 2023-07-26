const E2E_API_URL = Cypress.env('E2E_API_URL');

export const noVatRequests = () => cy.get("[data-testid='no-vat-requests']");
export const noVatRequestErrors = () =>
  cy.get("[data-testid='no-vat-request-errors']");
export const vatRequestList = () => cy.get("[data-testid='vat-request-list']");
export const vatRequestErrorList = () =>
  cy.get("[data-testid='vat-request-error-list']");
export const vatRequests = () =>
  vatRequestList().find("[data-testid='vat-request']");
export const buttonRemove = () =>
  cy.get("[data-testid='button-uncheck-vat-request']");
export const vatRequestErrors = () =>
  vatRequestErrorList().find("[data-testid='vat-request-error']");
export const buttonResolveAllErrors = () =>
  cy.get("[data-testid='button-resolve-all-errors']");
export const buttonResolveError = () =>
  cy.get("[data-testid='button-resolve-error']");
export const buttonOpenModal = () =>
  cy.get("[data-testid='button-open-new-vat-request-modal']");
export const modal = () => cy.get("[data-testid='modal-add-new-vat-request']");
export const buttonAddNewVatRequest = () =>
  cy.get("[data-testid='button-add-new-vat-request']");
export const inputTelegramChatId = () =>
  cy.get("[data-testid='input-telegram-chat-id']");
export const inputVatNumber = () => cy.get("[data-testid='input-vat-number']");
export const inputError = () => cy.get("[data-testid='input-error']");
export const checkSilent = () => cy.get("[data-testid='check-silent']");
export const toast = () => cy.get("[data-testid='toast-message']");

export function interceptListRequests() {
  cy.intercept({
    method: 'GET',
    url: '/vat-requests'
  }).as('getVatRequests');

  cy.intercept({
    method: 'GET',
    url: '/vat-request-errors'
  }).as('getVatRequestErrors');
}

export function interceptCheckRequest() {
  cy.intercept({
    method: 'POST',
    url: '/check'
  }).as('check');
}

export function interceptUncheckRequest() {
  cy.intercept({
    method: 'POST',
    url: '/uncheck'
  }).as('uncheck');
}

export function interceptResolveErrorRequest() {
  cy.intercept({
    method: 'POST',
    url: '/resolve-error'
  }).as('resolveError');
}

export function interceptResolveAllErrorsRequest() {
  cy.intercept({
    method: 'POST',
    url: '/resolve-all-errors'
  }).as('resolveAllErrors');
}

export function interceptAllRequests() {
  interceptListRequests();
  interceptCheckRequest();
  interceptUncheckRequest();
  interceptResolveErrorRequest();
  interceptResolveAllErrorsRequest();
}

export const waitForListRequests = () => {
  cy.wait('@getVatRequests');
  cy.wait('@getVatRequestErrors');
};
export const waitForCheckRequest = () => cy.wait('@check');
export const waitForUncheckRequest = () => cy.wait('@uncheck');
export const waitForResolveAllErrorsRequest = () =>
  cy.wait('@resolveAllErrors');
export const waitForResolveErrorRequest = () => cy.wait('@resolveError');

export function checkVatRequest(telegramChatId: string, vatNumber: string) {
  modal().then((m) => {
    if (!m.hasClass('show')) {
      buttonOpenModal().click();
    }
    modal().within(() => {
      inputTelegramChatId().clear();
      inputVatNumber().clear();
      if (telegramChatId) {
        inputTelegramChatId().type(telegramChatId);
      }
      if (vatNumber) {
        inputVatNumber().type(vatNumber);
      }
      buttonAddNewVatRequest().click();
    });
  });
}

export function demoteVatRequest(
  telegramChatId: string,
  vatNumber: string,
  errorMessage?: string
) {
  cy.request('POST', `${E2E_API_URL}/demote`, {
    telegramChatId,
    vatNumber,
    errorMessage
  });
}

export function populateVatRequests() {
  interceptCheckRequest();
  checkVatRequest('123', 'PL123');
  waitForCheckRequest();
  checkVatRequest('234', 'PL234');
  waitForCheckRequest();
}

export function populateVatRequestErrors() {
  populateVatRequests();
  demoteVatRequest('123', 'PL123');
  demoteVatRequest('234', 'PL234', 'Oops2');
}

export function reset() {
  cy.request('POST', `${E2E_API_URL}/reset`);
}

export function refresh() {
  cy.window().then((w) => {
    const htmx: any = w['htmx' as any];
    htmx.trigger('#vat-request-list', 'refresh');
    htmx.trigger('#vat-request-error-list', 'refresh');
  });
}
