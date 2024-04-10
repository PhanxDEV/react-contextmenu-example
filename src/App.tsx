import React from 'react';
import logo from './logo.svg';
import './App.css';
import ContextMenu, { ContextMenuItem } from './components/ContextMenu';

function App() {
    const itemClickHandler = (item: ContextMenuItem) => {
        alert(item.caption);
    };

    return (
        <div className='App'>
            <header className='App-header'>
                <ContextMenu
                    id='img-context-menu'
                    onItemClicked={itemClickHandler}
                    items={[
                        {
                            id: 'test',
                            caption: 'This is a test!',
                        },
                    ]}
                >
                    <img src={logo} className='App-logo' alt='logo' />
                </ContextMenu>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <ContextMenu
                    id='link-context-menu'
                    onItemClicked={itemClickHandler}
                    items={[
                        {
                            id: 'entry-1',
                            caption: 'This is the first entry!',
                        },
                        {
                            id: 'entry-2',
                            caption: 'This is the second entry!',
                        },
                    ]}
                >
                    <a
                        className='App-link'
                        href='https://reactjs.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Learn React
                    </a>
                </ContextMenu>
            </header>
        </div>
    );
}

export default App;
