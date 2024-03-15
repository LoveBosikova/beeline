import './App.scss';
import { useState } from 'react';

import data from './mock';

import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function App() {
  const [key, setKey] = useState('workspace');
  const [tarif, setTarif] = useState('libra');
  console.log(data[0]);

  const libreClassNames = cn('tarif', {
    'tarif_active': tarif === 'libra',
  });

  const R7ClassNames = cn('tarif', {
    'tarif_active': tarif === 'R7Office',
  });

  return (
    <div className='App' data-bs-theme='dark'>
      <header className='header__wrap'>
        <h1 className='header__text'>Калькулятор предложения</h1>
      </header>
      <main className='main'>

        <Form className='form'>
          <Tabs
            id='options'
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            >
            <Tab eventKey='workspace' title='DF Workspace Premium'>
              <h3 className='tabText'>Выберите тариф DF Workspace Premium</h3>
              <div className='tarifs'>
            <div className={libreClassNames}>
              <label>
                <input className='tarif__input' type="radio" value="libra" checked={() => setTarif('libra')} />
                <h4 className='tarif__title'>Libre</h4>
                <p className='tarif__desk'>Оптимальный</p>
              </label>
            </div>
            <div className={R7ClassNames}>
              <label>
                <input className='tarif__input' type="radio" value="R7Office" checked={() => setTarif('R7Office')} />
                <h4 className='tarif__title'>R7 Office</h4>
                <p className='tarif__desk'>Premium</p>
              </label>
            </div>
          </div>
            </Tab>
            <Tab eventKey='backspace' title='Хранилище резервных копий'>
              Tab content for Хранилище резервных копий
            </Tab>
            <Tab eventKey='veeam' title='Резервное копирование Veeam'>
              Tab content for Резервное копирование veeam
            </Tab>
          </Tabs>


        </Form>

        <section className='tarif'>
          <div className='result__content'>
            <p className='result__title'>Вы выбрали:</p>

          </div>
        </section>

      </main>
      <footer className='footer'>
        <h3 className='footer__h3'>Нашли ошибку или не хватает функционала?</h3>
        <p className='footer__text'> Пишите нам на <a href='https://t.me/TheZavitaev' className='footer__link'>@TheZavitaev</a>, мы всё быстро починим!</p>
      </footer>
    </div>
  );
}

export default App;
