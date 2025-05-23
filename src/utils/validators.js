//file is used to validate the pasword ,whether the password format is correct or not
//format of password --- abcd--e3 should be invalid ,password is the data which is entered in login page
import { isValidUsername } from "6pp";
export const usernameValidator = (username) => {
  if (!isValidUsername(username))
    return { isValid: false, errorMessage: "Username is Invalid" };
};
