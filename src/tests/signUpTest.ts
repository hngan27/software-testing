import { chromium } from "playwright";
import { ExcelService } from "../data/excelService";

export async function testSignUp() {
  const data = ExcelService.readExcel("SignUp");
  const results: any[] = [];

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const item of data) {
    await page.goto("https://phptravels.net/signup");

    try {
      await page.fill('input[name="first_name"]', item.firstName);
      await page.fill('input[name="last_name"]', item.lastName);

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
      await page.waitForSelector('select[name="phone_country_code"]');

      // Chọn quốc gia với value tương ứng từ dữ liệu
      await page.selectOption('select[name="phone_country_code"]', {
        value: String(item.country),
      });
      console.log(`Country with value "${item.country}" selected.`);

      await page.locator('input[name="phone"]').fill(String(item.phone));

      await page.fill('input[name="user_email"]', item.email);
      await page.fill('input[name="password"]', item.password);

      const iframe = await page.frameLocator('iframe[title="reCAPTCHA"]');
      const recaptchaCheckbox = await iframe.locator(".recaptcha-checkbox");
      await recaptchaCheckbox.click();

      // ????????

      await page.click('button:has-text("Sign Up")');

      await page.waitForTimeout(5000);

      if (page.url().includes("signup_success")) {
        results.push({ ...item, result: "Passed" });
      } else {
        results.push({ ...item, result: "Failed" });
      }
    } catch (error) {
      results.push({ ...item, result: `Error: ${(error as Error).message}` });
    }
  }

  await browser.close();
  ExcelService.writeExcel("SignUpResults", results);
}
