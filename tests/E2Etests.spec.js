const {test, expect} = require('@playwright/test');
const { HomePage } = require('../pages/homepage');
const { url } = require('inspector');
const { homedir } = require('os');
const { pathToFileURL } = require('url');

test.beforeEach('Run before each test', async({page}) => {
    const homepage = new HomePage(page);
    await page.goto(process.env.HOME_URL);
})

test('Check labels in the home page', async({page}) => {
    const homepage = new HomePage(page);

    await expect(homepage.headerText).toBeVisible();
    await expect(homepage.welcomeText).toBeVisible();
    await expect(homepage.apiLinkText).toBeVisible();
    await expect(homepage.loginLabel).toBeVisible();
    await expect(homepage.signUpText).toBeVisible();
    await expect(homepage.footerText).toBeVisible();
})

test('Correct logo is displayed', async({page}) => {
    const homepage = new HomePage(page);

    await expect(homepage.logo).toHaveAttribute('src' , '/img/thinkingTesterLogo.png');
})

test('Link to the API Documentation is correct and clickable', async({page}) => {
    const homepage = new HomePage(page);

    await expect(homepage.linkToApiDocument).toBeVisible();
    await expect(homepage.linkToApiDocument).toHaveAttribute('href', process.env.API_DOCUMENTATION_URL);

    homepage.linkToApiDocument.click();
    await expect(page).toHaveURL(process.env.API_DOCUMENTATION_URL)
})

test('Check validation for empty credentials in the login page', async({page}) => {
    const homepage = new HomePage(page);

    homepage.submitButton.click();
    await expect(homepage.error).toBeVisible();
})

test('Check validation for not valid credentials in the login page', async({page}) => {
    const homepage = new HomePage(page);

    homepage.emailField.click();
    homepage.emailField.fill(process.env.INVALID_USER_NAME);
    homepage.passwordField.click();
    homepage.passwordField.fill(process.env.INVALID_PASSWORD);
    homepage.submitButton.click();

    await expect(homepage.error).toHaveText('Incorrect username or password');
})

// test('Sign up a new user', async({page}) => {
//     await page.goto('https://thinking-tester-contact-list.herokuapp.com/');

//     await page.getByRole('button', { name: 'Sign up' }).click();
//     await page.getByPlaceholder('First Name').click();
//     await page.getByPlaceholder('First Name').fill('Anna');
//     await page.getByPlaceholder('Last Name').click();
//     await page.getByPlaceholder('Last Name').fill('Smith');
//     await page.getByPlaceholder('Email').click();
//     await page.getByPlaceholder('Email').fill('anna_smith@gmail.com');
//     await page.getByPlaceholder('Password').click();
//     await page.getByPlaceholder('Password').fill('Password12345!');
//     await page.getByRole('button', { name: 'Submit' }).click();
//     await page.getByRole('button', { name: 'Submit' }).click();
// })

test('Validation for empty fields in the sign up page', async({page}) => {
    const homepage = new HomePage(page);

    homepage.signUpButton.click();
    homepage.submitButton.click();

    await expect(homepage.error).toBeVisible();
})

test('Validation for the already signed up user', async({page}) => {
    const homepage = new HomePage(page);

    await homepage.signUpButton.click();
    
    await homepage.firstName.click();
    await homepage.firstName.fill('Anna');
    await homepage.lastName.click();
    await homepage.lastName.fill('Smith');
    await homepage.emailField.click();
    await homepage.emailField.fill(process.env.USER_NAME);
    await homepage.passwordField.click();
    await homepage.passwordField.fill(process.env.PASSWORD);
    await homepage.submitButton.click();

    await expect(homepage.error).toHaveText('Email address is already in use');
})

test('Login with valid credentials', async({page}) => {
  
    await page.getByPlaceholder('Email').fill(process.env.USER_NAME);
    await page.getByPlaceholder('Password').fill(process.env.PASSWORD);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByPlaceholder('Password').click();

    await expect(page.getByText('Contact List')).toBeVisible();
})