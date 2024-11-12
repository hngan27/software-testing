"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSignUp = testSignUp;
const playwright_1 = require("playwright");
const excelService_1 = require("../data/excelService");
function testSignUp() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = excelService_1.ExcelService.readExcel("SignUp");
        const results = [];
        const browser = yield playwright_1.chromium.launch({ headless: false });
        const context = yield browser.newContext();
        const page = yield context.newPage();
        for (const item of data) {
            yield page.goto("https://phptravels.net/signup");
            try {
                yield page.fill('input[name="first_name"]', item.firstName);
                yield page.fill('input[name="last_name"]', item.lastName);
                // Chờ dropdown quốc gia hiển thị và lấy giá trị tương ứng với label
                // await page.waitForSelector('select[name="phone_country_code"]', {
                //   state: "visible",
                // });
                // await page.click('button[data-bs-toggle="dropdown"]');
                // const countryValues = await page.evaluate(() => {
                //   const selectElement = document.querySelector(
                //     'select[name="phone_country_code"]'
                //   );
                //   if (selectElement && selectElement instanceof HTMLSelectElement) {
                //     const options = Array.from(selectElement.options);
                //     options.forEach((option) => {
                //       console.log(`Label: ${option.label}, Value: ${option.value}`);
                //     });
                //     return options.map((opt) => ({ label: opt.label, value: opt.value }));
                //   }
                //   return [];
                // });
                // console.log("All country options:", countryValues);
                // const country = item.country;
                // const countryValue = await page.evaluate((country) => {
                //   const selectElement = document.querySelector(
                //     'select[name="phone_country_code"]'
                //   );
                //   if (selectElement && selectElement instanceof HTMLSelectElement) {
                //     const options = Array.from(selectElement.options);
                //     const option = options.find((opt) => opt.label.includes(country));
                //     return option ? option.value : null;
                //   }
                //   return null;
                // }, country);
                // if (countryValue) {
                //   await page.selectOption('select[name="phone_country_code"]', {
                //     value: countryValue,
                //   });
                // } else {
                //   throw new Error(`Country "${country}" not found in the dropdown`);
                // }
                // Chờ dropdown hiển thị
                yield page.waitForSelector('select[name="phone_country_code"]');
                // Chọn quốc gia với value tương ứng từ dữ liệu
                yield page.selectOption('select[name="phone_country_code"]', {
                    value: String(item.country),
                });
                console.log(`Country with value "${item.country}" selected.`);
                yield page.locator('input[name="phone"]').fill(String(item.phone));
                yield page.fill('input[name="user_email"]', item.email);
                yield page.fill('input[name="password"]', item.password);
                const iframe = yield page.frameLocator('iframe[title="reCAPTCHA"]');
                const recaptchaCheckbox = yield iframe.locator(".recaptcha-checkbox");
                yield recaptchaCheckbox.click();
                // ????????
                yield page.click('button:has-text("Sign Up")');
                yield page.waitForTimeout(5000);
                if (page.url().includes("signup_success")) {
                    results.push(Object.assign(Object.assign({}, item), { result: "Passed" }));
                }
                else {
                    results.push(Object.assign(Object.assign({}, item), { result: "Failed" }));
                }
            }
            catch (error) {
                results.push(Object.assign(Object.assign({}, item), { result: `Error: ${error.message}` }));
            }
        }
        yield browser.close();
        excelService_1.ExcelService.writeExcel("SignUpResults", results);
    });
}
