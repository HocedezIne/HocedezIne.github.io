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

    const imgFileName = "Moonlet_" + queryResponse.moonPhase.replace(" ", "") + ".svg";
    document.querySelector(".js-moonContainer").innerHTML = `<img class="c-moonphase__svg" src="img/svg/${imgFileName}" alt="Visual for ${queryResponse.moonPhase}">`;
    
    document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
    document.querySelector(".js-illumination").innerText = Math.round(queryResponse.moonIllumination*100);

    // document.querySelector(".js-moonrise").innerText = queryResponse.moonRise;
    // document.querySelector(".js-moonset").innerText = queryResponse.moonSet;

    var phaseExplanationData = phaseExplanation[`${queryResponse.moonPhase}`];
    document.querySelector(".js-rise-comparison").innerText = phaseExplanationData.rise;
    document.querySelector(".js-transit-comparison").innerText = phaseExplanationData.transit;
    document.querySelector(".js-set-comparison").innerText = phaseExplanationData.set;
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
    console.log("Script found!");
    document.querySelector(".js-theme-toggle").addEventListener("click", switchTheme);
    getLocation();
});