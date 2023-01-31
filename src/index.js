import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'

const App = () => {
    return (
        <div className='text-lg bg-red-500'>This is a React component inside of Webflow!</div>
    )
}

ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById('react-target')
);