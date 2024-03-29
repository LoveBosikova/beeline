import './App.scss';
import React from 'react';
import { useState, useEffect, useId } from 'react';

import data from './mock';

import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function App() {

  const orderSample = {
    id: useId(),
    price: 0,
    price_withDiscount: 0,
    price_withVAT: 0, 
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

  const [price, setPrice] = useState(0);
  const [priceDiscount, setPriceDiscount] = useState(price);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Сохраняем значения тарифов, чтобы каждый раз не шастать по большому объекту с бека
  const libraTarif = data[0].services[0]['DF Workspace Premium'].types[0];
  const premiumTarif = data[0].services[0]['DF Workspace Premium'].types[1];
  const branding = data[0].services[0]['DF Workspace Premium'].options[0];
  const plusGb = data[0].services[0]['DF Workspace Premium'].options[1];
  const fz = data[0].services[0]['DF Workspace Premium'].options[2];
  const plusRepo = data[0].services[0]['DF Workspace Premium'].plus['Хранилище резервных копий'];
  const plusVeeam = data[0].services[0]['DF Workspace Premium'].plus['Резервное копирование Veeam'];

  const libreClassNames = cn('tarif', {
    'tarif_active': tarif === 'libra',
  });

  const R7ClassNames = cn('tarif', {
    'tarif_active': tarif === 'R7Office',
  });

  function handleTarifLibra () {
    setTarif('libra');
    setIsFz(false);
    const newOptions = order.options.filter((option)=> option.id !== 3);
    setOrder({...order, ...{tarif: {title: libraTarif.title, price: libraTarif.price, tarif_discount: tarifSale, price_withDiscount: tarifSale ? libraTarif.price/100*(100 - tarifSale) : libraTarif.price}}, ...{options: newOptions}})
  }

  function handleTarifPremium () {
    setTarif('R7Office');
    setOrder({...order, ...{tarif: {title: premiumTarif.title, price: premiumTarif.price, tarif_discount: tarifSale, price_withDiscount: tarifSale ? premiumTarif.price/100*(100 - tarifSale) : premiumTarif.price}}})
  }

  function handleTarifSale (value) {
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
            return option;
          }
          return option;
        })}});
      } else if (value < +branding.max_discount){
        setBrandingSale(value);
        setOrder({...order, ...{options: order.options.map((option) => {
          if (option.id === 1) {
            option.discount = value;
            option.price_withDiscount = branding.price/100*(100 - value);
            return option;
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
        const newOptions = [...order.options, {id: 2, 
          title: `DF Workspace Premium plus ${countPlusGb} GB`, 
          price: plusGb.price*countPlusGb, 
          discount: salePlusGb, 
          price_withDiscount: ((plusGb.price*countPlusGb)/100*(100 - salePlusGb)).toFixed(2)}];
        setOrder({...order, ...{options: newOptions}});
      } else if (+value >= 2) {
        const newOptions = order.options.map((option) => {
          if (option.id === 2) {
            option.title = `DF Workspace Premium plus ${countPlusGb} GB`;
            option.price = (plusGb.price*countPlusGb).toFixed(2);
            option.price_withDiscount = (((plusGb.price*countPlusGb)/100)*(100 - salePlusGb)).toFixed(2);
            return option;
          }
          return option;
        })
        setOrder({...order, ...{options: newOptions}});
      }
    }
    setCountPlusGb(+value);
  }

  function handleSalePlusGb (value) {
    const newOptions = order.options.map((option) => {
      if (option.id === 2) {
        option.title = `DF Workspace Premium plus ${countPlusGb} GB`;
        option.discount = value;
        option.price_withDiscount = (((plusGb.price*countPlusGb)/100)*(100 - value)).toFixed(2);
      }
      return option;
    })
    setOrder({...order, ...{options: newOptions}});

    setSalePlusGb(value);
  }

  function handleFz () {
    if (!isFz) {
      const newOptions = [...order.options, {id: 3, title: 'DF Workspace Premium FZ-152', price: fz.price, discount: fzSale, price_withDiscount: fz.price/100*(100 - fzSale)}];
      setOrder({...order, ...{options: newOptions}});
    } else if (isFz) {
      const newOptions = order.options.filter((option)=> option.id !== 3);
      setOrder({...order, ...{options: newOptions}});
    }
    setIsFz(!isFz)
  }

  function handleFzSale (value) {
    if (value >= +fz.max_discount) {
      setFzSale(+fz.max_discount)
    } else if (value < +fz.max_discount){
      setFzSale(value);
      setOrder({...order, ...{options: order.options.map((option) => {
        if (option.id === 3) {
          option.discount = value;
          option.price_withDiscount = fz.price/100*(100 - value);
          return option;
        }
        return option;
      })}});
    }
  }

  function handleRepoGb (value) {
    if (+value === 0) {
      const newPlus = order.plus.filter((plus)=> plus.id !== 1);
      setOrder({...order, ...{plus: newPlus}})
    } else if (value > 0) {
      if (order.plus.filter((plus => plus.id === 1)).length === 0) {
        const newPlus = [...order.plus, {id: 1, title: `Репозиторий (Хранилище) на ${value} Gb`, price: (plusRepo.price*value).toFixed(2), discount: repoGbSale, price_withDiscount: (((plusRepo.price*value)/100)*(100 - repoGbSale)).toFixed(2)}];
        setOrder({...order, ...{plus: newPlus}});
      } else if (order.plus.filter((plus => plus.id === 1)).length >= 1) {
        setOrder({...order, ...{plus: order.plus.map((plus) => {
          if (plus.id === 1) {
            plus.title = `Репозиторий (Хранилище) на ${value} Gb`;
            plus.price = (plusRepo.price*value).toFixed(2);
            plus.price_withDiscount = (((plusRepo.price*value)/100)*(100 - repoGbSale)).toFixed(2);
            return plus;
          }
          return plus;
        })}});
        // const newPlus = order.plus.map((plus) => {
        //   if (plus.id === 1) {
        //     plus.title = `Репозиторий (Хранилище) на ${value} Gb`;
        //     plus.price = (plusRepo.price*value).toFixed(2);
        //     plus.price_withDiscount = (((plusRepo.price*value)/100)*(100 - repoGbSale)).toFixed(2);
        //     return plus;
        //   }
        //   return plus;
        // })
      }
    }
    setRepoGb(value);
  };

  function handleRepoGbSale (value) {
      setRepoGbSale(value);

      // console.log(value);
      const newPluses = order.plus.map((plus) => {
        if (plus.id === 1) {
          plus.discount = value;
          plus.price_withDiscount = (((plusRepo.price*repoGb)/100)*(100 - value)).toFixed(2);
          // console.log((((plusRepo.price*repoGb)/100)*(100 - value)).toFixed(2));
          return plus;
        }
        return plus;
      })
      setOrder({...order, ...{plus: newPluses}});
  }

  function handleIsVeeam() { 
    if (isVeeam) {
      const newPlus = order.plus.filter((plus)=> plus.id !== 2);
      setOrder({...order, ...{plus: newPlus}})
    } else if (!isVeeam) {
      const newPlus = [...order.plus, {id: 2, title: `Резервное копирование ВМ с администрированием`, price: plusVeeam.price, discount: veeamSale, price_withDiscount: ((plusVeeam.price/100)*(100 - veeamSale)).toFixed(2)}];
        setOrder({...order, ...{plus: newPlus}});
    }
    setIsVeeam(!isVeeam)
  }

  function handleVeeamSale (value) {
    setVeeamSale(value)

    order.plus.map((plus) => {
      if (plus.id === 2) {
        plus.discount = value;
        plus.price_withDiscount = ((plusVeeam.price/100)*(100 - value)).toFixed(2);
      }
      return plus;
    })
  }

  useEffect(()=> {
    const tarifPrice = tarif !== '' ? order.tarif.price : 0;
    const brandingPrice = isBranding ? order.options.filter((option) => option.id === 1).map((i) => i.price) : 0;
    const plusGbPrice = countPlusGb > 0 ? order.options.filter((option) => option.id === 2).map((i) => i.price) : 0;
    const fzPrice = isFz ? order.options.filter((option) => option.id === 3).map((i) => i.price) : 0;
    const repoGbPrice = repoGb > 0 ? order.plus.filter((plus) => plus.id === 1).map((i) => i.price) : 0;
    const veeamPrice = isVeeam ? order.plus.filter((plus) => plus.id === 2).map((i) => i.price) : 0;

    const totalPrice = +tarifPrice + +brandingPrice + +plusGbPrice + +fzPrice + +repoGbPrice + +veeamPrice;

    const tarifPriceDiscount = tarifSale > 0 ? order.tarif.price_withDiscount : 0;

    const brandingPriceDiscount = brandingSale > 0 ? order.options.filter((option) => option.id === 1).map((i) => i.price_withDiscount) : tarif !== '' ? order.tarif.price : 0;
    const plusGbPriceDiscount = salePlusGb > 0 ? order.options.filter((option) => option.id === 2).map((i) => i.price_withDiscount) : isBranding ? order.options.filter((option) => option.id === 1).map((i) => i.price) : 0;
    const fzPriceDiscount = fzSale > 0 ? order.options.filter((option) => option.id === 3).map((i) => i.price_withDiscount) : isFz ? order.options.filter((option) => option.id === 3).map((i) => i.price) : 0;

    const repoGbPriceDiscount = repoGbSale > 0 ? order.plus.filter((plus) => plus.id === 1).map((i) => i.price_withDiscount) : repoGb > 0 ? order.plus.filter((plus) => plus.id === 1).map((i) => i.price) : 0;
    const veeamPriceDiscount = veeamSale > 0 ? order.plus.filter((plus) => plus.id === 2).map((i) => i.price_withDiscount) : isVeeam ? order.plus.filter((plus) => plus.id === 2).map((i) => i.price) : 0;
    let totalPriceDiscount = +tarifPriceDiscount + +brandingPriceDiscount + +plusGbPriceDiscount + +fzPriceDiscount + +repoGbPriceDiscount + +veeamPriceDiscount;

    totalPriceDiscount = totalPriceDiscount === 0 ? totalPrice : totalPriceDiscount;

    setPrice(totalPrice.toFixed(2));
    setPriceDiscount(totalPriceDiscount.toFixed(2));

    setOrder({...order, ...{price: totalPrice}, ...{price_withDiscount: totalPriceDiscount.toFixed(2)}, ...{price_withVAT: ((+totalPriceDiscount/100)*120).toFixed(2)}});
  }, [tarif, isBranding, countPlusGb, isFz, repoGb, isVeeam, price, priceDiscount, tarifSale, brandingSale, salePlusGb, fzSale, repoGbSale, veeamSale, price, ]);

  console.log(order);

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
                  {countPlusGb > 0 && <label className='plusGb__saleWrap'><p>Скидка:</p><input type='number' value={salePlusGb} min={0} max={plusGb.max_discount} onChange={(e) => handleSalePlusGb(e.target.value)} /></label>}
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
                      onChange={handleFz}
                      /> : <Form.Check // prettier-ignore
                      className='fz__switch'
                      type="switch"
                      id="fz-switch"
                      label="Добавить в заказ"
                      checked={isFz}
                      onChange={handleFz}
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
                  {repoGb > 0 && <label className='repoGb__saleWrap'><p className='repoGb__saleText'>Скидка:</p><input type='number' min={0} max={plusRepo.max_discount} value={repoGbSale} onChange={e => handleRepoGbSale(e.target.value)} /></label>}
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
                      onChange={handleIsVeeam}
                      /> : <Form.Check // prettier-ignore
                      className='veeam__switch'
                      type="switch"
                      id="custom-switch"
                      label="Добавить резервное копирование ВМ с администрированием в заказ"
                      checked={isVeeam}
                      onChange={handleIsVeeam}
                      disabled
                      />}
              {isVeeam && <label className='veeam__saleWrap'><p className='veeam__saleText'>Скидка:</p><input type='number' min={0} max={plusVeeam.max_discount} value={veeamSale} onChange={e => handleVeeamSale(e.target.value)} /></label>}
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
                                <p className='result__salePrice'>{order.tarif.price_withDiscount}.00₽</p>
                              </div>}
                            </div>}

            {order.options.length > 0 && <div className='result__wrap'>
                              <p className='result__subtitle'>Опции к тарифу:</p>

                              {isBranding && <React.Fragment key={1}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{branding.title}</p>
                                    <p className='result__itemPrice'>{branding.price}₽</p>
                                  </div>
                                  {+brandingSale !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {brandingSale}%:</p>
                                  <p className='result__salePrice'>{branding.price/100*(100 - brandingSale)}.00₽</p>
                                </div>}
                                </React.Fragment>}

                                {countPlusGb > 0 && <React.Fragment key={2}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{`DF Workspace Premium plus ${countPlusGb} GB`}</p>
                                    <p className='result__itemPrice'>{(plusGb.price*countPlusGb).toFixed(2)}₽</p>
                                  </div>
                                  {+salePlusGb !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {salePlusGb}%:</p>
                                  <p className='result__salePrice'>{((plusGb.price*countPlusGb)/100*(100 - salePlusGb)).toFixed(2)}₽</p>
                                </div>}
                                </React.Fragment>}

                                {isFz && <React.Fragment key={3}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{fz.title}</p>
                                    <p className='result__itemPrice'>{fz.price}₽</p>
                                  </div>
                                  {+fzSale !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {fzSale}%:</p>
                                  <p className='result__salePrice'>{(fz.price/100*(100 - fzSale)).toFixed(2)}₽</p>
                                </div>}
                                </React.Fragment>}
                            </div>
            } 

            {order.plus.length > 0 && <div className='result__wrap'>
                              <p className='result__subtitle'>Дополнительно:</p>

                              {repoGb > 0 && <React.Fragment key={1}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{`Репозиторий (Хранилище) на ${repoGb} Gb`}</p>
                                    <p className='result__itemPrice'>{plusRepo.price*repoGb}₽</p>
                                  </div>
                                  {+repoGbSale !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {repoGbSale}%:</p>
                                  <p className='result__salePrice'>{branding.price/100*(100 - repoGbSale)}₽</p>
                                </div>}
                                </React.Fragment>}

                              {isVeeam && <React.Fragment key={2}>
                                  <div className='result__item'>
                                    <p className='result__itemName'>{plusVeeam.title}</p>
                                    <p className='result__itemPrice'>{plusVeeam.price}₽</p>
                                  </div>
                                  {+veeamSale !== 0 && <div className='result__saleWrap'>
                                  <p className='result__sale'>С учётом скидки {veeamSale}%:</p>
                                  <p className='result__salePrice'>{(plusVeeam.price/100*(100 - veeamSale)).toFixed(2)}₽</p>
                                </div>}
                                </React.Fragment>}
                            </div>
            } 

            {order.tarif.title !=='' && <div className='result__priceWrap'>
                                <div className='result__priceTitle'>Итого:</div>
                                <div className='result__priceItem'>
                                  <p className='result__itemName'>Цена без скидки:</p>
                                  <p className='result__itemPrice'>{price}₽</p>
                                </div>
                                {priceDiscount > 0 && <div className='result__priceItem'>
                                  <p className='result__itemName'>Цена со скидкой:</p>
                                  <p className='result__itemPrice'><span className='result__itemPrice--discount'>{order.price_withDiscount}₽</span></p>
                                </div>}
                                <div className='result__priceItem'>
                                  <p className='result__itemName'>Цена с учётом НДС:</p>
                                  <p className='result__itemPrice'><span className='result__itemPrice--final'>{order.price_withVAT}₽</span></p>
                                </div>
                              </div>
            }
          </div>
          <button onClick={handleShow} className='btn--done'>Предложение сформировано!</button>

          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Что идёт на бек <br></br> (удобнее смотреть в консоли):</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal__result'>{JSON.stringify(order)}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            handleClose();
            // setOrder(orderSample);
          }}>
            Хорошо
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
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
