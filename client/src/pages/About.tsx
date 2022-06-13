import React from 'react';
import './styles/About.css'

interface AboutProps {
}

export const About: React.FC<AboutProps> = ({}) => {
    return (
        <main className={'about'}>
            <h1> ABOUT </h1>
            <p>
                DB Class Assignment Project <br />
                Stack: MongoDB, Express, React, Node ( MERN ) <br />
                + WebSockets
            </p>
        </main>
    )
}
