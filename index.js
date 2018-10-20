
const https = require('https');

let start = () => {
  getHeirarchy().then((heirarchy)=> {
    let stdin = process.openStdin();
    stdin.addListener("data", (input)=> {
      let formattedInput = input.toString().trim();
      let views = searchHeirarchy(heirarchy, parseInput(formattedInput));
      console.log(JSON.stringify(views));
    });
  });
}

let searchHeirarchy = (heirarchy, selectors=[]) => {
    let views = [];
    if(selectors.length == 0){ return views; }

    let {type, value} = selectors[0];
    let field = heirarchy[type];
    let lastSelector = selectors.length == 1;

    let idOrClassMatch = field && (type == 'identifier' || type == 'class') && field == value;
    let classNamesMatch = field && (type == 'classNames' && field.indexOf(value) > -1);

    if(idOrClassMatch || classNamesMatch){
      !lastSelector &&  selectors.shift();
      lastSelector && views.push(heirarchy);
    }

    if(heirarchy.subviews){
      heirarchy.subviews.forEach((subview)=> {
        views = views.concat(searchHeirarchy(subview, selectors));
      });
    }
    if(heirarchy.control){
      views = views.concat(searchHeirarchy(heirarchy.control, selectors));
    }
    if(heirarchy.contentView){
      views = views.concat(searchHeirarchy(heirarchy.contentView, selectors));
    }
    return views;
}

let parseInput = (input) => {

  let selectors = [];
  for(let i = 0; i < input.length; i++){
    let char = input[i];
    if(char == '.'){
      selectors.push({type: 'classNames', value: ''});
    }else if(char == '#'){
      selectors.push({type: 'identifier', value: ''});
    }else if(i == 0 || input[i-1] == ' ') {
      selectors.push({type: 'class', value: char});
    }else if(char != ' '){
      selectors[selectors.length-1].value += char;
      continue;
    }
  }

  return selectors;
}

let getHeirarchy = () => {
  return new Promise(function(resolve, reject) {
    https.get('https://raw.githubusercontent.com/jdolan/quetoo/master/src/cgame/default/ui/settings/SystemViewController.json', (resp)=> {
      let data = '';
      resp.on('data', (dataChunk)=> data += dataChunk);
      resp.on('end', ()=> resolve(JSON.parse(data)) );
    }).on('error', reject);
  });
}


module.exports = { searchHeirarchy, getHeirarchy, parseInput, start };
start();
