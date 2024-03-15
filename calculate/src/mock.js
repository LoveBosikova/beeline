const data = [{
    'product': 'DF Workspace Premium',
    'services': [
        {
            'DF Workspace Premium': {
                'types': [
                    {
                        "id":"1",
                        "service_element": "DF Workspace стартовый пакет",
                        "title": "DF Workspace стартовый пакет",
                        "unit": "шт",
                        "charge_type": "flat rate",
                        "price": "24500.00",
                        "min_price": "22050.00",
                        "currency": "Российский рубль",
                        "max_discount": "10",
                        },
                        {
                        "id":"2",
                        "service_element":"DF Workspace стартовый пакет",
                        "title": "DF Workspace R7-Office Premium",
                        "unit": "шт",
                        "charge_type": "flat rate",
                        "price": "34500.00",
                        "min_price": "31050",
                        "currency": "Российский рубль",
                        "max_discount": "10",
                        },
                        
                ],
                'options': [
                    {
                        "id":"1",
                        "service_element": "Доп.работы",
                        "title": "Брендирование web-интерфейса",
                        "unit": "шт",
                        "charge_type": "flat rate",
                        "price": "14400.00",
                        "min_price": "12960.00",
                        "currency": "Российский рубль",
                        "max_discount": "10",
                        },
                        {
                        "id":"2",
                        "service_element": "DF Workspace доп. объем",
                        "title": "DF Workspace Premium plus 1 GB",
                        "unit": "Гб",
                        "charge_type": "flat rate",
                        "price": "5.53",
                        "min_price": "4.98",
                        "currency": "Российский рубль",
                        "max_discount": "9.945",
                        },
                        {
                        "id":"3",
                        "service_element": "DF Workspace service",
                        "title": "DF Workspace Premium FZ-152",
                        "unit": "шт",
                        "charge_type": "flat rate",
                        "price": "2500.00",
                        "min_price": "2250",
                        "currency": "Российский рубль",
                        "max_discount": "10",
                        },
                ],
                'plus': {
                    "Хранилище резервных копий": {
                        "id":"1",
                        "service_element": "Репозиторий (Хранилище)",
                        "title": "Backup Storage YM",
                        "unit": "Гб",
                        "charge_type": "flat rate",
                        "price": "2",
                        "min_price": "1.60",
                        "currency": "Российский рубль",
                        "max_discount": "20"
                    },
                    "Резервное копирование Veeam": {
                        "id":"2",
                        "service_element": "Managed Cloud Backup",
                        "title": "Резервное копирование ВМ с администрированием",
                        "unit": "ВМ",
                        "charge_type": "usage based",
                        "price": "1500.00",
                        "min_price": "1200.00",
                        "currency": "Российский рубль",
                        "max_discount": "20",
                        },
                        
                },
            }
        }
    ]
}]

export default data;