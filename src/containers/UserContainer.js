import { Container } from "unstated";
import instance from '../helpers/axiosly';
import CONSTANTS from "../App.constant";

class UserContainer extends Container {
    
    constructor() {
        super();
        this.state = {
            user: null
        }
    }

    goBack = (props) => {
        props.history.goBack();
    }

    getUser = () => {
        let user = localStorage.getItem(CONSTANTS.SESSIONSTORE);
        if (user) {
            user = JSON.parse(user);
            return user.data;
        } 
        return {}
    }

    logOut = (props) => {
        localStorage.removeItem(CONSTANTS.SESSIONBEARER);
        localStorage.removeItem(CONSTANTS.SESSIONSTORE);
        props.history.push("/login");
    }

    signIn = (values, change = () => {}, props ) => {
        instance.post(`admin/auth/signin`,values).then(data => {
            if (!data.data.isSuccess) {
                change();
                return;
            }
    
            if (String(data.data.data.userType).toLocaleLowerCase() != 'admin')  {
                change();
                return;
            }
    
            localStorage.setItem(CONSTANTS.SESSIONSTORE, JSON.stringify(data.data));
            localStorage.setItem(CONSTANTS.SESSIONBEARER, JSON.stringify({
                bearer : `Bearer ${data.data.message}`,
                date: new Date(data.data.expirationDate)
            }));
    
            props.history.push("/home");
        }).catch(e => {
           change();
        })
    }

}

export { UserContainer }