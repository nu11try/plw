import { expect, Locator, Page } from "@playwright/test";

class BasePage {
    readonly page: Page;
    readonly indicator: Locator;

    constructor(page: Page, indicator: string) {
        this.page = page;
        this.indicator = page.locator(indicator);
    }

    public async open(path: string) {
        await this.page.goto(path);
        await this.isOpened();
    }

    public async isOpened() {
        await expect(this.indicator).toBeVisible();
    }

    public async closeTab() {
        await this.page.close();
    }
}

export { BasePage };