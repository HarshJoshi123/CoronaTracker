import React, { Component } from 'react'
import { Circle,FeatureGroup,LayersControl,Map, CircleMarker, TileLayer,Tooltip,Marker,Popup,GeoJSON } from "react-leaflet";
import worldGeoJSON from 'geojson-world-map';
import "leaflet/dist/leaflet.css";
import data from "./cities"
import _ from 'lodash'
class App extends Component{
constructor(){
super();
  
this.state={
countries:'',
modcountries:''
};
}
async componentDidMount(){

const response= await fetch("https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "53009286a0mshdc8ec356f7aa205p1e0e80jsn5858f548ed53"
    }
})

const result=await response.json()
this.setState({countries:result.countries_stat})
const {countries} =this.state
await data.map((v,i)=>{

 _.extend(v,countries.find(x=> x.country_name === v.country_name ))


})
 const myarray= await data.filter(function(x){return x.cases  })
for(var i in myarray){
  if(myarray[i].cases.includes(",")){
  var cased=myarray[i].cases.split(",");
  //myarray[i].cases=cased[0] + cased[1]
myarray[i].cases=cased.reduce(function(a,b){
    return a+b;
   });
}
  if(myarray[i].active_cases.includes(",")){
  var activecase=myarray[i].active_cases.split(",");
  //myarray[i].active_cases=activecase[0] + activecase[1]
   myarray[i].active_cases=activecase.reduce(function(a,b){
    return a+b;
   });
}
  if(myarray[i].deaths.includes(",")){
var death=myarray[i].deaths.split(",");
  //myarray[i].death=death[0] + death[1]
  myarray[i].deaths=death.reduce(function(a,b){
    return a+b;
   });
   }
}

this.setState({modcountries:myarray})



//this.setState({modcountries:data})



}

  render() {
 

const {modcountries}=this.state
console.log(worldGeoJSON)    
    return (
   
      

      <Map center={[20, 27.505]} style={{ height: "630px", margin:"auto",width: "100%" }}
          zoom={2}  >
               <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
 

{modcountries ? 
 modcountries.map((country,i)=>{
     
  return(

<CircleMarker fillOpacity={0.4} key={i}
   color="red"  radius={8 * Math.log(country.active_cases / 6000)} center={country.latlng} >
 <Tooltip  direction="right" offset={[-8, -2]} opacity={0.9}>
    <span>{`${country.country_name} ${country.cases} Total cases`}</span> <br/>
    <span> {country.active_cases} Active cases </span> <br/> 
    <span> {country.deaths} Deaths</span> 
  </Tooltip>
 </CircleMarker>   

  ) 

 })
: console.log("nhi print ")
}

<GeoJSON
          data={worldGeoJSON}
          style={() => ({
            color: '#4a83ec',
            weight: 0.3,
            fillColor: "#1a1d62",
            fillOpacity: 0.8,
          })}
        />

 </Map>


    )

  }
}
export default App;