/*
scores:

europe: 2500 is 0 -> score = (2500-d)*4
south america: 5000 is 0 -> score = (5000-d)*2
world: 10000 is 0 -> score = 10000-d

*/


function gh(n) {
  const b = `
    <div id="pano" style="height: 100%; width:100%"></div>
    
    <div id="minimap" style="height: 500px; width: 500px; z-index: 999; overflow: visible;"></div>
    <button class="retro-button" id="newgame" role="button" onclick="restart()" style="top:10px; position: absolute; height:100px; width: 500px; z-index:999; visibility: hidden;">TEXT</button>
    <form id="form1" style="visibility: hidden; position: absolute; top: 115px; z-index: 999">
        <select width=300 style="width: 350px position: absolute">
            <option value='c100k'>Map: Cities (over 100k pop)</option>
	    <option value="c1m">Map: Cities (over 1m pop)</option>
            <option value='whgt'>Map: Weighted !WIP!</option>
            <option value='eur'>Map: Europe</option>
            <option value='sam'>Map: South America</option>
	    <option value='def'>True Random</option>
            <option value='${VV}' selected>
              Continue on same map 
              </option>
        </select>
    </form>
`
  const s = `
    let currentMarker = null;
    let cl = null
    let clon = null
    var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("minimap"), {
      zoom: 2,
      center: { lat:0, lng: 0 },
    });
    
    map.addListener("click", (e) => {
      placeMarker(e.latLng, map);
      console.log(e.latLng)
    });
}


const selectElement = document.querySelector('#form1 select');
selectElement.addEventListener('change', function() {
  VV=this.value;
});



function restart(){
let url = window.location.href;    
if (url.indexOf('?') > -1){
   url=url;
   if(url.includes('?r=t') || url.includes('&r=t')){
    url=url;
}else{
    url+='&r=t';
}
} else {
   url += '?r=t'
}
if(!url.includes('&m=') && !url.includes('?m=')){
//const selectElement = document.querySelector('#form1 select');
//v = selectElement.value;
url+="&m="+VV;
}

if(url.includes('&m=') || url.includes('?m=')){
let u = new URL(url);
let p = u.searchParams;
p.set('m', VV);
url=u.toString();
}

window.location.href = url;
}


function placeMarker(position, map) {
    if (currentMarker) {
      currentMarker.setMap(null);
    }
    currentMarker = new google.maps.Marker({
      position: position,
      map: map
    });
    cl = position.lat();
    clon = position.lng();
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

    
    function getDistance(){
	let lat1 = cl;
	let lon1 = clon;
	let lat2 = ${n[0]};
	let lon2 = ${n[1]};
//        return(Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371)
  const R = 6371.0;
  
  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);
  
  // Differences in coordinates
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  
  // Haversine formula
  const a = Math.sin(dLat / 2) ** 2 + 
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function drawnewLine(map){
var line = new google.maps.Polyline({
    path: [new google.maps.LatLng(cl, clon), new google.maps.LatLng(${n[0]}, ${n[1]})],
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
    geodesic: true,
    map: map
});
}
    function placeRealMarker(map){
    console.log('placing marker')
    const m = new google.maps.Marker({
        position:{
            lat: ${n[0]},
            lng: ${n[1]}
        },
        icon:{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        },
        map: map
    })
    drawnewLine(map);
    let d = getDistance();
    let s=0;
    if(VV=='eur'){
     s = (2500-d)*4
    }
    if(VV=='sam'){
     s = (5000-d)*2
    }else{
     s=10000-d
    }
    s=s.toFixed(0);

    let avgS, tG;
    let c = localStorage.getItem(VV);
    if(c!=undefined && c!=null){
      avgS = parseInt(c.split(',')[0]);
      tG = parseInt(c.split(',')[1]);

      let ts = avgS*tG;
      localStorage.setItem(VV, ((ts+s)/(avgS+1)).toString()+(tG+1).toString());
    }else{
     localStorage.setItem(VV, s.toString()+",1");
    }
    


    document.getElementById("newgame").innerText = "Distance: "+(d.toFixed(3)).toString()+"km. Click to restart.";
    document.getElementById("newgame").style.visibility = "visible";
    document.getElementById('form1').style.visibility='visible';
console.log(d);
}

document.onkeydown = function(e){
    e = e || window.event;
    console.log(e)
    if(e.key=='Enter'){
        placeRealMarker(map)
    }




//    console.log("Latitude: " + position.lat());
 //   console.log("Longitude: " + position.lng());
}
    function initialize() {
    initMap();
    const fenway = { lat: ${n[0]}, lng: ${n[1]} };
    
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
        showRoadLabels: false
      },
    );
    //map.setStreetView(panorama);
    }
    window.initialize = initialize;
    document.getElementById("pano").style.position = 'static';

`
  const s2 = `<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTV65aJcXZ5xbeCq6DGtYIwBbQwFhRSOQ&callback=initialize&v=weekly"
    defer></script>`;

  return [b, s, s2]
}

window.gh = gh;
