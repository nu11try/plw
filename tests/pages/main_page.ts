import { expect, Locator, Page} from "@playwright/test";
import { BasePage } from "./base_page";

class MainPage extends BasePage {
    readonly page: Page;
    private readonly _dialog_eula: string = 'div[data-test-id="dialog-container"]';
    private readonly _dialog_eula_button: string = 'div[data-test-id="dialog-container"] button[data-test-id="button-content"]';

    private readonly _notif: string = 'div[data-test-id="notification"]';
    private readonly _notif_title: string = 'div[data-test-id="notification-title"]';

    private readonly _acc_controll: string = 'div[data-test-id="id-control"]';
    private readonly _acc_controll_panel: string = '//div[@data-test-id="id-control-panel"]';
    //private readonly _acc_controll_panel_loggout: string = `${this._acc_controll_panel}//div[contains(text(), "Sign Out")]`;
    private readonly _acc_controll_panel_loggout: string = `${this._acc_controll_panel}//div[contains(text(), "Выйти")]`;

    private readonly _acc_trade_info: string = `div[data-test-id="account-control"]`;
    private readonly _acc_trade_info_panel: string = `//div[@data-test-id="context-menu"]`;
    private readonly _acc_trade_info_panel_acc_list: string = `${this._acc_trade_info_panel}//div[@data-test-id="account-list"]`;
    //private readonly _acc_trade_info_panel_create_new_trader_btn: string = `${this._acc_trade_info_panel}//div[contains(text(), "Create Demo Account")]`;
    private readonly _acc_trade_info_panel_create_new_trader_btn: string = `${this._acc_trade_info_panel}//div[contains(text(), "Открыть новый торговый счет")]`;

    private readonly _acc_workspace_btn: string = `div[data-test-id="active-chart-toolbar"] div[data-test-id="control"]`;
    private readonly _acc_workspace_panel: string = `//div[@data-test-id="workspace-control-panel"]`;
    private readonly _acc_workspace_list: string = `${this._acc_workspace_panel}//div[contains(@class, "fela-identifie")]`;

    private readonly _acc_create_new_trader_pop: string = `//div[@data-test-id="dialog-container"]`;
    //private readonly _acc_new_trader_demo_btn: string = `//div[@data-test-id="dialog-pages"]//div[|contains(text(), "Demo Account")]`;
    private readonly _acc_new_trader_demo_btn: string = `//div[@data-test-id="dialog-pages"]//div[contains(text(), "Демо Счет")]`;
    private readonly _acc_new_trader_sum: string = `${this._acc_create_new_trader_pop}//div[contains(@class, "fela-identifier-0")]//input`;
    private readonly _acc_new_trader_valut: string = `(${this._acc_create_new_trader_pop}//div[@tabindex="-1"]//div[@data-test-id="drop-down-placeholder"])[2]`;
    private readonly _acc_new_trader_ratio: string = `(${this._acc_create_new_trader_pop}//div[@tabindex="-1"]//div[@data-test-id="drop-down-placeholder"])[3]`;
    private readonly _acc_new_trader_type: string = `(${this._acc_create_new_trader_pop}//div[@tabindex="-1"]//div[@data-test-id="drop-down-placeholder"])[4]`;
    private readonly _acc_new_trader_islam: string = `${this._acc_create_new_trader_pop}//div[@data-test-id="checkbox-toggle"]`;
    private readonly _acc_new_trader_open_tr: string = `${this._acc_create_new_trader_pop}//button[@data-test-id="button-content"]`;

    constructor(page: Page) {
        super(page, '#root');
        this.page = page;
    }

    public async confirmEULA() {
        await this.page.waitForSelector(this._dialog_eula);
        await this.page.locator(this._dialog_eula_button).click();
    }

    public async notShowEULA() {
        await this.page.isHidden(this._dialog_eula);
    }

    public async checkNotifForNewAcc() {
        expect(await this.page.locator(this._notif).count()).toEqual(2);
        await expect(this.page.locator(this._notif).first().locator(this._notif_title)).toHaveText(/Workspace loaded|Account linked/);
        await expect(this.page.locator(this._notif).last().locator(this._notif_title)).toHaveText(/Workspace loaded|Account linked|Рабочее пространство загружено/);
    }

    public async checkNotifForIssetAcc() {
        await this.page.waitForSelector(this._notif);
        expect(await this.page.locator(this._notif).count()).toEqual(1);
        expect(await this.page.locator(this._notif).first().locator(this._notif_title)).toHaveText(/Workspace loaded|Рабочее пространство загружено/);
    }

    public async checkTraderInfo() {
        let out_trade = await this.page.locator(this._acc_trade_info).innerText();
        await this.page.locator(this._acc_trade_info).click();
        await expect(this.page.locator(this._acc_trade_info_panel)).toBeVisible();
        let inner_trade = await this.page.locator(this._acc_trade_info_panel_acc_list).innerText();
        expect(out_trade).toEqual(inner_trade);
        await this.page.locator(this._acc_trade_info).click();
    }

    public async checkWorkspace() {
        await this.page.locator(this._acc_workspace_btn).first().hover();
        await expect(this.page.locator(this._acc_workspace_panel)).toBeVisible();
        let workspace = await this.page.locator(this._acc_workspace_list).first().innerText();
        expect(workspace).toEqual("cT Web cross-broker workspace #1");
        expect(await this.page.locator(this._acc_workspace_list).count()).toEqual(2);
    }

    public async openCreateNewTrader() {
        await this.page.locator(this._acc_trade_info).click();
        await expect(this.page.locator(this._acc_trade_info_panel)).toBeVisible();
        await this.page.locator(this._acc_trade_info_panel_create_new_trader_btn).click()
    }

    public async createNewDemoTrader() {
        await this.page.locator(this._acc_new_trader_demo_btn).click();

        expect(await this.page.locator(this._acc_new_trader_sum).inputValue()).toEqual("1000");
        expect(await this.page.locator(this._acc_new_trader_valut).innerText()).toEqual("EUR");
        //expect(await this.page.locator(this._acc_new_trader_ratio).innerText()).toEqual('1 : 100 (Default)');
        expect(await this.page.locator(this._acc_new_trader_ratio).innerText()).toEqual('1 : 100 (По умолчанию)');
        //expect(await this.page.locator(this._acc_new_trader_type).innerText()).toEqual('Hedging (Default)');
        expect(await this.page.locator(this._acc_new_trader_type).innerText()).toEqual('Хеджинг (По умолчанию)');
        expect(await this.page.locator(this._acc_new_trader_islam).innerText()).toEqual("");
        
        expect(await this.page.locator(this._acc_new_trader_open_tr).isEnabled()).toEqual(true);
        const element = await this.page.waitForSelector(this._acc_new_trader_open_tr);
        const color = await element.evaluate((el) => { return window.getComputedStyle(el).getPropertyValue('background-color'); });
        expect(color).toEqual("rgb(0, 147, 69)");

        await this.page.press(this._acc_new_trader_sum, 'Control+A');
        await this.page.press(this._acc_new_trader_sum, 'Delete');
        await this.page.locator(this._acc_new_trader_sum).type("123456");
        expect(await this.page.locator(this._acc_new_trader_sum).inputValue()).toEqual("123456");

        await this.page.locator(this._acc_new_trader_open_tr).click();
    }

    public async checkCreatedTrader() {
        await (await this.page.waitForSelector(this._acc_trade_info)).hover();
        let out_trade = await this.page.locator(this._acc_trade_info).innerText();
        expect(await this.page.locator(this._acc_trade_info).innerText()).toContain("EUR 123 456.00·1:100");
        await this.page.locator(this._acc_trade_info).click();
        let inner_trade = await this.page.locator(this._acc_trade_info_panel_acc_list).innerText();
        expect(inner_trade).toContain(out_trade);
    }

    public async loggout() {
        await this.page.locator(this._acc_controll).click();
        await expect(this.page.locator(this._acc_trade_info_panel)).toBeVisible();
        await this.page.locator(this._acc_controll_panel_loggout).click();
    }
}

export { MainPage };