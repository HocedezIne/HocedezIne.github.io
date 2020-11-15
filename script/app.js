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
    const imgFileName = "Moonlet_" + queryResponse.moonPhase.replace(" ", "") + ".svg";
    document.querySelector(".js-moonContainer").innerHTML = `<img class="c-moonphase__svg" src="img/svg/${imgFileName}" alt="Visual for ${queryResponse.moonPhase}">`;
    document.querySelector(".js-moonPhase").innerText = queryResponse.moonPhase;
    document.querySelector(".js-illumination").innerText = Math.round(queryResponse.moonIllumination*100);
    document.querySelector(".js-moonrise").innerText = queryResponse.moonRise;
    document.querySelector(".js-moonset").innerText = queryResponse.moonSet;
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