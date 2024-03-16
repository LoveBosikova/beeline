import './App.scss';
import { useState, useEffect } from 'react';

import data from './mock';

import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';

function App() {
  const [key, setKey] = useState('workspace');
  const [tarif, setTarif] = useState('');
  const [tarifSale, setTarifSale] = useState(0);
  const [isBranding, setIsBranding] = useState(false);
  const [brandingSale, setBrandingSale] = useState(0);

  //Сохраняем значения тарифов, чтобы каждый раз не шастать по большому объекту с бека
  const libraTarif = data[0].services[0]['DF Workspace Premium'].types[0];
  const premiumTarif = data[0].services[0]['DF Workspace Premium'].types[1];
  const branding = data[0].services[0]['DF Workspace Premium'].options[0];
  const plusGb = data[0].services[0]['DF Workspace Premium'].options[1];
  const fz = data[0].services[0]['DF Workspace Premium'].options[2];

  const libreClassNames = cn('tarif', {
    'tarif_active': tarif === 'libra',
  });

  const R7ClassNames = cn('tarif', {
    'tarif_active': tarif === 'R7Office',
  });

  console.log(!!tarif);

  function handleTarifSale (value) {
    if (tarif === 'libra') {
      if (value >= +libraTarif.max_discount) {
        setTarifSale(+libraTarif.max_discount)
      } else if (value < +libraTarif.max_discount){
        setTarifSale(value)
      }
    }

    if (tarif === 'R7Office') {
      if (value >= +premiumTarif.max_discount) {
        setTarifSale(+premiumTarif.max_discount)
      } else if (value < +premiumTarif.max_discount) {
        setTarifSale(+value)
      }
    }
  }

  function handleIsBrandind () {
    setIsBranding(!isBranding)
  }

  function handleBrandingSale (value) {
    console.log(value);
      if (value >= +branding.max_discount) {
        setBrandingSale(+branding.max_discount)
      } else if (value < +branding.max_discount){
        setBrandingSale(value)
      }
  }


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
                <label className={libreClassNames} >
                    <input className='tarif__input' type="radio" value="libra" checked={tarif === 'libra'} onChange={() => setTarif('libra')} />
                    <h4 className='tarif__title'>Libre</h4>
                    <p className='tarif__desk'>Оптимальный</p>
                </label>
                <label className={R7ClassNames}>
                    <input className='tarif__input' type="radio" value="R7Office"  checked={tarif === 'R7Office'} onChange={() => setTarif('R7Office')} />
                    <h4 className='tarif__title'>R7 Office</h4>
                    <p className='tarif__desk'>Premium</p>
                </label>
              </div>
              {tarif !== '' && <label className='tarif__saleWrap'><p>Скидка:</p><input value={tarifSale} onChange={e => handleTarifSale(e.target.value)} /></label>}

              <Accordion className='tarif__options'>
                <Accordion.Item eventKey={branding.id}>
                  <Accordion.Header>{branding.title}</Accordion.Header>
                  <Accordion.Body className='branding__wrap'>
                    {tarif? <Form.Check // prettier-ignore
                      className='branding__switch'
                      type="switch"
                      id="custom-switch"
                      label="Добавить в заказ"
                      checked={isBranding}
                      onChange={handleIsBrandind}
                      /> : <Form.Check // prettier-ignore
                      className='branding__switch'
                      type="switch"
                      id="custom-switch"
                      label="Добавить в заказ"
                      checked={isBranding}
                      onChange={handleIsBrandind}
                      disabled
                      />}
                      {isBranding && <label className='branding__saleWrap'><p>Скидка:</p><input value={brandingSale} onChange={e => handleBrandingSale(e.target.value)} /></label>}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={plusGb.id}>
                  <Accordion.Header>{plusGb.title}</Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={fz.id}>
                  <Accordion.Header>{fz.title}</Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

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
