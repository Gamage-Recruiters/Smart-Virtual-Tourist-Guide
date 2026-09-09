const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Deatils.jsx', 'utf8');

const target1 = `  const handleSaveDriverDetails = async () => {
    if (`;
const replace1 = `  const handleSaveDriverDetails = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (`;

content = content.replace(target1, replace1);

const target2 = `    } finally {
      setLoading(false);
    }`;
const replace2 = `    } finally {
      setLoading(false);
      setIsEditing(false);
    }`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/components/bidding/Driver_Deatils.jsx', content);
