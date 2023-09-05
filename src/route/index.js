console.clear()

// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

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
// router.get('/', function (req, res) {
//   const list = User.getList()

//   res.render('index', {
//     style: 'index',

//     data: {
//       users: {
//         list,
//         isEmpty: list.length === 0,
//       },
//     },
//   })
// })

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувача видалено',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Користувача модифіковано'
      : 'Помилка оновлення',
  })
})

// =====================================

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
