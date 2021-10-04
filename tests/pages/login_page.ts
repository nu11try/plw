import { expect, Page } from "@playwright/test";
import { BasePage } from "./base_page";

class LoginPage extends BasePage {
    readonly page: Page;

    private readonly frame_locator: string = '#ctid-iframe';

    // sign up locators
    private readonly email_sign_up: string = '#signup #signup-id';
    private readonly password_sign_up: string = '#signup #signup-password';
    private readonly confirm_password_sign_up: string = '#signup input[name="repeatPassword"]';
    private readonly button_confirm_sign_up: string = '#signup button[type="submit"]';

    // sign in locators
    private readonly switch_sign_in: string = 'a[data-switch="login"]';
    private readonly email_sign_in: string = '#login #login-id';
    private readonly password_sign_in: string = '#login .inpPass';
    private readonly button_confirm_sign_in: string = '#login button[type="submit"]';

    constructor(page: Page) {
        super(page, ".silentAuthDialogContent");
        this.page = page;
    }

    public async createAccount(email: string, password: string) {
        let frame = await(await this.page.$(this.frame_locator)).contentFrame();
        await frame.fill(this.email_sign_up, email);
        await frame.fill(this.password_sign_up, password);
        await frame.fill(this.confirm_password_sign_up, password);
        await frame.click(this.button_confirm_sign_up);
    } 

    public async signInAcc(email: string, password: string) {
        let frame = await(await this.page.$(this.frame_locator)).contentFrame();
        if (await frame.isHidden(this.email_sign_in)) await frame.click(this.switch_sign_in);
        await frame.fill(this.email_sign_in, email);
        await frame.fill(this.password_sign_in, password);
        await frame.click(this.button_confirm_sign_in);
    }
}

export { LoginPage };