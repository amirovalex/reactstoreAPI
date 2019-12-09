const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const knex = require('knex');

if (process.env.NODE_ENV != 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'sasha',
    password : '',
    database : 'react-store'
  }
});

const salt = bcrypt.genSaltSync(10);
const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());

const storage = [
   {name:"Black Hoodie",
    price:"120",
    category:"topwear",
    id:"1",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    src:"https://cdn.rickowens.eu/products/69433/large/DU19F6285FEP8_09_M_2.jpg?1568643377",
    color:"black"
   },
   {name:"Black Printed T-Shirt",
    price:"90",
    category:"topwear",
    id:"2",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    src:"https://media.yoox.biz/items/12/12309386jw_14g_f.jpg",
    color:"black"
   },
   {name:"White Shirt",
    price:"80",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"topwear",
    id:"3",
    src:"https://media.yoox.biz/items/38/38854637hr_14_r.jpg",
    color:"white"
   },
   {name:"Leather Pants",
    price:"200",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"bottomwear",
    id:"4",
    src:"https://cdn.rickowens.eu/products/63433/large/RU19F4392LS09_48_1.jpg?1557493178",
    color:"black"
   },
   {name:"Sport Shorts",
    price:"70",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"bottomwear",
    id:"5",
    src:"https://i.pinimg.com/originals/e0/9d/73/e09d738579b13bd62a0f01bde4e7a634.jpg",
    color:"black"
   },
   {name:"Cargo Pants",
    price:"150",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"bottomwear",
    id:"6",
    src:"https://cdn.rickowens.eu/products/68037/large/RU19F4396TE_133-46-1.jpg?1563806617",
    color:"black"
   },
   {name:"Cargo Shorts",
    price:"80",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"bottomwear",
    id:"7",
    src:"https://cdn.rickowens.eu/products/69115/large/DU19F6386RIG03_S_1.jpg?1566295209",
    color:"black"
   },
   {name:"Logo Cap",
    price:"40",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"accessories",
    id:"8",
    src:"https://media.yoox.biz/items/46/46644729fa_14g_f.jpg",
    color:"black"
   },
  {name:"Silver Necklace",
    price:"150",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"accessories",
    id:"9",
    src:"https://media.yoox.biz/items/50/50232285ox_29_e.jpg",
    color:"black"
   },
   {name:"Black Backpack",
    price:"80",
    quantity: {
    	xs: "2",
    	s: "2",
    	m: "2",
    	l: "2",
    	xl: "2"
    },
    category:"accessories",
    id:"10",
    src:"https://media.yoox.biz/items/45/45461845bt_14g_f.jpg",
    color:"black"
   },
]

const database = {
	users: [
	{
		id:'123',
		name:'John',
		email:'john@gmail.com',
		isAdmin:false,
		joined: new Date()
	},
	{
		id:'124',
		name:'Sally',
		email:'sally@gmail.com',
		isAdmin:false,
		joined: new Date()
	}
	],
	login: [
	{
		id:'123',
		email:'john@gmail.com',
		hash: "$2a$10$wkJ449dguWjDPFk7NuV.ruWGMyT2O2F5cc4AuJdmg83I/U2TCAvdW"//cookies
	},
	{
		id:'124',
		email:'sally@gmail.com',
		hash:"$2a$10$wkJ449dguWjDPFk7NuV.ruPsKDZNleQ8PO0SaxKQiNKYWvzxDjzzO"//bananas
	}
	]
}

const shipping = {
	users:[
	{	
		id:"123",
		cart:[
		{
			id:"1",
			size:"m",
			quantity:"2"
		},
		{
			id:"2",
			size:"l",
			quantity:"1"
		}
		],
		shipping:{
			name:"John Ivanov",
			country:"Russia",
			city:"Moscow",
			adress:"Moscow St. 1",
			index:"134522"
		}
	},
	{	
		id:"124",
		cart:[
		{
			id:"5",
			size:"xs",
			quantity:"1"
		},
		{
			id:"8",
			size:"m",
			quantity:"1"
		}
		],
		shipping:{
			name:"Sally Queen",
			country:"Israel",
			city:"Tel Aviv",
			adress:"Kikar St. 4",
			index:"145532"
		}
	}
	]
}

// app.use((req,res,next) =>{
// 	console.log('<h1>hellooo</h1>')
// 	next()
// }) THIS IS A MIDDLEWARE
app.get('/', (req,res) => {
	res.send('its working');
})

app.post('/signin', (req,res) => {
	const { email , password } = req.body;
	db.select('email','hash').from('login')
		.where('email','=',email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
				.where('email','=',email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req,res) => {
	const { email , name , password } = req.body;
	const hash = bcrypt.hashSync(password, salt);
	db.transaction(trx => {
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({firstname:name,
					email:loginEmail[0],
					joined:new Date()
					}).then(user => {
					res.json(user[0])
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
				.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	db.select('*').from('users').where({
		'id':id
	}).then(user => {
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('unable to get user')
		}
	}).catch(err => res.status(400).json('unable to get user'))
})

app.get('/storage/:id', (req,res) => {
	let found = false
	const { id } = req.params;
	storage.map((item) => {
		if (item.id === id) {
			found = true
			return res.json(item)
		}
	})
	if (!found) {
		res.status(400).json('not found')
	}
})

app.get('/shipping/:id', (req,res) => {
	let found = false
	const { id } = req.params;
	db('shipping')
		.where( 'shipping.cartid' , '=' , id)
		.join('cart' , 'cart.cartid' , '=' , 'shipping.cartid')
		.join('storage' , 'storage.itemid' , '=' , 'cart.itemid')
		.select('shipping.fullname','shipping.country','shipping.city',
			'shipping.adress','shipping.index','shipping.userid',
			'cart.cartid','cart.itemid','cart.itemsize','cart.quantity', 'storage.itemimage')
		.then(items => {
			if (items.length > 0) {
				found = true
				res.status(200).json(items)
			} else if (items.length === 0) {
				res.status(400).json('not found')
			}
		})
})

app.get('/shippingitems/', (req,res) => {
	let found = false
		db('shipping')
			.select('shipping.cartid')
			.join('cart' , 'cart.cartid' , '=' , 'shipping.cartid')
			.select('shipping.fullname','shipping.country', 'shipping.userid',	
					'shipping.cartid','cart.quantity')
				.then(items => {
					let finalQuantity = 0
					let finalorders = []
					let helper = {};
					let result = items.reduce((acc,val) => {
						let key = val.cartid

						if(!helper[key]) {
							helper[key] = Object.assign({},val)
							acc.push(helper[key]);
						}	else {
							helper[key].quantity += val.quantity;
						}
						return acc;
					}, []);
					if (items.length > 0) {
						found = true
						res.status(200).json(result)
					} else if (items.length === 0) {
						res.status(400).json('not found')
					}
				})
})

app.post("/additem", (req,res) => {
	const { name , price , category ,
			quantity , itemid , imgsrc ,
			color } = req.body;
			const quantityParse = JSON.parse(quantity)
			console.log('req body',req.body)
			db.transaction(trx => {
				trx.insert({
					itemid:itemid,
					xs:quantityParse.xs,
					s:quantityParse.s,
					m:quantityParse.m,
					l:quantityParse.l,
					xl:quantityParse.xl
				})
					.into('quantity')
					.returning('itemid')
					.then(storageItemId => {
						return trx('storage')
							.returning('*')
							.insert({
								itemname:name,
								itemimage:imgsrc,
								price:price,
								category:category,
								itemid:storageItemId[0]
							}).then(item => {
								res.json('success')
						})
		})
			.then(trx.commit)
			.catch(trx.rollback)
	})	
					.catch(err => res.status(400).json('cant add item'))
})

app.get('/getstorage', (req,res) => {
	 db.select('*').from('storage').then(items =>
	 	res.json(items))
})

app.get('/getquantity/:id', (req,res) => {
	const { id } = req.params
	// db.select('*').from('quantity').where('itemid', id).then(
	// 	item => res.json(item[0]))
	db('quantity')
		.join('storage' , 'quantity.itemid' , '=' , 'storage.itemid')
		.select('quantity.xs','quantity.s','quantity.m',
			'quantity.l','quantity.xl','storage.itemimage','storage.itemid')
		.then(item => res.json(item[0]))
})

app.put('/updatequantity/:id', (req,res) => {
	const { id } = req.params
	const { xs , s , m , l , xl , imagesrc} = req.body
	// db('quantity').where({itemid:id}).update({ xs:xs , s:s , m:m , l:l , xl:xl })
	// .then(item => res.json(item))
	console.log('req body', req.body)
	db.transaction(trx => {
		db('quantity')
		.where({itemid:id})
		.update({
			xs:xs , s:s , m:m , l:l , xl:xl
		})
		.returning('itemid')
		.then(itemId => {
			return trx('storage')
			.returning('*')
			.where({itemid:id})
			.update({itemimage:imagesrc})
			.then(item => {
					res.json('success')
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		.catch(err => res.status(400).json('cant edit item'))
})

app.delete("/deleteitem/:id", (req,res) => {
	const { id } = req.params
	console.log('req body', req.body)
	db.transaction(trx => {
		db('quantity')
		.where({itemid:id})
		.del()
		.returning('itemid')
		.then(itemId => {
			return trx('storage')
			.returning('*')
			.where({itemid:id})
			.del()
			.then(item => {
				res.json('success')
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		.catch(err => res.status(400).json('cant delete item'))
})

app.post('/payment', (req,res) => {
	console.log(req.body)
	const body = {
		source: req.body.token.id,
		amount: req.body.amount,
		currency: 'usd',
	};

	stripe.charges.create(body, (stripeErr, stripeRes) => {
		if (stripeErr) {
			res.status(500).json(stripeErr)
		} else {
			const { token , userid , itemid , size , quantity , cart } = req.body

			db.transaction(trx => {
				trx('shipping')
					.returning('cartid')
					.insert({
						fullname:token.card.name,
						country:token.card.address_country,
						city:token.card.address_city,
						adress:token.card.address_line1,
						index:token.card.address_zip,
						userid:userid})
					.then(cartId => {
						console.log(cartId[0])
						const cartToInsert = cart.map(item => ({
							cartid:cartId[0],
							itemid:item.itemid,
							quantity:item.quantity,
							userid:userid,
							itemsize:item.itemsize
						}))
						 return trx('cart')
							.returning('*')
							.insert(cartToInsert)
						})
					.then(item => {
							res.json('success')
					}).catch(err => console.log('cart',err))
			.then(trx.commit)
			.catch(trx.rollback)
		}).catch(err => console.log('trx',err))
	}
})
})

app.listen(3000,()=> {
	console.log('app is running on port 3000')
})

// app.get('/:id', (req,res)=> {
// 	// console.log(req.query)
// 	// console.log(req.body)
// 	// console.log(req.headers)
// 	console.log(req.params)
// 	res.status(200).send('getting root')
// })

// app.get('/profile', (req,res)=> {
// 	res.send('getting profile')
// })

// app.post('/profile', (req,res)=> {
// 	console.log(req.body)
// 	res.send(req.body)
// })

/*

	/ --> res = this is working
	/signin		--> POST = success/fail 
	/register	--> POST = user
	/profile/:userId	--> GET = user
	/charge		--> POST = cart
	/storage 	--> GET  = available items
	/shipping	--> POST = cart
*/