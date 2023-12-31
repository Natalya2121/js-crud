// Підключаємо технологію express для back-end сервера
const e = require('express')
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
    } else return false
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      //Object.assign(user, data)
      //if (email) user.email = email
      this.update(user, data)
      return true
    } else return false
  }

  static update = (user, { email }) => {
    if (email) user.email = email
  }
}
// ================================================================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.id = Math.ceil(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else return false
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) product.name = name
    if (price) product.price = price
    if (description) product.description = description
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else return false
  }
}
// ================================================================
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
// router.get('/', function (req, res) {
//   // res.render генерує нам HTML сторінку
//   const list = User.getList()
//   // ↙️ cюди вводимо назву файлу з сontainer
//   res.render('index', {
//     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
//     style: 'index',

//     data: {
//       users: {
//         list,
//         isEmpty: list.length === 0,
//       },
//     },
//   })
//   // ↑↑ сюди вводимо JSON дані
// })

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  const user = User.getById(Number(id))
  let result = false

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email адреса оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно був створений',
    title: 'Успішне виконання дії',
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  let product = Product.getById(Number(id))
  if (product === undefined)
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдений',
      title: 'Операція не виконана',
    })
  else
    res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',
      data: { ...product },
      // data: product,
    })
})

// ================================================================
router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const product = Product.getById(Number(id))
  let result = false

  if (product !== undefined) {
    Product.update(product, { name, price, description })
    result = true
  }
  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно був оновлений'
      : 'Товар з таким ID не знайдений',
    title: result
      ? 'Успішне виконання дії'
      : 'Операція не виконана',
  })
})

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let product = Product.getById(Number(id))
  let result = false
  if (product !== undefined) {
    Product.deleteById(Number(id))
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно був видалений'
      : 'Товар з таким ID не знайдений',
    title: result
      ? 'Успішне виконання дії'
      : 'Операція не виконана',
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
