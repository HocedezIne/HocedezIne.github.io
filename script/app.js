// variables
let moonRise, moonSet;
const phaseExplanation =  {
	"First Quarter": {
		"rise": "at noon",
		"transit": "at sunset",
		"set": "at midnight"
	},
	"Full Moon": {
		"rise": "at sunset",
		"transit": "at midnight",
		"set": "sunrise"
	},
	"Last Quarter": {
		"rise": "at midnight",
		"transit": "at sunrise",
		"set": "at noon"
	},
	"New Moon": {
		"rise": "at sunrise",
		"transit": "at noon",
		"set": "at sunset"
	},
	"Waning Crescent": {
		"rise": "after midnight",
		"transit": "after sunrise",
		"set": "after noon"
	},
	"Waning Gibbous": {
		"rise": "after sunset",
		"transit": "after midnight",
		"set": "after sunrise"
	},
	"Waxing Crescent": {
		"rise": "before noon",
		"transit": "before sunset",
		"set": "before midnight"
	},
	"Waxing Gibbous": {
		"rise": "after noon",
		"transit": "after sunset",
		"set": "after midnight"
	}
}

// visualize data gotten form api
const showResult = queryResponse => {
	// show sun data
	// rise and set times
	document.querySelector(".js-sun-rise").innerText = queryResponse.sunRise;
	document.querySelector(".js-sun-set").innerText = queryResponse.sunSet;
	// change column size for sun
	// get rise and set times as an integer value between 0-100
	// convert the hours and minutes to minutes, divide by total minutes in a day (1440), multiple by upper limit
	const sunRise = Math.round((parseInt(queryResponse.sunRise.split(":")[0]) * 60 + parseInt(queryResponse.sunRise.split(":")[1])) / 1440 * 100);
	const sunSet = Math.round((parseInt(queryResponse.sunSet.split(":")[0]) * 60 + parseInt(queryResponse.sunSet.split(":")[1])) / 1440 * 100);
	document.querySelector(".js-timeline-sun").style.gridColumn = `${sunRise} / span ${sunSet - sunRise}`;

	// show moon data
	document.querySelector(".js-illumination").innerText = Math.round(queryResponse.moonIllumination*100);
	// the stucture is build up differently depending on the current moon phase
	switch(queryResponse.moonPhase){
		case "Waning Crescent":
			// the api returns Last Quarter as Waning Crescent with a moonRise value of null
			// first build up general elements before adding the specific parts for each moon phase

			// add the extra html to visualize the timeline
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;

			// set moonSet
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

			// moon phase specifics
			if (queryResponse.moonRise == null){
				// the actual moonphase is Last Quarter
				// add phase data
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#LastQuarter"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "Last Quarter";
				var phaseExplanationData = phaseExplanation["Last Quarter"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

				// set rise time and moonRise
				document.querySelector(".js-moon-rise").innerText = "00:00";
				moonRise = 1;
			} else {
				// moonphase is Waning Crescent
				// add phase data
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
				var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

				// set rise time and moonRise
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			}

			// change column size for moon
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			break;
		case "Waning Gibbous":
			// the api returns Full Moon as Waning Gibbous, no values are null
			// add extra html to visualize the timeline
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon__set"><time class="c-timeline__time js-moon-set">__:__</time></div><div class="c-timeline__line js-timeline-moon__rise"><time class="c-timeline__time js-moon-rise">__:__</time></div>`;

			// rise and set times
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			//change column size for moon
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);
			document.querySelector(".js-timeline-moon__set").style.gridColumn = `1 / span ${moonSet}`;
			document.querySelector(".js-timeline-moon__rise").style.gridColumn = `${moonRise} / -1`;
			document.querySelector(".js-timeline-moon__set").style.justifyContent = "flex-end";

			// moon phase specifics
			if (queryResponse.moonIllumination >= 0.99) {
				// the actual moon phase is full moon
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#FullMoon"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "Full Moon";
				var phaseExplanationData = phaseExplanation["Full Moon"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			} else {
				// add phase data
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
				var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			}
			break;
		case "Waxing Crescent":
			// the api returns New Moon as Waxing Crescent with a moonUnder value of null
			// add the extra html to visualize the timeline
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;

			// set rise and set times
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			// change column size for moon
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;

			// moon phase specifics
			if(queryResponse.moonUnder == null){
				// the actual moon phase is new moon
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#NewMoon"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "New Moon";
				var phaseExplanationData = phaseExplanation["New Moon"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			} else {
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
				var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			}
			break;
		case "Waxing Gibbous":
			// the api returns First Quarter as Waxing Gibbous with a moonSet value of null
			if(queryResponse.moonSet == null){
				// the actual moon phase is first quarter
				// add phase data
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#FirstQuarter"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "First Quarter";
				var phaseExplanationData = phaseExplanation["First Quarter"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

				// add extra html
				document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;

				//set set time and moonSet
				document.querySelector(".js-moon-set").innerText = "23:59";
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
				moonSet = Math.round((parseInt("23") * 60 + parseInt("59")) / 1440 * 100);
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);

				// change column size for moon
				document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			} else {
				// add phase data
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
				var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

				// add extra html
				document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon__set"><time class="c-timeline__time js-moon-set">__:__</time></div><div class="c-timeline__line js-timeline-moon__rise"><time class="c-timeline__time js-moon-rise">__:__</time></div>`;

				// set set time and moonSet
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
				document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
				moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

				// change column size for moon
				document.querySelector(".js-timeline-moon__set").style.gridColumn = `1 / span ${moonSet}`;
				document.querySelector(".js-timeline-moon__set").style.justifyContent = "flex-end";
				document.querySelector(".js-timeline-moon__rise").style.gridColumn = `${moonRise} / -1`;
			}
			break;
		default:
			// add phase data
			document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
			document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
			var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
			document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
			document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
			document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

			// add extra html
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;
			
			// set times
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;
			
			// change column size for moon
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			break;
	}
}

// get data form api
// position is provided form getLocation
const getAPI = async (position) => {
	// variables
	// lat and long in decimal degree format north and east positive, south and west negative
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	const now = new Date();
	// the api expects yyyymmdd as date format
	const date = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, "0")}${(now.getMonth()+1).toString().padStart(2, "0")}`;
	// getTimezoneOffset returns the offset in minutes, api expects and integer representing hours
	const timezoneOffset = Math.round((now.getTimezoneOffset() * -1) / 60);

	// builing the url
	// parameters need to be comma separated values
	const url = `https://api.solunar.org/solunar/${lat},${lon},${date},${timezoneOffset}`;

	// get data
	const data = await fetch(url) .then((r) => r.json()) .catch((err) => console.error(`An error occured: ${err}`));
	showResult(data);
}

// get the currenct location of the user and call getAPI function
const getLocation = function(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getAPI);
	}
}

// switch themes
const switchTheme = function(){
	// get elements
	const btn = document.querySelector(".js-theme-toggle");
	const html = document.getElementsByTagName("html")[0];
	currentTheme = html.className;

	// change current theme + text in button
	if(currentTheme == "dark-theme"){
		btn.innerText = "light";
		html.classList.remove("dark-theme");
		html.classList.add("light-theme");
	} else {
		btn.innerText = "dark";
		html.classList.remove("light-theme");
		html.classList.add("dark-theme");
	}
}

const init = function(){
	console.log("Script loaded!");

	// add event listener to detect theme switch
	document.querySelector(".js-theme-toggle").addEventListener("click", switchTheme);

	getLocation();
}

// event listener DOMContentLoaded
document.addEventListener("DOMContentLoaded", init);