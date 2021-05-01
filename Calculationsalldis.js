
const county = "County";
const state = "State";
const haz = "Hazard_type";
const fips = "FIPS_code";
const lon = "Longitude";
const lan = "Latitude";
const prop = "Property_Damage";
const crop = "Crop_Damage";

disdat = dis.data;
disdat.forEach(element => {
    element[haz] = element[haz].split("-");
    var i;
    for (i = 0; i < element[haz].length; i++) {
        element[haz][i] = element[haz][i].trim();
    }
});

var countis = [];
var data=fetchJSON('./tx_counties.json')
  .then(function(data) { 
  // do what you want to do with `data` here...
  data.features.forEach(function(feature) {
      //console.log(feature);
      countis.push(feature);
    
  });
  console.log("county",countis); 
});
// var fs = require('fs')
// fs.writeFile('CounT.json', countis, function(err){
//     if(err){        
//         console.log(err);
//     }
// });  

var firsttime=true;

// function Calljs(){
//     return countis;
// }

function Run(flag){
    var qhaz = [];
    //var qarea = "TX";
    var qdamage =[];
    //Run1();
    //qdamage
    if (document.getElementById('PropertyDmg').checked) {
        
        qdamage.push(document.getElementById('PropertyDmg').value)
    }
    if (document.getElementById('CropDmg').checked) {
        
        qdamage.push(document.getElementById('CropDmg').value)
    }
    console.log("qdmg",qdamage); 
    //qarea
    var qarea = document.getElementById("Names").value;
    console.log("qarea",qarea);
    //QHAZ
    if (document.getElementById('haz1').checked) {
        
        qhaz.push(document.getElementById('haz1').value)
    }
    if (document.getElementById('haz2').checked) {
        
        qhaz.push(document.getElementById('haz2').value)
    }
    if (document.getElementById('haz3').checked) {
        
        qhaz.push(document.getElementById('haz3').value)
    }
    if (document.getElementById('haz4').checked) {
        
        qhaz.push(document.getElementById('haz4').value)
    }
    if (document.getElementById('haz5').checked) {
        
        qhaz.push(document.getElementById('haz5').value)
    }
    if (document.getElementById('haz6').checked) {
        
        qhaz.push(document.getElementById('haz6').value)
    }
    if (document.getElementById('haz7').checked) {
        
        qhaz.push(document.getElementById('haz7').value)
    }
    if (document.getElementById('haz8').checked) {
        
        qhaz.push(document.getElementById('haz8').value)
    }
    if (document.getElementById('haz9').checked) {
        
        qhaz.push(document.getElementById('haz9').value)
    }
    if (document.getElementById('haz10').checked) {
        
        qhaz.push(document.getElementById('haz10').value)
    }
    if (document.getElementById('haz11').checked) {
        
        qhaz.push(document.getElementById('haz11').value)
    }
    if (document.getElementById('haz12').checked) {
        
        qhaz.push(document.getElementById('haz12').value)
    }
    //initializing json data
    
    //document.queryselector('#id').value - Dynamic form entry.
    
    //parameters for hazard type, damage type and Area. Change to dynamic entry.
    //var qhaz = ["Tornado","Wind"];
    //var qarea = "Anderson";
    

    // if (document.getElementById('Names').checked) {
    //     qarea = document.getElementById('Names').value;
    //     console.log(document.getElementById('Names').value)
    //   }
    //Split hazard type
    console.log("qhaz",qhaz);
    console.log("disdat",disdat);
    //filter the whole dataset    
    var filt = filterhaz(disdat, qhaz);
    console.log("filt",filt);
    var filt = filterarea(filt, qarea);
    console.log("filt1",filt);
    var filt = filterdmg(filt, qdamage);
    console.log("filt2",filt);
    

    //getting aggregate and unique values in one array
    var uniq = aggregate(filt);
    console.log("uniq",uniq);
    //var freq = mostFrequent(filt);
    //has more tags - gotta delete hazards
    var uniq = removeunwan(uniq,qhaz);
    console.log("uniqafterremov",uniq);
    
    var uniq1 = removeNaN(uniq);
    console.log("uniq1",uniq1);

    var uniq2 = graph(uniq1);
    
    var mostdamage = mostdmg(uniq1);
    console.log("mostdmg",mostdamage);

    var mostfreq = freqdis(filt,uniq1);
    console.log("mostfrequent",mostfreq);

    var count = count1(filt);
    console.log("count",count);

    var count = removeNaN(count);
    console.log("count",count);

    if(flag=='q'){
      UpdateCountis(count);
      //firsttime = false;
      return countis;
    }

    if(flag=='g'){
        return uniq2;
    }
    if(flag=='f'){
        return mostfreq;
    }
    if(flag=='d'){
        return mostdamage["hazard"];
    }
    if(flag=='s'){
        return filt;
    }
}

function filterhaz(disdat,qhaz){//filter according to chosen hazard type
    ans = []
    for (i = 0; i < disdat.length; i++) {
        for (j = 0; j < disdat[i][haz].length; j++) {
            if (qhaz.includes(disdat[i][haz][j]) === true)
                {
                ans.push(disdat[i])
                break
            }

            }
    }
    return ans;
    } 

function filterarea(disdat, qarea) {//filter according to chosen hazard area
    console.log("area")
    ans = []
    for (i = 0; i < disdat.length; i++) {
        if (disdat[i][state] === qarea || disdat[i][county] === qarea) {
            ans.push(disdat[i])

        }   
    }
return ans;
} 

function filterdmg(disdat, qdmg) {
    if (qdmg.length !=2){
    for (i = 0; i < disdat.length; i++) {
        if (qdmg[i] === "Propertydmg") {
            delete disdat[i][crop];
        }
        else if (qdmg[i] === "Cropdmg") {
            delete disdat[i][prop];
        }
    }
}
    return disdat;
} 


function freqdis(disdat,uniq1){//output the most frequent disaster
    var count = 0; //count 
    var compare = 0;  //compare using stored value
    var mostFrequent;  //store most frequent item

    for (i = 0; i < uniq1.length; i++) {
        
        for (j = 0; j < disdat.length; j++) {
            if (disdat[j][haz].includes(uniq1[i]["hazard"]) === true)
                {
                    count=count+1;
                }           
            
        }
        if (compare<count){
            compare = count;
            mostFrequent = uniq1[i]["hazard"];
        }
           
    }
    return mostFrequent;
}

function aggregate(disdat){//sum values per unique tag in hazard type
    //return the final array
   
    const removeDuplicates = (key, index, array) => {
        return array.lastIndexOf(key) === index;
    };
    
    const distinctHazards = disdat.map(row => row.Hazard_type).flat().filter(removeDuplicates);
    
    const scores = distinctHazards.map(hazard => {
        const damages = disdat.filter(row => {
            return row.Hazard_type.includes(hazard);
        });
        
        return {hazard, Total_Crop_Damage: damages.map(row => row.Crop_Damage).reduce((a,b) => {
            return Number(a) + Number(b);
        }),Total_Property_Damage: damages.map(row => row.Property_Damage).reduce((a,b) => {
            return Number(a) + Number(b);
        })
    };
        
    });
    return scores;
}


function removeNaN(disdat) {
            
    for (i = 0; i < disdat.length; i++) {
        
        
        if (Number.isNaN(disdat[i]["Total_Property_Damage"])||disdat[i]["Total_Property_Damage"]===undefined) {
            disdat[i]["Total_Damage"]=disdat[i]["Total_Crop_Damage"];
            delete disdat[i]["Total_Property_Damage"];
        }
        else if (Number.isNaN(disdat[i]["Total_Crop_Damage"])||disdat[i]["Total_Crop_Damage"]===undefined) {
            disdat[i]["Total_Damage"]=disdat[i]["Total_Property_Damage"];
            delete disdat[i]["Total_Crop_Damage"];
        }
        else{
            disdat[i]["Total_Damage"]=disdat[i]["Total_Crop_Damage"]+disdat[i]["Total_Property_Damage"];
        }
    }
    return disdat;
} 


function mostdmg(disdat){
    var max = {
        hazard: "Placeholder",
        Damage: 0,
    };
    for (i = 0; i < disdat.length; i++) {

        if(disdat[i].Total_Damage>max.Damage){
            max.Damage=disdat[i].Total_Damage;
            max.hazard=disdat[i].hazard;
        }
    }
    return max;
}

function removeunwan(disdat,qhaz){//filter according to chosen hazard type
    ans = []
    for (i = 0; i < disdat.length; i++) {
        for (j=0; j<qhaz.length; j++){
            if (qhaz[j].includes(disdat[i]["hazard"]) === true)
                {
                ans.push(disdat[i])
                break
            }
        }    
    }
    return ans;
} 

function graph(data){
    ans = [['Disasters', 'Total Property Damage', 'Total Crop Damage']];
    for(i=0;i<data.length;i++){
        ans.push([data[i]['hazard'],data[i]['Total_Property_Damage'],data[i]['Total_Crop_Damage']])
    }
    return ans;

}

function count1(disdat){
    const removeDuplicates = (key, index, array) => {
        return array.lastIndexOf(key) === index;
    };
    
    const distinctCounties = disdat.map(row => row.County).flat().filter(removeDuplicates);
    
    const scores = distinctCounties.map(name => {
        const damages = disdat.filter(row => {
            return row.County.includes(name);
        });
        
        return {name, Total_Crop_Damage: damages.map(row => row.Crop_Damage).reduce((a,b) => {
            return Number(a) + Number(b);
        }),Total_Property_Damage: damages.map(row => row.Property_Damage).reduce((a,b) => {
            return Number(a) + Number(b);
        })
    };
});
return scores;
}

function UpdateCountis(count){
  for (i = 0; i < countis.length; i++) {
    for (j=0; j<count.length; j++){
        //console.log(countis[i].properties.name.trim());
        //console.log(count[j].name.trim());
        if (count[j].name.trim().includes(countis[i].properties.name.trim()) === true)
            {
            countis[i].properties.totdmg=count[j]["Total_Damage"];
            break;
        }
    }    
  }
  console.log("countis",countis);
  downloadObjectAsJson(countis,"countylevel")
}

async function fetchJSON(url) {
  const response = await fetch(url);
  return await response.json();
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
