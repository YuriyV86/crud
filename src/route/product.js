console.clear()

// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000)
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date()
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === Number(id))

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }

    if (price) {
      product.price = price
    }

    if (description) {
      product.description = description
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === Number(id),
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  let list = Product.getList()

  if (list.length === 0) {
    Product.add(
      new Product('name1', 111, 'descr1gy yufufiygyh'),
    )
    Product.add(
      new Product(
        'name2',
        222,
        'descr2njib huh gyyufufiygyh yugygy ggyoiuugugyyug',
      ),
    )
    Product.add(
      new Product('name3', 333, 'descr3 ggyoiuugugyyug'),
    )
    Product.add(new Product('name4', 444, 'descr4 yugygy'))

    list = Product.getList()
  }

  res.render('product-list-ui', {
    style: 'product-list-ui',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

router.get('/product-create', function (req, res) {
  res.render('product-create-ui', {
    style: 'product-create-ui',
  })
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  let result = false

  let product = new Product(name, price, description)

  Product.add(product)
  result = true

  res.render('alert', {
    style: 'alert',
    success: result,
    info: result
      ? 'Товар був успішно створений'
      : 'Помилка створення товару',
  })
})

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list-ui', {
    style: 'product-list-ui',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  let product = Product.getById(id)

  if (product !== undefined) {
    res.render('product-edit-ui', {
      style: 'product-edit-ui',
      data: {
        product,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Товар з таким ID не знайдено',
    })
  }
})

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const result = Product.updateById(id, {
    name,
    price,
    description,
  })

  res.render('alert', {
    style: 'alert',
    success: result,
    info: result
      ? 'Товар успішно оновлено'
      : 'Помилка оновлення товару',
  })
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const result = Product.deleteById(id)

  res.render('alert', {
    style: 'alert',
    success: result,
    info: result
      ? 'Товар успішно видалено'
      : 'Помилка видалення товару',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
