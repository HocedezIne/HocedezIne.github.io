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

const switchTheme = () => {
    var btn = document.querySelector(".js-theme-toggle");
    var html = document.getElementsByTagName("html")[0];
    currentTheme = html.className;
    
    if (currentTheme == "dark-theme"){
        btn.innerText = "light";
        html.classList.remove("dark-theme");
        html.classList.add("light-theme");
    } else {
        btn.innerText = "dark";
        html.classList.remove("light-theme");
        html.classList.add("dark-theme");
    }
}

const showResult = queryResponse => {
    console.log(queryResponse);

    document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#${queryResponse.moonPhase.replace(" ", "")}"></use></svg>`;
    document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
	document.querySelector(".js-illumination").innerText = Math.round(queryResponse.moonIllumination*100);
	var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
    document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
    document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
    document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

	document.querySelector(".js-sun-rise").innerText = queryResponse.sunRise;
	document.querySelector(".js-sun-set").innerText = queryResponse.sunSet;
	// grid span sun
	const sunRise = Math.round((parseInt(queryResponse.sunRise.split(":")[0]) * 60 + parseInt(queryResponse.sunRise.split(":")[1])) / 1440 * 100);
	const sunSet = Math.round((parseInt(queryResponse.sunSet.split(":")[0]) * 60 + parseInt(queryResponse.sunSet.split(":")[1])) / 1440 * 100);
	const sunSpan = sunSet - sunRise;
	document.querySelector(".js-timeline-sun").style.gridColumn = `${sunRise} / span ${sunSpan}`;

	// grid span moon
	let moonRise, moonSet;
	switch(queryResponse.moonPhase){
		case "Waning Crescent":
			// add extra html
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;

			// set time elements
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			// calculate data
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

			if (queryResponse.moonRise == null) {
				// the actual moon phase is last quarter
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#LastQuarter"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "Last Quarter";
				var phaseExplanationData = phaseExplanation["Last Quarter"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
				
				// set time elements
				document.querySelector(".js-moon-rise").innerText = "00:00";
			
				// calculate data
				moonRise = 1;
			} else {
				// set time elements
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;

				// calculate data
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			}
			// edit timeline
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			break;
		case "Waning Gibbous":
			// add extra html
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon__set"><time class="c-timeline__time js-moon-set">__:__</time></div><div class="c-timeline__line js-timeline-moon__rise"><time class="c-timeline__time js-moon-rise">__:__</time></div>`;

			// set time elements
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			// calculate data
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

			// edit timeline + add extra style rule
			document.querySelector(".js-timeline-moon__set").style.gridColumn = `1 / span ${moonSet}`;
			document.querySelector(".js-timeline-moon__set").style.justifyContent = "flex-end";
			document.querySelector(".js-timeline-moon__rise").style.gridColumn = `${moonRise} / -1`;

			if (queryResponse.moonIllumination >= 0.99) {
				// the actual moon phase is full moon
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#FullMoon"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "Full Moon";
				var phaseExplanationData = phaseExplanation["Full Moon"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			}
			break;
		case "Waxing Crescent":
			// add extra html
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;
			
			// set time elements
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			// calculate data
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

			// edit timeline
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;

			if(queryResponse.moonUnder == null){
				// the actual moon phase is new moon
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#NewMoon"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "New Moon";
				var phaseExplanationData = phaseExplanation["New Moon"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
			}
			break;
		case "Waxing Gibbous":
			if (queryResponse.moonSet == null){
				// the actual moon phase is first quarter
				document.querySelector(".js-moonContainer").innerHTML = `<svg class="c-moonphase__icon"><use xlink:href="#FirstQuarter"></use></svg>`;
				document.querySelector(".js-moonPhase").innerText = "First Quarter";
				var phaseExplanationData = phaseExplanation["First Quarter"];
				document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
				document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
				document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;

				// add extra html
				document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;
				
				// set time elements
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
				document.querySelector(".js-moon-set").innerText = "23:59"

				// calculate data
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
				moonSet = Math.round((parseInt("23") * 60 + parseInt("59")) / 1440 * 100);

				//edit timeline
				document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			} else {
				// add extra html
				document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon__set"><time class="c-timeline__time js-moon-set">__:__</time></div><div class="c-timeline__line js-timeline-moon__rise"><time class="c-timeline__time js-moon-rise">__:__</time></div>`;

				// set time elements
				document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
				document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

				// calculate data
				moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
				moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

				// edit timeline + add extra style rule
				document.querySelector(".js-timeline-moon__set").style.gridColumn = `1 / span ${moonSet}`;
				document.querySelector(".js-timeline-moon__set").style.justifyContent = "flex-end";
				document.querySelector(".js-timeline-moon__rise").style.gridColumn = `${moonRise} / -1`;
			}
			break;
		default:
			// add extra html
			document.querySelector(".js-moon").innerHTML = `<div class="c-timeline__line js-timeline-moon"><time class="c-timeline__time js-moon-rise">__:__</time><time class="c-timeline__time js-moon-set">__:__</time></div>`;
			
			// set time elements
			document.querySelector(".js-moon-rise").innerText = queryResponse.moonRise;
			document.querySelector(".js-moon-set").innerText = queryResponse.moonSet;

			// calculate data
			moonRise = Math.round((parseInt(queryResponse.moonRise.split(":")[0]) * 60 + parseInt(queryResponse.moonRise.split(":")[1])) / 1440 * 100);
			moonSet = Math.round((parseInt(queryResponse.moonSet.split(":")[0]) * 60 + parseInt(queryResponse.moonSet.split(":")[1])) / 1440 * 100);

			// edit timeline
			document.querySelector(".js-timeline-moon").style.gridColumn = `${moonRise} / ${moonSet}`;
			break;
	}
}

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getAPI);
    }
}

const getAPI = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const now = new Date();
    const date = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,"0")}${now.getDate().toString().padStart(2,"0")}`;
    const timezoneOffset = now.getTimezoneOffset()*-1/60;
    
    const url = `https://api.solunar.org/solunar/${lat},${lon},${date},${timezoneOffset}`

    const data = await fetch(url)
					.then((r) => r.json())
                    .catch((err) => console.error(`An error occured: ${err}`));
    
    showResult(data);
}

document.addEventListener("DOMContentLoaded", function(){
    console.log("Script loaded!");
    document.querySelector(".js-theme-toggle").addEventListener("click", switchTheme);
    getLocation();
});