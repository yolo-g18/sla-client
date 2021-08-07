import { PARAMS } from '../common/params';
import { IUserLogin, IUserRegister } from './TypeScript'

export const validRegister = (userRegister: IUserRegister) => {
  const { email, username, password } = userRegister;
  
  let errors = { };

  let emailRegex = new RegExp(PARAMS.EMAIL_REGEX);
  let usernameRegex = new RegExp(PARAMS.USERNAME_REGEX);

  if (!emailRegex.test(email)) {
    let err = "Email is invalid";
    errors = { ...errors, email: err };
  } 

  if (!usernameRegex.test(username)) {
    let err =
    "Usernames can only use letters, numbers, underscores and periods and cannot exceed 20 characters";
      errors = { ...errors, username: err };
  } 

  if (password.length < 5 || password.length > 20) {
    let err = "Password length must be between 5 and 20 characters";
    errors = { ...errors, password: err };
  } 

  return errors;
}

export const validLogin = (userLogin: IUserLogin) => {
  const { username, password } = userLogin;
  
  let errors = { };

  let usernameRegex = new RegExp(PARAMS.USERNAME_REGEX); 

  if (!usernameRegex.test(username)) {
    let err =
      "Usernames can only use letters, numbers, underscores and periods and cannot exceed 20 characters";
      errors = { ...errors, username: err };
  } 

  if (password.length < 5 || password.length > 20) {
    let err = "Password length must be between 5 and 20 characters";
    errors = { ...errors, password: err };
  } 

  return errors;
}
