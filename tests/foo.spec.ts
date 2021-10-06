import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from './pages/login_page';
const faker = require('faker');
import { MainPage } from './pages/main_page';

test.describe('basic test', () => {
  let email: string = faker.internet.email();
  let password: string = faker.internet.password();

  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeEach(async () => {
    browser = await chromium.launch({headless: false});
    context = await browser.newContext()
    page = await context.newPage();
  })

  test.afterAll(async () => {
    browser.close;
  });

  test('cTid creation', async () => {
    let login_page: LoginPage = new LoginPage(page);
    let main_page: MainPage = new MainPage(page);

    await login_page.open('https://ct.spotware.com/');
    await login_page.createAccount(email, password);

    await main_page.isOpened();
    await main_page.confirmEULA();
    await main_page.checkNotifForNewAcc();
    await main_page.loggout();

    await login_page.isOpened();
  });

  test('Log In', async () => {
    let login_page: LoginPage = new LoginPage(page);
    let main_page: MainPage = new MainPage(page);

    await login_page.open('https://ct.spotware.com/');
    await login_page.signInAcc(email, password);

    await main_page.isOpened();
    await main_page.notShowEULA();
    await main_page.checkNotifForIssetAcc();
    await main_page.checkTraderInfo();
    await main_page.checkWorkspace();
    await main_page.closeTab();
  });

  test('Add a new Demo account', async () => {
    let login_page: LoginPage = new LoginPage(page);
    let main_page: MainPage = new MainPage(page);

    await login_page.open('https://ct.spotware.com/');
    await login_page.signInAcc(email, password);

    await main_page.isOpened();
    await main_page.openCreateNewTrader();
    await main_page.createNewDemoTrader();
    await main_page.checkCreatedTrader();
  });
  
});