let finalList=[];
var button=document.getElementById('button_pick');
var text=document.getElementById('user__name');
text.addEventListener("keyup",function(event){
    event.preventDefault();
    if(event.keyCode===13){
        trigger();
    }
})
function print(){
    var p=document.getElementById('load__text');
    if(finalList.length===0){
        p.innerHTML=`<h1>NO DATA!</h1>`;
        return;
    }
    p.innerHTML='';
    for(let i=0;i<finalList.length;i++){
        var link=finalList[i][0];
        var rating=finalList[i][1];
        if(rating===0)rating="UNRATED";
        var value=finalList[i][2];
        p.innerHTML +=`<a href=${link} target='__blank'>${value} (${rating})</a>`
    }
}

function trigger(){
    finalList.splice(0,finalList.length);
    var userName=document.getElementById('user__name').value;
    var url='https://codeforces.com/api/user.status?handle='+userName;
    var problem=document.getElementById('load__text');
    problem.innerHTML='<h1 style="color:green">LOADING<h1>';
    console.log(url)
    fetch(url).then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            problem.innerHTML=`<h1 style="color:red">Invalid Handle</h1>`
        }
    }).then((data)=>{
        console.log(data)
        var result=data;
        var currentProblem=result['result'];
        var unsolved=new Set();
        var solved=new Set();
        var map=new Map();
        var ratingMap=new Map();
        for(let i=0;i<currentProblem.length;i++){
            var contestId=currentProblem[i]['contestId'];
            var name=currentProblem[i]['problem']['name'];
            var rating=currentProblem[i]['problem']['rating'];
            var problemIndex=currentProblem[i]['problem']['index'];
            var link='https://codeforces.com/problemset/problem/'+contestId+'/'+problemIndex;
            var towrite=contestId + ' ' + name;
            map.set(towrite,link);
            ratingMap.set(towrite,rating);
            if(currentProblem[i]['verdict']!='OK'){
                unsolved.add(towrite);
            }
            else{
                solved.add(towrite);
            }
        }
        let index=0;
        unsolved.forEach(value=>{
            if(!solved.has(value)){
                var link=map.get(value);
                var rating=ratingMap.get(value);
                if(rating==undefined)rating=0;
                finalList[index]=[];
                finalList[index]=[link,rating,value];
                index++;
            }
        })
        print();
    })
}
button.addEventListener("mousedown",trigger);
document.getElementById('easy').addEventListener("mousedown",function(){
    finalList.sort(cmp1)
    print();
})
document.getElementById('hard').addEventListener("mousedown",function(){
    finalList.sort(cmp2)
    print();
})
document.getElementById('random').addEventListener("mousedown",function(){
    if(finalList.length==0){
        document.getElementById('load__text').innerHTML=`<h1>NO DATA!</h1>`
        return;
    }
    let i=getRandom(finalList.length);
    document.getElementById('load__text').innerHTML=`<a href=${finalList[i][0]} target='__blank'>${finalList[i][2]} (${finalList[i][1]})</a>`

})
function cmp1(a,b){
    return a[1]-b[1];
}
function cmp2(a,b){
    return b[1]-a[1];
}
function getRandom(size){
    return Math.floor(Math.random()*size);
}
