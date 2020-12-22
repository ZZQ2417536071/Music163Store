/*根据id获取到相对应的元素*/
function my$(id){
	return document.getElementById(id);
}

/*用于在标签中添加内容的方法*/
function setInnerText(element,text){
	if(typeof element.textContent=="undefined"){
		element.innerText = text;
	}else{
		element.textContent = text;
	}
}
