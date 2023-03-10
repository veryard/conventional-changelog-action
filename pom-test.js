const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('fs')

let content = fs.readFileSync("./pom.xml", 'utf8');

const parser = new XMLParser();
let jObj = parser.parse(content);


console.log(jObj.project);

const builder = new XMLBuilder({
    format: true,
});
    const xmlContent = builder.build(jObj);

console.log(xmlContent);
