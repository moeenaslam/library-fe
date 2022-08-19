import React, {Component} from "react"

import { Navigate } from "react-router-dom";
import {AuthUtil} from "../../util/AuthUtil";
import {Spinner} from "react-bootstrap";
import TopNav from "../../layout/TopNav";
import {Books} from "./books";

interface RouterProps {
    // navigate: any;
}
type Props = RouterProps;
type State = {
    authenticated: Boolean,
    authChecked: Boolean
};

export class Home extends Component<Props, State>{

    state = {
        authenticated: false,
        authChecked: false,
    }

    constructor(props: Props) {
        super(props);
        this.checkLogin = this.checkLogin.bind(this);
    }

    componentDidMount() {
        console.log('check login from home');
        this.checkLogin();
    }

    checkLogin =async () => {
        try{
            let session = await AuthUtil.currentSession();
            if (session.accessToken) {
                this.setState({
                    authenticated:true,
                    authChecked:true
                });
            } else {
                this.setState({
                    authenticated:false,
                    authChecked:true
                });
            }
        }catch (e) {
            this.setState({
                authenticated:false,
                authChecked:true
            });
        }
    }

    render() {
        if(this.state.authChecked){
            if(this.state.authenticated){
                return(
                    <div>
                        <TopNav/>
                        <div className="m-5">
                            <Books/>
                        </div>
                    </div>
                );
            }
            else{
                return <Navigate to="/auth" replace={true} />;
            }
        }

        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }
}
