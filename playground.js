const Fuse = require('fuse.js')

const people = [
	{
		name: "John",
		city: "New York"
	},
	{
		name: "Jonn",
		city: "Seattle"
	},
	{
		name: "Bill",
		city: "Omaha"
	}
]

const fuse = new Fuse(people, {
	keys: ['name', 'city']
})

// Search
const result = fuse.search('jon')

result.forEach(row => {
    console.log(row.item)
})
