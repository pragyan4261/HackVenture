
var crime=[[3,1],[1,4],[2,3],[5,1],[6,2],[7,1],[0,4]];
var s=0;
var result="green";
for(var i=0;i<crime.length;i++){
    s+=crime[i][0]*crime[i][1];
}
var weekly=s/7;
if(s>=0 && s<=8){
    result="green";
}
else if(s>8 && s<=16){
    result="yellow";
}
else{
    result="red";
}
document.getElementById("d").style.backgroundColor=String(result);
var conc=["You are totally safe to go!!","This place is mildly dangerous!!","This place is very dangerous to visit!!"];
if(result=="red"){
    document.getElementById("desc").innerHTML=conc[2];
}
else if(result=="yellow"){
    document.getElementById("desc").innerHTML=conc[1];
}
else if(result=="green"){
    document.getElementById("desc").innerHTML=conc[0];
}