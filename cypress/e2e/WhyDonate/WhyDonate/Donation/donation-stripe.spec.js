import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';
import { connect } from '@planetscale/database'

describe('Stripe Donation Module Tests', { tags: ['@transactionsTag'] }, () => {
  // Split the URL string by the semicolon
  var orders = []
  var amount = 50

  // // IT SHOULD HAVE LOGO
  it('Donation with Sofort Method', () => {
    const payload =
    {
      "fundraising_local_id": 28452,
      "currency_code": "eur",
      "lang": "en",
      "description": "Tip Disabled Donations",
      "bank_account": "",
      "return_url": "http://localhost:4200/donate/check-payment-status/",
      "amount": amount,
      "tip": "15",
      "is_tip_enabled": true,
      "tip_percentage": 15,
      "tip_amount": 15,
      "other_tip_amount": 1,
      "source": "web",
      "pay_period": "once",
      "is_anonymous": false,
      "newsletter": false,
      "first_name": "Yash",
      "last_name": "Jain",
      "email": "cypress.whydonate@gmail.com"
    }
    cy.request({
      method: 'POST',
      url: `${environment.donation_url}/donation/order`,
      body: payload
    }).then((response) => {
      // cy.window().then(win => win.location.href = );

      cy.visitAndVerify(`https://checkout.stripe.com${response.body.data.url.split('https://pay.whydonate.com')[1]}`)
      cy.wait(2000);
      cy.get('body').then(($body) => {
        cy.get("#email").type("yash@whydonate.com")
        cy.get('#sofort-tab').then(($sofort) => {
          if ($sofort.is(':visible')) {
            cy.get('#sofort-tab').click();
          } else {
            cy.get('.Tabs-TabListItem--overflow-toggle').click();
            cy.get('#sofort-tab').click();
          }
        });
        cy.wait(1000).get('#billingName').type("Yash Jain")
        cy.document().then((doc) => {
          try {
            const $billingPostalCode = doc.querySelector('#billingPostalCode');
            if ($billingPostalCode) {
              cy.wrap($billingPostalCode).type('123456');
              // Add your assertions or further actions here
            } else {
              // Handle the case when the element is not found
              // For example, log a message or perform alternative actions
              cy.log('Element not found: #billingPostalCode');
              // Or execute alternative actions if needed
              // cy.get('#otherElement').click();
            }
          } catch (error) {
            // Handle any other errors that may occur
            cy.log('An error occurred:', error);
          }
        });

        // Perform other actions or assertions when the element doesn't exist
        cy.wait(1000).get('.SubmitButton').click()
        cy.wait(10000)
        cy.get('.common-Button--default').click()
        cy.wait(10000)

        cy.wait(2000);
        cy.get('#donationSendThanksMessage').type('Thank you so much');
        cy.get('#donateAnonymous').click();
        cy.get('#donationAddress').type('167 A block');
        cy.get('#donationCity').type("Hells Kitchen");
        cy.get('#donationZipCode').type('512203');
        cy.get('#donationCountry').type('Gotham');
        cy.get('#donationSave').click({ force: true });
        cy.url().should('include', 'donate/share/');
        cy.url().should('include', 'orderId').then(url => {
          const orderId = url.split(';orderId=')[1];
          cy.log(orderId);
          orders.push({ id: orderId, tip: false })
          console.log(orders)
        });
      });
    });
  });

  it('Donation with Bancontact yearly Method', () => {
    const payload =
    {
      "fundraising_local_id": 28451,
      "currency_code": "eur",
      "lang": "en",
      "description": "Save trees and animals 1699379872621",
      "bank_account": "",
      "return_url": "http://localhost:4200/donate/check-payment-status/",
      "amount": amount,
      "tip": "15",
      "is_tip_enabled": true,
      "tip_percentage": 15,
      "tip_amount": 15,
      "other_tip_amount": 1,
      "source": "web",
      "pay_period": "once",
      "is_anonymous": false,
      "newsletter": false,
      "first_name": "Yash",
      "last_name": "Jain",
      "email": "cypress.whydonate@gmail.com"
    }
    cy.request({
      method: 'POST',
      url: `${environment.donation_url}/donation/order`,
      body: payload
    }).then((response) => {
      // cy.window().then(win => win.location.href = );
      cy.visitAndVerify(`https://checkout.stripe.com${response.body.data.url.split('https://pay.whydonate.com')[1]}`)
      cy.wait(2000);
      cy.get("#email").type("yash@whydonate.com")
      cy.get('#bancontact-tab').then(($sofort) => {
        if ($sofort.is(':visible')) {
          cy.get('#bancontact-tab').click();
        } else {
          cy.get('.Tabs-TabListItem--overflow-toggle').click();
          cy.get('#bancontact-tab').click();
        }
      });
      cy.wait(1000).get('#billingName').type("Yash Jain")
      cy.document().then((doc) => {
        try {
          const $billingPostalCode = doc.querySelector('#billingPostalCode');
          if ($billingPostalCode) {
            cy.wrap($billingPostalCode).type('123456');
            // Add your assertions or further actions here
          } else {
            // Handle the case when the element is not found
            // For example, log a message or perform alternative actions
            cy.log('Element not found: #billingPostalCode');
            // Or execute alternative actions if needed
            // cy.get('#otherElement').click();
          }
        } catch (error) {
          // Handle any other errors that may occur
          cy.log('An error occurred:', error);
        }
      });
      // Perform other actions or assertions when the element doesn't exist
      cy.wait(1000).get('.SubmitButton').click()
      cy.wait(10000)
      cy.get('.common-Button--default').click()
      cy.wait(10000)

      cy.wait(2000);
      cy.get('#donationSendThanksMessage').type('Thank you so much');
      cy.get('#donateAnonymous').click();
      cy.get('#donationAddress').type('167 A block');
      cy.get('#donationCity').type("Hells Kitchen");
      cy.get('#donationZipCode').type('512203');
      cy.get('#donationCountry').type('Gotham');
      cy.wait(1000);
      cy.get('#donationSave').click({ force: true });
      cy.url().should('include', 'donate/share/');
      cy.url().should('include', 'orderId').then(url => {
        const orderId = url.split(';orderId=')[1];
        cy.log(orderId);
        orders.push({ id: orderId, tip: true })
        console.log(orders)
      });
    });
  });

  it('Donation with Ideal Method', () => {
    const payload =
    {
      "fundraising_local_id": 28451,
      "currency_code": "eur",
      "lang": "en",
      "description": "Save trees and animals 1699379872621",
      "bank_account": "",
      "return_url": "http://localhost:4200/donate/check-payment-status/",
      "amount": amount,
      "tip": "15",
      "is_tip_enabled": true,
      "tip_percentage": 15,
      "tip_amount": 15,
      "other_tip_amount": 1,
      "source": "web",
      "pay_period": "once",
      "is_anonymous": false,
      "newsletter": false,
      "first_name": "Yash",
      "last_name": "Jain",
      "email": "cypress.whydonate@gmail.com"
    }
    cy.request({
      method: 'POST',
      url: `${environment.donation_url}/donation/order`,
      body: payload
    }).then((response) => {
      // cy.window().then(win => win.location.href = );
      cy.visitAndVerify(`https://checkout.stripe.com${response.body.data.url.split('https://pay.whydonate.com')[1]}`)
      cy.wait(2000);
      cy.get('body').then(($body) => {
        cy.get("#email").type("yash@whydonate.com")
        cy.get('#ideal-tab').then(($sofort) => {
          if ($sofort.is(':visible')) {
            cy.get('#ideal-tab').click();
          } else {
            cy.get('.Tabs-TabListItem--overflow-toggle').click();
            cy.get('#ideal-tab').click();
          }
        });
        cy.get('#idealBank').select('abn_amro').invoke('val').then((value) => {
          cy.wait(1000).get('#billingName').type("Yash Jain")
          cy.document().then((doc) => {
            try {
              const $billingPostalCode = doc.querySelector('#billingPostalCode');
              if ($billingPostalCode) {
                cy.wrap($billingPostalCode).type('123456');
                // Add your assertions or further actions here
              } else {
                // Handle the case when the element is not found
                // For example, log a message or perform alternative actions
                cy.log('Element not found: #billingPostalCode');
                // Or execute alternative actions if needed
                // cy.get('#otherElement').click();
              }
            } catch (error) {
              // Handle any other errors that may occur
              cy.log('An error occurred:', error);
            }
          });
          // Perform other actions or assertions when the element doesn't exist
          cy.wait(1000).get('.SubmitButton').click()
          cy.wait(10000)
          cy.get('.common-Button--default').click()
          cy.wait(10000)

          cy.wait(2000);
          cy.get('#donationSendThanksMessage').type('Thank you so much');
          cy.get('#donateAnonymous').click();
          cy.get('#donationAddress').type('167 A block');
          cy.get('#donationCity').type("Hells Kitchen");
          cy.get('#donationZipCode').type('512203');
          cy.get('#donationCountry').type('Gotham');
          cy.wait(1000);
          cy.get('#donationSave').click({ force: true });
          cy.url().should('include', 'donate/share/');
          cy.url().should('include', 'orderId').then(url => {
            const orderId = url.split(';orderId=')[1];
            cy.log(orderId);
            orders.push({ id: orderId, tip: true })
            console.log(orders)
          });
        });
      })

    });
  });

  it('Card Monthly Donation', () => {
    const payload =
    {
      "fundraising_local_id": 28452,
      "currency_code": "eur",
      "lang": "en",
      "description": "Tip Disabled Donations",
      "bank_account": "",
      "return_url": "http://localhost:4200/donate/check-payment-status/",
      "amount": amount,
      "tip": "15",
      "is_tip_enabled": true,
      "tip_percentage": 15,
      "tip_amount": 15,
      "other_tip_amount": 1,
      "source": "web",
      "pay_period": "once",
      "is_anonymous": false,
      "newsletter": false,
      "first_name": "Yash",
      "last_name": "Jain",
      "email": "cypress.whydonate@gmail.com"
    }
    cy.request({
      method: 'POST',
      url: `${environment.donation_url}/donation/order`,
      body: payload
    }).then((response) => {
      // cy.window().then(win => win.location.href = );
      cy.visitAndVerify(`https://checkout.stripe.com${response.body.data.url.split('https://pay.whydonate.com')[1]}`)
      cy.wait(2000);
      cy.get("#email").type("yash@whydonate.com")
      cy.get("#cardNumber").type("4000 0052 8000 0002")
      cy.get("#cardCvc").type("123")
      cy.get("#cardExpiry").type(
        "12" + (new Date().getFullYear() + 10).toString().substr(-2)
      )
      cy.wait(1000).get('#billingName').type("Yash Jain")
      cy.get('body').then(($body) => {
        if ($body.find('#billingPostalCode').length > 0) {
          cy.get('#billingPostalCode').type("123456");
        } else {
          // Perform other actions or assertions when the element doesn't exist
          cy.wait(1000).get('.SubmitButton').click()
          cy.wait(20000)

          cy.wait(2000);
          cy.get('#donationSendThanksMessage').type('Thank you so much');
          cy.get('#donateAnonymous').click();
          cy.get('#donationAddress').type('167 A block');
          cy.get('#donationCity').type("Hells Kitchen");
          cy.get('#donationZipCode').type('512203');
          cy.get('#donationCountry').type('Gotham');
          cy.wait(1000);
          cy.get('#donationSave').click({ force: true });
          cy.url().should('include', 'donate/share/');
          cy.url().should('include', 'orderId').then(url => {
            const orderId = url.split(';orderId=')[1];
            cy.log(orderId);
            orders.push({ id: orderId, tip: true })
            console.log(orders)
          });
        }
      });
    });
  });

  it('Card One-Time Donation', () => {
    const payload = {
      "fundraising_local_id": 28451,
      "currency_code": "eur",
      "lang": "en",
      "description": "Save trees and animals 1699379872621",
      "bank_account": "",
      "return_url": "http://localhost:4200/donate/check-payment-status/",
      "amount": amount,
      "tip": "15",
      "is_tip_enabled": true,
      "tip_percentage": 15,
      "tip_amount": 15,
      "other_tip_amount": 1,
      "source": "web",
      "pay_period": "once",
      "is_anonymous": false,
      "newsletter": false,
      "first_name": "Yash",
      "last_name": "Jain",
      "email": "cypress.whydonate@gmail.com"
    }

    cy.request({
      method: 'POST',
      url: `${environment.donation_url}/donation/order`,
      body: payload
    }).then((response) => {
      // cy.window().then(win => win.location.href = );
      cy.visitAndVerify(`https://checkout.stripe.com${response.body.data.url.split('https://pay.whydonate.com')[1]}`)
      cy.wait(2000);
      cy.get("#email").type("yash@whydonate.com")
      cy.get("#cardNumber").type("4000 0052 8000 0002")
      cy.get("#cardCvc").type("123")
      cy.get("#cardExpiry").type(
        "12" + (new Date().getFullYear() + 10).toString().substr(-2)
      )
      cy.wait(1000).get('#billingName').type("Yash Jain")
      cy.get('body').then(($body) => {
        if ($body.find('#billingPostalCode').length > 0) {
          cy.get('#billingPostalCode').type("123456");
        } else {
          // Perform other actions or assertions when the element doesn't exist
          cy.wait(1000).get('.SubmitButton').click()
          cy.wait(20000)

          cy.wait(2000);
          cy.get('#donationSendThanksMessage').type('Thank you so much');
          cy.get('#donateAnonymous').click();
          cy.get('#donationAddress').type('167 A block');
          cy.get('#donationCity').type("Hells Kitchen");
          cy.get('#donationZipCode').type('512203');
          cy.get('#donationCountry').type('Gotham');
          cy.wait(1000);
          cy.get('#donationSave').click({ force: true });
          cy.url().should('include', 'donate/share/');
          cy.url().should('include', 'orderId').then(url => {
            const orderId = url.split(';orderId=')[1];
            cy.log(orderId);
            orders.push({ id: orderId, tip: true })
            console.log(orders)
          });
        }
      });
    });
  });

  it(`Check the db for actual donation values`, () => {
    // Define a counter to track the number of retries
    let retryCounter = 0;

    const checkOrdersForEmptyRows = (orderIds, currentIndex = 0) => {
      if (currentIndex >= orderIds.length) {
        // All orders have been processed, exit the loop
        return;
      }

      const orderId = orderIds[currentIndex].id;
      const tip = orderIds[currentIndex].tip;

      const additionalCode = (response) => {
        cy.log(`Custom code executed with the response for Order ID ${orderId}:`, response.rows);
        if (response.rows.length > 0) {

          cy.log(`Rows for ${orderId}`, response.rows)
          expect(Number(response.rows.filter(i => i.type == "donation")[0].amount)).to.be.eq(amount)
          if (!tip) {
            expect(Number(response.rows.filter(i => i.type == "commission")[0].amount)).to.be.eq(-(amount * 0.03))
          } else {
            expect(Number(response.rows.filter(i => i.type == "commission")[0].amount)).to.be.eq(0)
          }
          expect(Number(response.rows.filter(i => i.type == "cost")[0].amount)).to.be.eq(-((amount * 0.019) + 0.25))
          expect(Number(response.rows.filter(i => i.type == "tax")[0].amount)).to.be.eq(0)
          // If response.rows.length is 0, stop this loop
          checkOrdersForEmptyRows(orderIds, currentIndex + 1); // Move to the next order

        } else {
          // Waiting for 5 seconds before checking again for the same order
          cy.wait(5000).then(() => {
            // Incrementing the retry counter
            retryCounter++;
            if (retryCounter < 5) {
              // Retry the same order
              checkOrdersForEmptyRows(orderIds, currentIndex);
            } else {
              // Maximum retries reached, failing the test
              cy.log("Test failed: Maximum retries reached without finding non-empty rows.");
              expect(response.rows.length).to.be.gt(0)
            }
          });
        }
      };
      cy.testDatabaseConnection(`select * from accounting_transaction where order_id = ${orderId};`, additionalCode);
    };
    // Starting the loop with the array of order IDs
    checkOrdersForEmptyRows(orders);
  });
});
