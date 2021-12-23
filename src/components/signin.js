import React, {useState} from "react";
import { signIn } from './firebase';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await signIn(email, password);
            alert('user Signed in Successfully');

        } catch (error){
            alert(error.message)
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input 
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
            <button type="submit">Sign In</button>
        </form>
    );
}

export default SignIn;