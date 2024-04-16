import React from 'react';
import ReactDOM from 'react-dom';
import LoginScreen from './login';
import RegisterScreen from './register';

const Index = () => {
    return (
        <div>
            <h1>Login</h1>
            <LoginScreen />
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

ReactDOM.render(<Index />, document.getElementById('root'));

