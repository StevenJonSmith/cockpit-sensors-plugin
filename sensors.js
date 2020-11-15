function strToId(prefix,str) {
	// parses a string into a valid DOM id with a given prefix
	return `${prefix}_${str.replace(/\W+/g,"").toLowerCase()}`
}

function createCard(adapter) {
	// Uses a template element to parse the string into a DOM Element
	// The string contains HTML for a card similar to those found on the cockpit overview page
	let temp = document.createElement("template")
	temp.innerHTML = `<article class="pf-c-card"><div class="pf-c-card__title">${adapter[0]} (${adapter[1].Adapter})</div><div class="pf-c-card__body"><table id="${strToId("adapter",adapter[0])}" class="pf-c-table pf-m-grid-md pf-m-compact"></table></div></article>`
	return temp.content.firstChild
}

function addSensor(card, sensorName, sensorData) {
	// Adds a sensor to the specified card's table
	let table = card.querySelector("table")
	let row = table.insertRow(-1)
	row.id = strToId('sensor',sensorName)
	let name = document.createElement("th")
	name.innerText = sensorName
	row.append(name)
	for (const [key, value] of Object.entries(sensorData)){
		let data = document.createElement("td")
		data.id = strToId(row.id,key)
		data.innerText = `${key.replace(/^\w+_/,"")}: ${value}`
		row.append(data)
	}
}

function updateSensor(adapter, sensorName, sensorData) {
	// Updates table values of given sensor for given adapter
	let table = document.getElementById(strToId("adapter",adapter[0]))
	rowid = strToId('sensor', sensorName)
	row = table.querySelector(`#${rowid}`)
	for (const [key, value] of Object.entries(sensorData)){
		let data = document.querySelector(`#${strToId(rowid,key)}`)
		data.innerText = `${key.replace(/^\w+_/,"")}: ${value}`
	}
}

function init() {
	// Runs once, creates adapter cards and sensor tables from the json output
	let cardContainer = document.getElementById("card-container")
	let proc = cockpit.spawn(["sensors", "-j"])
	proc.done((data) => {
		const jsonData = JSON.parse(data)
		for (const adapter of Object.entries(jsonData)) {
			// Create card from an adapter then remove adapter. Adapter key/value pair to make sensor data parsing easier
			card = createCard(adapter)
			delete adapter[1].Adapter
			// Parse sensor data and add sensors to the card
			for (const [sensorName, sensorData]  of Object.entries(adapter[1])) {
				addSensor(card, sensorName, sensorData)
			}
			cardContainer.appendChild(card)
		}
	})
}

function update() {
	// Runs every second, updates the values for the sensor tables
	let proc = cockpit.spawn(["sensors", "-j"])
	proc.done((data) => {
		const jsonData = JSON.parse(data)
		for (const adapter of Object.entries(jsonData)) {
			// Remove adapter.Adapter key/value pair to make sensor data parsing easier
			delete adapter[1].Adapter
			// Parse and update sensor data
			for (const [sensorName, sensorData]  of Object.entries(adapter[1])) {
				updateSensor(adapter, sensorName, sensorData)
			}
		}
	})
}

document.addEventListener("DOMContentLoaded", () => {
	init()
	setInterval(update, 1000)
})