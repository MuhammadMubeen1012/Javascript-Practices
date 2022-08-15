// making the code reusable where we can call in whole project to delay any call to the network. 
const deBounce = (callBack,delay)=>{
    let setTimeOutID; 
    return (...args) =>{
        if(setTimeOutID){
            clearTimeout(setTimeOutID)
        }
        setTimeOutID = setTimeout(() => {callBack.apply(null,args)} ,delay)    
    }
}
