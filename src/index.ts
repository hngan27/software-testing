import { testSignUp } from "./tests/signUpTest";
import { testLogin } from "./tests/loginTest";

(async () => {
  await testSignUp();
  // await testLogin();
})();
