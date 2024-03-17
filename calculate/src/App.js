import './App.scss';
import React from 'react';
import { useState, useEffect, useId } from 'react';

import data from './mock';

import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';


function App() {

  const orderSample = {
    id: useId(),
    tarif: {
      title: '',
      tarif_discount: 0,
      price: 0,
      price_withDiscount: 0,
    },
    options: [],
    plus: [],
  }

  const [key, setKey] = useState('workspace');
  const [tarif, setTarif] = useState('');
  const [tarifSale, setTarifSale] = useState(0);
  const [isBranding, setIsBranding] = useState(false);
  const [brandingSale, setBrandingSale] = useState(0);
  const [countPlusGb, setCountPlusGb] = useState(0);
  const [salePlusGb, setSalePlusGb] = useState(0);
  const [isFz, setIsFz] = useState(false);
  const [fzSale, setFzSale] = useState(0);

  const [repoGb, setRepoGb] = useState(0);
  const [repoGbSale, setRepoGbSale] = useState(0);

  const [isVeeam, setIsVeeam] = useState(false);
  const [veeamSale, setVeeamSale] = useState(0);

  const [order, setOrder] = useState(orderSample);

  //Сохраняем значения тарифов, чтобы каждый раз не шастать по большому объекту с бека
  const libraTarif = data[0].services[0]['DF Workspace Premium'].types[0];
  const premiumTarif = data[0].services[0]['DF Workspace Premium'].types[1];
  const branding = data[0].services[0]['DF Workspace Premium'].options[0];
  const plusGb = data[0].services[0]['DF Workspace Premium'].options[1];
  const fz = data[0].services[0]['DF Workspace Premium'].options[2];
  const plusRepo = data[0].services[0]['DF Workspace Premium'].plus['Хранилище резервных копий'];
  const plusVeeam = data[0].services[0]['DF Workspace Premium'].plus['Резервное копирование Veeam'];

  // console.log(data[0].services[0]['DF Workspace Premium']);

  const libreClassNames = cn('tarif', {
    'tarif_active': tarif === 'libra',
  });

  const R7ClassNames = cn('tarif', {
    'tarif_active': tarif === 'R7Office',
  });

  function handleTarifLibra () {
    setTarif('libra');
    setIsFz(false);
    setOrder({...order, ...{tarif: {title: libraTarif.title, price: libraTarif.price, tarif_discount: tarifSale, price_withDiscount: tarifSale ? libraTarif.price/100*(100 - tarifSale) : libraTarif.price}}})
  }

  function handleTarifPremium () {
    setTarif('R7Office');
    setOrder({...order, ...{tarif: {title: premiumTarif.title, price: premiumTarif.price, tarif_discount: tarifSale, price_withDiscount: tarifSale ? premiumTarif.price/100*(100 - tarifSale) : premiumTarif.price}}})
  }

  function handleTarifSale (value) {
    console.log(tarif);
    if (tarif === 'libra') {
      if (value >= +libraTarif.max_discount) {
        setTarifSale(+libraTarif.max_discount)
        setOrder({...order, ...{tarif: {title: libraTarif.title, price: libraTarif.price, tarif_discount: libraTarif.max_discount, price_withDiscount: libraTarif.price/100*(100 - libraTarif.max_discount)}}});
      } else if (value < +libraTarif.max_discount) {
        setTarifSale(value)
        setOrder({...order, ...{tarif: {title: libraTarif.title, price: libraTarif.price, tarif_discount: value, price_withDiscount: libraTarif.price/100*(100 - value)}}})
      }
    }

    if (tarif === 'R7Office') {
      if (value >= +premiumTarif.max_discount) {
        setTarifSale(+premiumTarif.max_discount)
        setOrder({...order, ...{tarif: {title: premiumTarif.title, price: premiumTarif.price, tarif_discount: premiumTarif.max_discount, price_withDiscount: premiumTarif.price/100*(100 - premiumTarif.max_discount)}}})
      } else if (value < +premiumTarif.max_discount) {
        setTarifSale(+value)
        setOrder({...order, ...{tarif: {title: premiumTarif.title, price: premiumTarif.price, tarif_discount: value, price_withDiscount: premiumTarif.price/100*(100 - value)}}})
      }
    }
  }

  function handleIsBrandind () {
    if (!isBranding) {
      const newOptions = [...order.options, {id: 1, title: 'Брендирование web-интерфейса', price: branding.price, discount: brandingSale, price_withDiscount: branding.price/100*(100 - brandingSale)}];
      setOrder({...order, ...{options: newOptions}});
    } else if (isBranding) {
      const newOptions = order.options.filter((option)=> option.id !== 1);
      setOrder({...order, ...{options: newOptions}})
    }
    setIsBranding(!isBranding);
  }

  function handleBrandingSale (value) {
      if (value >= +branding.max_discount) {
        setBrandingSale(+branding.max_discount);
        setOrder({...order, ...{options: order.options.map((option) => {
          if (option.id === 1) {
            option.discount = branding.max_discount;
            option.price_withDiscount = branding.price/100*(100 - branding.max_discount);
          }
          return option;
        })}});
      } else if (value < +branding.max_discount){
        setBrandingSale(value);
        setOrder({...order, ...{options: order.options.map((option) => {
          if (option.id === 1) {
            option.discount = value;
            option.price_withDiscount = branding.price/100*(100 - value);
          }
          return option;
        })}});
      }
  }

  function handleCountPlusGb (value) {
    if (+value === 0) {
      const newOptions = order.options.filter((option)=> option.id !== 2);
      setOrder({...order, ...{options: newOptions}})
    } else if (value > 0) {
      if (+value === 1) {
        const newOptions = [...order.options, {id: 2, title: `DF Workspace Premium plus ${countPlusGb} GB`, price: plusGb.price, discount: salePlusGb, price_withDiscount: plusGb.price/100*(100 - salePlusGb)}];
        setOrder({...order, ...{options: newOptions}});
      } else if (+value >= 2) {
        const newOptions = order.options.map((option) => {
          if (option.id === 2) {
            option.title = `DF Workspace Premium plus ${countPlusGb} GB`;
            option.price = (plusGb.price*countPlusGb).toFixed(2);
            option.price_withDiscount = (((plusGb.price*countPlusGb)/100)*(100 - salePlusGb)).toFixed(2);
          }
          return option;
        })
        setOrder({...order, ...{options: newOptions}});
      }
    }
    setCountPlusGb(+value);
  }

  console.log(order);

  function handleFzSale (value) {
    if (value >= +fz.max_discount) {
      setFzSale(+fz.max_discount)
    } else if (value < +fz.max_discount){
      setFzSale(value)
    }
  }

  function handleRepoGb (value) {
    setRepoGb(value);
  };

  function handleRepoGbSale (value) {
    if (value >= +plusRepo.max_discount) {
      setRepoGbSale(+plusRepo.max_discount)
    } else if (value < +plusRepo.max_discount){
      setRepoGbSale(value)
    }
  }

  function handleVeeamSale (value) {
    if (value >= +plusVeeam.max_discount) {
      setVeeamSale(+plusVeeam.max_discount)
    } else if (value < +plusVeeam.max_discount){
      setVeeamSale(value)
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
                    <input className='tarif__input' type="radio" value="libra" checked={tarif === 'libra'} onChange={handleTarifLibra} />
                    <h4 className='tarif__title'>Libre</h4>
                    <p className='tarif__desk'>Оптимальный</p>
                </label>
                <label className={R7ClassNames}>
                    <input className='tarif__input' type="radio" value="R7Office"  checked={tarif === 'R7Office'} onChange={handleTarifPremium} />
                    <h4 className='tarif__title'>R7 Office</h4>
                    <p className='tarif__desk'>Premium</p>
                </label>
              </div>
              {tarif !== '' && <label className='tarif__saleWrap'><p>Скидка:</p><input type='number' min={0} value={tarifSale} onChange={e => handleTarifSale(e.target.value)} /></label>}

              <Accordion className='tarif__options'>
                <Accordion.Item eventKey={branding.id}>
                  <Accordion.Header>{branding.title}</Accordion.Header>
                  <Accordion.Body className='branding__wrap'>
                    {tarif? <Form.Check // prettier-ignore
                      className='branding__switch'
                      type="switch"
                      id="branding-switch"
                      label="Добавить в заказ"
                      checked={isBranding}
                      onChange={handleIsBrandind}
                      /> : <Form.Check // prettier-ignore
                      className='branding__switch'
                      type="switch"
                      id="branding-switch"
                      label="Добавить в заказ"
                      checked={isBranding}
                      onChange={handleIsBrandind}
                      disabled
                      />}
                      {isBranding && <label className='branding__saleWrap'><p>Скидка:</p><input type='number' min={0} value={brandingSale} onChange={e => handleBrandingSale(e.target.value)} /></label>}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={plusGb.id}>
                  <Accordion.Header>{plusGb.title}</Accordion.Header>
                  <Accordion.Body className='plusGb'>
                  <label className='plusGb__gbWrap'><p>Дополнительные Гб:</p>{tarif !== '' ? <input type='number' value={countPlusGb} min={0} onChange={e => handleCountPlusGb(e.target.value)} /> : <input type='number' disabled value={countPlusGb} min={0} onChange={e => handleCountPlusGb(e.target.value)} />}</label>
                  {countPlusGb > 0 && <label className='plusGb__saleWrap'><p>Скидка:</p><input type='number' value={salePlusGb} min={0} max={plusGb.max_discount} onChange={e => setSalePlusGb(e.target.value)} /></label>}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={fz.id}>
                  <Accordion.Header>{fz.title}</Accordion.Header>
                  <Accordion.Body className='fz'>
                  {tarif === 'R7Office'? <Form.Check // prettier-ignore
                      className='fz__switch'
                      type="switch"
                      id="fz-switch"
                      label="Добавить в заказ"
                      checked={isFz}
                      onChange={() => setIsFz(!isFz)}
                      /> : <Form.Check // prettier-ignore
                      className='fz__switch'
                      type="switch"
                      id="fz-switch"
                      label="Добавить в заказ"
                      checked={isFz}
                      onChange={() => setIsFz(!isFz)}
                      disabled
                      />}
                      {isFz && <label className='fz__saleWrap'><p>Скидка:</p><input type='number' min={0} max={+plusRepo.max_discount} value={fzSale} onChange={e => handleFzSale(e.target.value)} /></label>}
                      
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Tab>

            <Tab className='repoGb' eventKey='backspace' title='Хранилище резервных копий'>
                <Form.Label>
                    <h3 className='repoGb__title'>Гб в хранилище...</h3>
                </Form.Label>
                {tarif !== '' ? <Form.Range
                    value={repoGb}
                    name='repoGb'
                    step={100}
                    min={0}
                    max={30000}
                    onChange={(e) => handleRepoGb(e.target.value)}
                    className="repoGb__slider"
                    /> : <Form.Range
                    value={repoGb}
                    disabled
                    name='repoGb'
                    step={100}
                    min={0}
                    max={30000}
                    onChange={(e) => handleRepoGb(e.target.value)}
                    className="repoGb__slider"
                    />}
                <div className='repoGb__values'>
                  <p>100 Гб.</p>
                  <p>30 Тб.</p>
                </div>
                <div className='repoGb__resWrap'>
                  <h5 className='repoGb__res'>В хранилище: {repoGb} Гб.</h5>
                  {repoGb > 0 && <label className='repoGb__saleWrap'><p className='repoGb__saleText'>Скидка:</p><input type='number' min={0} value={repoGbSale} onChange={e => handleRepoGbSale(e.target.value)} /></label>}
                </div>
            </Tab>

            <Tab eventKey='veeam' title='Резервное копирование Veeam' className='veeam'>
              <Form.Label>
                <h3 className='veeam__title'>Резервное копирование ВМ с администрированием</h3>
                <p className='veeam__subtitle'>Помесячная оплата в зависимости от потребления</p>
              </Form.Label>
              {tarif !== '' ? <Form.Check // prettier-ignore
                      className='veeam__switch'
                      type="switch"
                      id="custom-switch"
                      label="Добавить резервное копирование ВМ с администрированием в заказ"
                      checked={isVeeam}
                      onChange={() => setIsVeeam(!isVeeam)}
                      /> : <Form.Check // prettier-ignore
                      className='veeam__switch'
                      type="switch"
                      id="custom-switch"
                      label="Добавить резервное копирование ВМ с администрированием в заказ"
                      checked={isVeeam}
                      onChange={() => setIsVeeam(!isVeeam)}
                      disabled
                      />}
              {isVeeam && <label className='veeam__saleWrap'><p className='veeam__saleText'>Скидка:</p><input type='number' min={0} value={veeamSale} onChange={e => handleVeeamSale(e.target.value)} /></label>}
            </Tab>
          </Tabs>


        </Form>

        <section className='result'>
          <div className='result__content'>
            <p className='result__title'>Вы выбрали:</p>

            {order.tarif.title ==='' && <div className='result__empty'>Вы ещё ничего не выбрали.</div>}
            {order.tarif.title !=='' && <div className='result__wrap'>
                              <p className='result__subtitle'>Тариф:</p>
                              <div className='result__item'>
                                <p className='result__itemName'>{order.tarif.title}</p>
                                <p className='result__itemPrice'>{order.tarif.price}₽</p>
                              </div>
                              {tarifSale !== 0 && <div className='result__saleWrap'>
                                <p className='result__sale'>С учётом скидки {tarifSale}%:</p>
                                <p className='result__sale'>{order.tarif.price_withDiscount}.00₽</p>
                              </div>}
                            </div>}
            {order.options.length > 0 && <div className='result__wrap'>
                              <p className='result__subtitle'>Опции к тарифу:</p>
                              {order.options.map((option) => {
                                return(
                                  <React.Fragment key={option.id}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{option.title}</p>
                                    <p className='result__itemPrice'>{option.price}₽</p>
                                  </div>
                                  {brandingSale !== '0' && brandingSale !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {option.discount}%:</p>
                                  <p className='result__sale'>{option.price_withDiscount}₽</p>
                                </div>}
                                </React.Fragment>
                                )
                              })}
                            </div>
            }
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
