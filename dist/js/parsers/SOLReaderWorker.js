(function(){function k(){for(var a=[],d=0,b=arguments.length;d<b;d++)a[d]=arguments[d];postMessage({type:"debug",message:a})}function h(a){if(a){var d=a.position;this.tagTypeAndLength=a.readUI16();this.contentLength=this.tagTypeAndLength&63;63==this.contentLength&&(this.contentLength=a.readSI32());this.type=this.tagTypeAndLength>>6;this.headerLength=a.position-d;this.tagLength=this.headerLength+this.contentLength;this.name=f[this.type]?f[this.type].name:"?"}}importScripts("http://cdn.coursevector.com/minerva/4.1.1/js/lib/ByteArray.js","http://cdn.coursevector.com/minerva/4.1.1/js/lib/AMF0.js",
"http://cdn.coursevector.com/minerva/4.1.1/js/lib/AMF3.js");var m=new AMF0,l=new AMF3,f={};f[-1]={name:"Header",func:h};f[2]={name:"LSO",func:function(a,d){this.header=new h(a);if("TCSO"!=a.readUTFBytes(4))throw"Missing TCSO signature, not a SOL file";a.readUTFBytes(6);this.header.fileName=a.readUTFBytes(a.readUnsignedShort());this.header.amfVersion=a.readUnsignedInt();0===this.header.amfVersion||3===this.header.amfVersion?"undefined"==this.header.fileName&&(this.header.fileName="[SOL Name not Set]"):this.header.fileName="[Unsupported SOL format]";
if(0==this.header.amfVersion||3==this.header.amfVersion)for(this.body={};1<a.getBytesAvailable()&&a.position<this.header.contentLength;){var b="",e;3==this.header.amfVersion?(b=l.readString(a).value,e=l.readData(a)):(b=a.readUTF(),e=m.readData(a));a.readUnsignedByte();this.body[b]=e}}};f[3]={name:"FilePath",func:function(a,d){this.header=new h(a);this.filePath=a.readUTFBytes(a.readUnsignedShort(),!0)}};onmessage=function(a){var d=a.data.fileID;a=new ByteArray(a.data.text,ByteArray.BIG_ENDIAN);m.reset();
l.reset();var b=a.position,e={},c=new h(a);for(a.position=b;c;){var g=f[c.type];if(g){var n="LOG - "+a.position+" - "+f[c.type].name+" ("+c.type+") - "+c.contentLength,g=new g.func(a,e);k(n,g);switch(c.type){case 2:e.header=g.header;e.body=g.body;break;case 3:e.flex=g}0!=c.tagLength-(a.position-b)&&k("Error reading "+f[c.type].name+" tag! Start:"+b+" End:"+a.position+" BytesAvailable:"+(c.tagLength-(a.position-b)),g);a.seek(c.tagLength-(a.position-b))}else k("Unknown tag type",c.type),a.seek(c.tagLength);
if(0>=a.getBytesAvailable())break;b=a.position;c=new h(a);a.position=b}postMessage({fileID:d,data:e})}})();
