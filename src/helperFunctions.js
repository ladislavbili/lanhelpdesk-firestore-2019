import React from 'react';

export const testing = false;

export const toSelArr = (arr,index = 'title')=> arr.map((item)=>{return {...item,value:item.id,label:item[index]}})
export const isEmail = (email) => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)
export const snapshotToArray = (snapshot) => {
  if(snapshot.empty){
    return [];
  }
  return snapshot.docs.map((item)=>{
    return {id:item.id,...item.data()};
  })
}

export const timestampToString = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}

export const hightlightText = (message,text, color)=>{
  let index = message.toLowerCase().indexOf(text.toLowerCase());
  if (index===-1){
    return (<span>{message}</span>);
  }
  return (<span>{message.substring(0,index)}<span style={{color}}>{message.substring(index,index+text.length)}</span>{message.substring(index+text.length,message.length)}</span>);
}


export const calculateTextAreaHeight = (e) => {
  const firstHeight = 29;
  const expansionHeight = 21;
  return Math.floor((e.target.scrollHeight-firstHeight)/expansionHeight)*expansionHeight + firstHeight;
}

export const getAttributeDefaultValue = (item) => {
  switch (item.type.id) {
    case 'input':
      return '';
    case 'textarea':
      return '';
    case 'select':
      return item.options.length>0?item.options[0]:null;
    default:
      return '';
  }
}

export const htmlFixNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g,'<br>');
}

export const getItemDisplayValue= (item,value) => {
  if(!item[value.value]){
    return 'Neexistuje';
  }
  if(value.type==='object'){
    if (value.value === "status"){
      return <span className="label label-info" style={{backgroundColor: item[value.value] ? item[value.value].color : "white"}}>{item[value.value] ? item[value.value].title : "No status"}</span>
    }
    return item[value.value].title;
  }else if(value.type==='text'){
    return item[value.value];
  }else if(value.type==='custom'){
    return value.func(item);
  }else if(value.type==='url'){
    return <a onClick={(e)=>e.stopPropagation()} href={item[value.value]} target="_blank" without rel="noopener noreferrer">{item[value.value]?item[value.value]:''}</a>;
  }else if(value.type==='int'){
    return parseInt(item[value.value]);
  }else if(value.type==='list'){
    return value.func(item[value.value]);
  }else if(value.type==='date'){
    return timestampToString(item[value.value]);
  }else if(value.type==='user'){
    return item[value.value].name+' '+item[value.value].surname;
  }else{
    return 'Error'
  }
}

export const arraySelectToString = (arr) => {
  return arr.map(a => " " + a).toString();
}

export const toMillisec = (number, time) => {
  switch (time) {
    case 'seconds':
      return number*1000;
    case 'minutes':
      return number*60*1000;
    case 'hours':
      return number*60*60*1000;
    case 'days':
      return number*24*60*60*1000;
    default:
      return number;
  }
}

export const fromMillisec = (number, time) => {
  switch (time) {
    case 'seconds':
      return +(number/1000).toFixed(2);
    case 'minutes':
      return +(number/60/1000).toFixed(2);
    case 'hours':
      return +(number/60/60/1000).toFixed(2);
    case 'days':
      return +(number/24/60/60/1000).toFixed(2);
    default:
      return number;
  }
}

export const toCentralTime = (time) => {
  let date = new Date(time);
  let userTimezoneOffset = date.getTimezoneOffset() * 60*1000;
  return (new Date(date.getTime() + userTimezoneOffset)).getTime();
}

export const fromCentralTime = (time)=>{
  let date = new Date(time);
  let userTimezoneOffset = date.getTimezoneOffset() * 60*1000;
  return (new Date(date.getTime() - userTimezoneOffset)).getTime();
}

export const sameStringForms = (item1,item2)=>{
  return JSON.stringify(item1)===JSON.stringify(item2)
}

export const timestampToInput = (timestamp)=>{
  return timestamp!==null && timestamp!=='' && timestamp!==undefined ?new Date(timestamp).toISOString().replace('Z',''):''
}

export const inputToTimestamp = (input)=>{
  return isNaN(new Date(input).getTime())|| input === '' ? '' : (new Date(input).getTime())
}
