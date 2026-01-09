/// <reference types="cypress" />

describe('Exchange API', () => {
    const apiKey = Cypress.env('VITE_EXCHANGE_API_KEY');
    const apiUrl = Cypress.env('VITE_EXCHANGE_API_URL');

    it('status 200: success request for an exchange from USD to HNL', () => {
        let amount = 10;
        cy.request({
            method: 'GET',
            url: `${apiUrl}/pair/USD/HNL/${amount}`,
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);

            const body = response.body;
            expect(body).to.include.all.keys(
                'result',
                'documentation',
                'terms_of_use',
                'time_last_update_unix',
                'time_last_update_utc',
                'time_next_update_unix',
                'time_next_update_utc',
                'base_code',
                'target_code',
                'conversion_rate',
                'conversion_result',
            );

            expect(body.result).to.eq('success');
            expect(body.base_code).to.eq('USD');
            expect(body.target_code).to.eq('HNL');
            expect(body.conversion_rate).to.be.a('number').and.be.greaterThan(0);
            expect(body.conversion_result).to.be.closeTo(body.conversion_rate * amount, 0.0001);
        });
    });

    it('status 401: unauthorized request for using an invalid API key', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/pair/USD/HNL/1`,
            headers: { Authorization: 'Bearer invalid-key' },
            failOnStatusCode: false,
        }).then((response) => {
            expect([401, 403]).to.include(response.status);

            const body = response.body;
            expect(body).to.include.all.keys('result', 'error-type');
            expect(body.result).to.not.eq('success');
        });
    });

    it('status 404: invalid request for an incorrect currency code', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/pair/UZD/HNL/1`,
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);

            const body = response.body;
            expect(body).to.include.all.keys('result', 'error-type');
            expect(body.result).to.not.eq('success');
            expect(body['error-type']).to.match(/unsupported-code/i);
        });
    });
});