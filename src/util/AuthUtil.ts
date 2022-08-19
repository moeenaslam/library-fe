import {Auth} from "../types/CustomTypes";

export const AuthUtil={

     async currentSession(): Promise<Auth> {
        let storageAuth = localStorage.getItem('auth');
        if(storageAuth){
            let auth = JSON.parse(storageAuth) as Auth;
            return Promise.resolve(auth);
        }
        else{
            return Promise.reject("User is not logged in");
        }
    },

    persistSession(auth: Auth): void {
         localStorage.setItem('auth',JSON.stringify(auth));
    },
    cleanSession(): void {
         localStorage.removeItem('auth');
    }
}