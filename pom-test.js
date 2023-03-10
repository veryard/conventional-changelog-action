const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('fs')
const objectPath = require('object-path')
let content = fs.readFileSync("./pom.xml", 'utf8');

const parser = new XMLParser();
let jObj = parser.parse(content);

let version_path = 'project.version';

console.log(objectPath.get(jObj, version_path, null));

// const builder = new XMLBuilder({
//     format: true,
// });
//     const xmlContent = builder.build(jObj);

// console.log(xmlContent);
