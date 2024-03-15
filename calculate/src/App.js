import './App.scss';
import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function App() {
  const [key, setKey] = useState('workspace');
  return (
    <div className='App' data-bs-theme='dark'>
      <header className='header__wrap'>
        <h1 className='header__text'>Калькулятор предложения</h1>
      </header>
      <main>
        <Form className='form'>
          <Tabs
            id='options'
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            >
            <Tab eventKey='workspace' title='DF Workspace Premium'>
              <p className='tabText'>Tab content for DF Workspace Premium</p>
            </Tab>
            <Tab eventKey='backspace' title='Хранилище резервных копий'>
              Tab content for Хранилище резервных копий
            </Tab>
            <Tab eventKey='veeam' title='Резервное копирование Veeam'>
              Tab content for Резервное копирование veeam
            </Tab>
          </Tabs>
        </Form>

      </main>
      <footer className='footer'>
        <h3 className='footer__h3'>Нашли ошибку или не хватает функционала?</h3>
        <p className='footer__text'> Пишите нам на <a href='https://t.me/TheZavitaev' className='footer__link'>@TheZavitaev</a>, мы всё быстро починим!</p>
      </footer>
    </div>
  );
}

export default App;
