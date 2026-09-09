const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Deatils.jsx', 'utf8');

const targetStr = 'const handleSaveDriverDetails = async () => {';
const insertStr = '\n    if (!isEditing) {\n      setIsEditing(true);\n      return;\n    }\n';

const index = content.indexOf(targetStr);
if (index !== -1) {
  content = content.slice(0, index + targetStr.length) + insertStr + content.slice(index + targetStr.length);
}

const targetEndStr = '} finally {\n      setLoading(false);\n    }';
const replaceEndStr = '} finally {\n      setLoading(false);\n      setIsEditing(false);\n    }';
content = content.replace(targetEndStr, replaceEndStr);

fs.writeFileSync('src/components/bidding/Driver_Deatils.jsx', content);
