import { chromium } from "playwright";
import { ExcelService } from "../data/excelService";

export async function testLogin() {
  const data = ExcelService.readExcel("Login");
  const results: any[] = [];

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const item of data) {
    await page.goto("https://phptravels.net/login");

    try {
      // Điền thông tin đăng nhập
      await page.fill('input[name="email"]', item.email);
      await page.fill('input[name="password"]', item.password);

      // Nhấn nút đăng nhập
      await page.click('button:has-text("Login")');

      // Chờ URL thay đổi đến trang dashboard hoặc chờ phần tử của dashboard hiển thị
      await page
        .waitForURL("https://phptravels.net/dashboard", {
          timeout: 5000,
        })
        .catch(() => {
          console.log("Không thể chuyển đến trang dashboard.");
        });

      if (page.url().includes("dashboard")) {
        results.push({ ...item, result: "Passed" });

        // Nhấn vào phần tử "Account" để mở dropdown
        await page.click(
          'a.bg-light.nav-link.dropdown-toggle:has-text("Account")'
        );

        // Đợi dropdown menu xuất hiện
        await page.waitForSelector("ul.dropdown-menu.show", { timeout: 7000 });

        // Nhấn vào nút Logout trong dropdown
        await page.click('a.dropdown-item:has-text("Logout")');

        // Đợi cho đến khi trang quay lại trang login
        await page.waitForURL("https://phptravels.net", { timeout: 5000 });
      } else {
        results.push({ ...item, result: "Failed" });
      }
    } catch (error) {
      results.push({ ...item, result: `Error: ${(error as Error).message}` });
    }
  }

  // Đóng trình duyệt và ghi kết quả vào file Excel
  await browser.close();
  ExcelService.writeExcel("LoginResults", results);
}
