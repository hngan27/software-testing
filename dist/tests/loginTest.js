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
exports.testLogin = testLogin;
const playwright_1 = require("playwright");
const excelService_1 = require("../data/excelService");
function testLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = excelService_1.ExcelService.readExcel("Login");
        const results = [];
        const browser = yield playwright_1.chromium.launch({ headless: false });
        const context = yield browser.newContext();
        const page = yield context.newPage();
        for (const item of data) {
            yield page.goto("https://phptravels.net/login");
            try {
                // Điền thông tin đăng nhập
                yield page.fill('input[name="email"]', item.email);
                yield page.fill('input[name="password"]', item.password);
                // Nhấn nút đăng nhập
                yield page.click('button:has-text("Login")');
                // Chờ URL thay đổi đến trang dashboard hoặc chờ phần tử của dashboard hiển thị
                yield page
                    .waitForURL("https://phptravels.net/dashboard", {
                    timeout: 5000,
                })
                    .catch(() => {
                    console.log("Không thể chuyển đến trang dashboard.");
                });
                if (page.url().includes("dashboard")) {
                    results.push(Object.assign(Object.assign({}, item), { result: "Passed" }));
                    // Nhấn vào phần tử "Account" để mở dropdown
                    yield page.click('a.bg-light.nav-link.dropdown-toggle:has-text("Account")');
                    // Đợi dropdown menu xuất hiện
                    yield page.waitForSelector("ul.dropdown-menu.show", { timeout: 7000 });
                    // Nhấn vào nút Logout trong dropdown
                    yield page.click('a.dropdown-item:has-text("Logout")');
                    // Đợi cho đến khi trang quay lại trang login
                    yield page.waitForURL("https://phptravels.net", { timeout: 5000 });
                }
                else {
                    results.push(Object.assign(Object.assign({}, item), { result: "Failed" }));
                }
            }
            catch (error) {
                results.push(Object.assign(Object.assign({}, item), { result: `Error: ${error.message}` }));
            }
        }
        // Đóng trình duyệt và ghi kết quả vào file Excel
        yield browser.close();
        excelService_1.ExcelService.writeExcel("LoginResults", results);
    });
}
