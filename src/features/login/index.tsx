import React, {Component} from "react"
// @ts-ignore
import {Navigate, RouteComponentProps} from "react-router-dom";
import Api from "../../http/Api";
import {AuthUtil} from "../../util/AuthUtil";
import {Spinner} from "react-bootstrap";

interface RouterProps {
    history: string;
}
type Props = RouteComponentProps<RouterProps>;
type State = {
    username: string,
    password: string,
    loading: boolean,
    message: string
    authenticated: boolean,
    authChecked: boolean
};
export default class Login extends Component<Props, State>{
    state: State = {
        username:'',
        password:'',
        loading: false,
        message: '',
        authenticated:false,
        authChecked:false,
    };

    constructor(props: Props) {
        super(props);
        this.checkLogin = this.checkLogin.bind(this);
    }

    componentDidMount() {
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
            if(!this.state.authenticated){
                return (
                    <div className="login-form-container">
                        <form className="login-form">
                            <div className="login-form-content">
                                <h3 className="login-form-title">Library System - Sign In</h3>
                                <div className="form-group mt-3">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        onChange={(e) => {this.setState({username: e.target.value})}}
                                        className="form-control mt-1"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        onChange={(e) => {this.setState({password: e.target.value})}}
                                        className="form-control mt-1"
                                        placeholder="Enter password"
                                    />
                                </div>
                                {
                                    this.state.message &&
                                    <div className="d-grid mt-2 mb-2 text-danger">
                                        {this.state.message}
                                    </div>
                                }
                                {
                                    this.state.loading &&
                                    <div className="d-grid mt-2 mb-2 justify-content-center">
                                        <Spinner animation="border" />
                                    </div>
                                }
                                <div className="d-grid gap-2 mt-3">
                                    <button type='button' onClick={this.processSignIn} className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            }
            else{
                return <Navigate to="/" replace={true} />;
            }
        }

        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    processSignIn = () =>{
        this.setState({
            loading:true,
            message:'',
        })
        Api.signIn(this.state.username,this.state.password).then((response) => {
            if(response){
                AuthUtil.persistSession(response);
                this.setState({
                    authenticated: true
                })
            }else{
                alert('Error');
            }
        }).catch((error)=>{
            console.log(error);
            this.setState({
                message:'Invalid username or password!',
            })
        }).finally(()=>{
            this.setState({
                loading:false,
            });
        });
    }
}