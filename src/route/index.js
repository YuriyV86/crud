console.clear()

// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count // унікальний ID товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    // console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice.toFixed(2)
    this.productPrice = data.productPrice.toFixed(2)
    this.deliveryPrice = data.deliveryPrice.toFixed(2)
    this.amount = data.amount.toFixed(0)

    this.product = product

    this.calcBonus = Purchase.calcBonusAmount(
      product.price,
    ).toFixed(0)
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
    // return Purchase.#list.reverse();
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname
      }

      if (data.lastname) {
        purchase.lastname = data.lastname
      }

      if (data.phone) {
        purchase.phone = data.phone
      }

      if (data.email) {
        purchase.email = data.email
      }

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((item) => item.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

// ================================================================

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  27001,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  17000,
  11,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  113000,
  12,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  9999,
  9,
)

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// router.get Створює нам один ентпоїнт
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: { list: Product.getList() },
  })
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Некорректна кількість товару ',
      link: `/purchase-product?id=${id}`,
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Такої кількості товару немає в наявності',
      link: `/purchase-product?id=${id}`,
    })
  }

  const productPrice = product.price * amount
  const totalPrice = product.price + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт.)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,
    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Товар не знайдено',
      link: `/purchase-list`,
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Невірна кількість товару',
      link: `/purchase-list`,
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Некоректні дані',
      link: `/purchase-list`,
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: "Заповніть обов'язкові поля",
      link: `/purchase-list`,
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  totalPrice = Math.max(totalPrice, 0.01)

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    product,
  )

  // console.log(purchase)

  return res.render('alert', {
    style: 'alert',
    success: true,
    info: 'Замовлення створено',
    link: `/purchase-list`,
  })
})

router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: Purchase.getList(),
    },
  })
})

router.get('/purchase-view/', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  // console.log(purchase)

  res.render('purchase-view', {
    style: 'purchase-view',
    purchase: purchase,
    deliveryPrice: Purchase.DELIVERY_PRICE,
  })
})

router.post('/purchase-edit', function (req, res) {
  // const id = Number(req.query.id)

  res.render('purchase-edit', {
    style: 'purchase-edit',
    purchase: Purchase.getById(Number(req.query.id)),
  })
})

router.post('/purchase-edit-submit', function (req, res) {
  // console.clear()

  const id = Number(req.query.id)
  let { firstname, lastname, email, phone } = req.body

  const purchase = Purchase.getById(id)

  // console.log(purchase)

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: "Заповніть обов'язкові поля",
      link: `/purchase-list`,
    })
  }

  Purchase.updateById(id, {
    firstname,
    lastname,
    email,
    phone,
  })

  // console.log(purchase)

  return res.render('alert', {
    style: 'alert',
    success: true,
    info: 'Замовлення оновлено',
    link: `/purchase-list`,
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
