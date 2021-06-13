import {GetStaticProps} from 'next';
import { useState } from 'react';
import { PARAMS } from '../../common/params';
import InputGroup from '../../components/InputGroup';

const register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({})


    const data = {
        email,
        username,
        password
    } 

    const register = () => {
        const data = {
            email,
            username,
            password
        }   

    }

    //check valid input onChange
    const handelChange = (event: any, typeField: string) => {

        switch(typeField) {
            case "EMAIL": {
                setEmail(event.target.value);  
                let emailRegex = new RegExp(PARAMS.EMAIL_REGEX);
                
                if(!emailRegex.test(email)) {
                    let err = "Email is invalid of already taken";
                    setErrors({...errors, email: err})  
                } else {
                    setErrors({...errors, email: ''})
                }
                break;
            }  
            case "USERNAME": {
                setUsername(event.target.value);
                let usernameRegex = new RegExp(PARAMS.USERNAME_REGEX);

                if(!usernameRegex.test(username)) {
                    let err = "Usernames can only use letters, numbers, underscores and periods.";
                    setErrors({...errors, username: err})  
                } else {
                    setErrors({...errors, username: ''})
                }
                break;
            }

            case "PASSWORD": {
                setPassword(event.target.value);    

                if(password.length < 5 || password.length > 20) {
                    let err = "Password length must be between 5 and 20 characters"
                    setErrors({...errors, password: err})  
                } else {
                    setErrors({...errors, password: ''})
                }
                break;
            }

            default: {   
               break;
            } 
        }
    }

    console.log(data);

    return (
        <div>
            <div className="bg-gray-100 min-h-screen flex flex-col">
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h5 className="font-mono mb-1 text-center">Join SLA</h5>
                        <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                        <form>
                            <InputGroup
                                type="email"
                                handleInputChange={e => handelChange(e, "EMAIL")}
                                placeholder="Email"
                                error={errors.email}    
                                isRequired={true} 
                            />
                            <InputGroup
                                type="text"
                                handleInputChange={e => handelChange(e, "USERNAME")}
                                placeholder="Username"
                                error={errors.username}    
                                isRequired={true} 
                            />
                            <InputGroup
                                type="password" 
                                handleInputChange={e => handelChange(e, "PASSWORD")}
                                placeholder="Password"
                                error={errors.password} 
                                isRequired={true}   
                            />
                            <button 
                                className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
                                onClick={register}
                            >
                                Create Account
                            </button>
                            <div className="text-center text-sm text-grey-dark mt-4">

                                By signing up, you agree to the <a className="no-underline border-b border-gray-400 text-grey-dark" href="#">
                                    Terms of Service
                                </a> and <a className="no-underline border-b border-gray-400 text-grey-dark" href="#">
                                    Privacy Policy
                                </a>
                            </div>
                        </form>
                    </div>
                    <div className="text-grey-dark mt-6">
                        Already have an account? <a className="no-underline border-b border-blue text-blue-600" href="../auth/login/">
                            Log in
                        </a>.
                    </div>
                </div>
            </div>
        </div>
    );
}


export default register;